#!/usr/bin/env python3
"""Gera o JSON de actions do assistente ReUse para upload no watsonx Assistant.

Uso:
    python assistant/build_actions.py --base export.json --out assistant/reuse-actions.json

--base é um download da própria instância (Actions > Global settings >
Upload/Download > Download). Dele vêm as configurações globais e as actions de
sistema que não redefinimos aqui. Os identificadores da extensão "ReUse API"
vêm de --catalog-item-id/--spec-hash-id ou de uma chamada já existente no --base.
"""
import argparse
import copy
import json
import re
import sys

SESSION_EMAIL = "email_usuario"
SITE = "https://reuse.obrian.me"

SYSTEM_ACTIONS = {"welcome", "anything_else", "fallback", "run_always"}
SYSTEM_ENTITIES = {"danger_words", "profane_words"}

API = {
    "searchItems": ("GET", "/api/assistant/items"),
    "createItem": ("POST", "/api/assistant/items"),
    "listMyItems": ("POST", "/api/assistant/my-items"),
    "pauseMyItems": ("POST", "/api/assistant/my-items/pause"),
    "resumeMyItems": ("POST", "/api/assistant/my-items/resume"),
    "markItemTraded": ("POST", "/api/assistant/my-items/mark-traded"),
}


# --------------------------------------------------------------------------
# Blocos de saída e de condição no formato do watsonx Assistant
# --------------------------------------------------------------------------

def session(name):
    return {"skill_variable": name}


def answer(step):
    return {"variable": step}


def result(step, path):
    return {"variable": f"{step}_result_1", "variable_path": path}


def say(*parts):
    concat = [{"scalar": part} if isinstance(part, str) else part for part in parts]
    return {
        "values": [{"text_expression": {"concat": concat}}],
        "response_type": "text",
        "selection_policy": "sequential",
    }


def menu(*labels):
    """Botões; cada clique envia o próprio texto e dispara a action correspondente."""
    return {
        "options": [{"label": label, "value": {"input": {"text": label}}} for label in labels],
        "response_type": "option",
        "repeat_on_reprompt": True,
    }


def is_yes(step):
    return {"eq": [answer(step), {"scalar": "yes"}]}


def is_no(step):
    return {"eq": [answer(step), {"scalar": "no"}]}


def exists(ref):
    return {"exists": ref}


def all_of(*conditions):
    return {"and": list(conditions)}


def call_ok(step):
    return {"eq": [result(step, "success"), {"scalar": True}]}


def call_failed(step):
    return {"eq": [result(step, "success"), {"scalar": False}]}


INVALID_ANSWER_HANDLERS = [
    {
        "type": "not_found",
        "title": "validation_not_found_handler",
        "output": {"generic": [say("Não entendi sua resposta 😅 Pode tentar de novo?")]},
        "handler": "validation_not_found_handler",
        "resolver": {"type": "prompt_again"},
        "next_handler": "validation_not_found_max_tries_handler",
    },
    {
        "type": "not_found_max_tries",
        "title": "validation_not_found_max_tries_handler",
        "handler": "validation_not_found_max_tries_handler",
        "resolver": {"type": "fallback"},
    },
]


# --------------------------------------------------------------------------
# Montagem de actions
# --------------------------------------------------------------------------

class Action:
    def __init__(self, ident, title, examples=None, condition=None):
        self.ident = ident
        self.title = title
        self.examples = examples or []
        self.condition = condition
        self.steps = []
        self.variables = []
        self.counter = 0

    def next_id(self):
        self.counter += 1
        return f"step_{self.ident.removeprefix('action_')}_{self.counter}"

    def step(self, *outputs, question=None, condition=None, set_vars=None,
             resolver=None, data_type="any"):
        sid = self.next_id()
        resolver = json.loads(json.dumps(resolver or {"type": "continue"}).replace("__SELF__", sid))
        step = {"step": sid, "type": "standard", "handlers": [], "resolver": resolver, "variable": sid}
        if outputs:
            step["output"] = {"generic": list(outputs)}
        if question:
            step["question"] = question
            if "entity" in question:
                step["handlers"] = copy.deepcopy(INVALID_ANSWER_HANDLERS)
        if condition:
            step["condition"] = condition
        if set_vars:
            step["context"] = {
                "variables": [{"value": value, "skill_variable": name} for name, value in set_vars.items()]
            }
        self.steps.append(step)

        variable = {"variable": sid, "data_type": data_type, "privacy": {"enabled": False}}
        title = step_title(outputs)
        if title:
            variable["title"] = title
        self.variables.append(variable)
        return sid

    def call(self, operation, body=None, query=None, condition=None, set_vars=None):
        method, path = API[operation]
        sid = self.next_id()
        mapping = {}
        if body:
            mapping["body"] = [{"value": value, "parameter": name} for name, value in body.items()]
        if query:
            mapping["query"] = [{"value": value, "parameter": name} for name, value in query.items()]
        step = {
            "step": sid,
            "type": "standard",
            "handlers": [],
            "resolver": {
                "type": "callout",
                "callout": {
                    "path": path,
                    "type": "integration_interaction",
                    "method": method,
                    "internal": "__EXTENSION__",
                    "request_mapping": mapping,
                    "result_variable": f"{sid}_result_1",
                },
            },
            "variable": sid,
        }
        if condition:
            step["condition"] = condition
        if set_vars:
            step["context"] = {
                "variables": [{"value": value, "skill_variable": name} for name, value in set_vars.items()]
            }
        self.steps.append(step)
        self.variables.append({"variable": sid, "data_type": "any", "privacy": {"enabled": False}})
        self.variables.append({"variable": f"{sid}_result_1", "data_type": "any", "privacy": {"enabled": False}})
        return sid

    def show_result(self, call_step, condition=None):
        """Mostra o body.message da API, ou um aviso se a chamada falhou."""
        ok = call_ok(call_step) if condition is None else all_of(condition, call_ok(call_step))
        failed = call_failed(call_step) if condition is None else all_of(condition, call_failed(call_step))
        self.step(say(result(call_step, "body.message")), condition=ok)
        self.step(
            say("Não consegui falar com o ReUse agora 😕 Tente de novo em alguns instantes."),
            condition=failed,
        )

    def ask_email(self):
        """Pede o e-mail só na primeira tarefa da conversa e guarda na sessão."""
        asked = self.step(
            say("Para isso preciso do e-mail da sua conta no ReUse. Qual é?"),
            question={"entity": "entity_email", "max_tries": 3},
            condition=NOT_DEFINED(SESSION_EMAIL),
        )
        self.step(condition=exists(answer(asked)), set_vars={SESSION_EMAIL: answer(asked)})

    def build(self, next_action=None):
        for current, following in zip(self.steps, self.steps[1:]):
            current["next_step"] = following["step"]
        action = {
            "type": "standard",
            "steps": self.steps,
            "title": self.title,
            "action": self.ident,
            "boosts": [],
            "handlers": [],
            "condition": self.condition or {"intent": f"{self.ident}_intent_1"},
            "variables": self.variables,
            "launch_mode": "learning",
            "topic_switch": {"allowed_from": True, "allowed_into": True, "never_return": False},
            "disambiguation_opt_out": self.ident in SYSTEM_ACTIONS,
        }
        if next_action:
            action["next_action"] = next_action
        return action

    def intent(self):
        if not self.examples:
            return None
        return {
            "intent": f"{self.ident}_intent_1",
            "examples": [{"text": text} for text in self.examples],
        }


def step_title(outputs):
    for output in outputs:
        for value in output.get("values", []):
            text = "".join(
                part.get("scalar", "{variable}") for part in value["text_expression"]["concat"]
            )
            text = re.sub(r"\s+", " ", re.sub(r"[*#]", "", text)).strip()
            if text:
                return text[:64]
    return None


# Preenchido em main() com o formato que a própria instância usa para
# "variável de sessão não definida" (lido da action de teste do --base)
NOT_DEFINED = None


# --------------------------------------------------------------------------
# Entidades (respostas por opção e validação de e-mail)
# --------------------------------------------------------------------------

def option_entity(name, values):
    return {
        "entity": name,
        "values": [
            {"type": "synonyms", "value": value, "synonyms": synonyms}
            for value, synonyms in values.items()
        ],
        "fuzzy_match": True,
    }


ENTITIES = [
    # Entidades de sistema usadas nas perguntas precisam estar declaradas
    {"entity": "sys-number", "values": []},
    {"entity": "sys-yes-no", "values": []},
    {
        "entity": "entity_email",
        "values": [
            {
                "type": "patterns",
                "value": "email",
                "patterns": [r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b"],
            }
        ],
        "fuzzy_match": False,
    },
    option_entity(
        "entity_categoria",
        {
            "Móveis": ["moveis", "móvel", "movel", "cadeira", "mesa", "sofá", "sofa", "armário", "estante", "cama"],
            "Plantas": ["planta", "muda", "vaso de planta", "suculenta", "flores"],
            "Bicicletas": ["bicicleta", "bike", "bikes", "patinete"],
            "Decoração": ["decoracao", "decoração", "enfeite", "quadro", "vaso", "luminária"],
            "Eletrônicos": ["eletronicos", "eletrônico", "eletronico", "celular", "monitor", "notebook", "tv", "som"],
            "Outros": ["outro", "outra coisa", "roupa", "livro", "brinquedo"],
        },
    ),
    option_entity(
        "entity_estado",
        {
            "Novo": ["nunca usado", "lacrado", "na caixa"],
            "Excelente": ["seminovo", "quase novo", "ótimo", "otimo"],
            "Bom": ["usado", "bom estado", "funcionando"],
            "Regular": ["com defeito", "gasto", "desgastado", "marcas de uso"],
        },
    ),
]

CATEGORIES = ["Móveis", "Plantas", "Bicicletas", "Decoração", "Eletrônicos", "Outros"]
CONDITIONS = ["Novo", "Excelente", "Bom", "Regular"]

# Até 4 opções o web chat mostra botões; acima disso vira uma lista suspensa
MAIN_MENU = menu(
    "Anunciar um item",
    "Buscar itens",
    "Meus anúncios",
    "O que você sabe fazer?",
)


# --------------------------------------------------------------------------
# Conversa
# --------------------------------------------------------------------------

def system_actions():
    welcome = Action("welcome", "Saudação", condition={"expression": "welcome"})
    welcome.step(
        say(
            "Olá! 👋 Sou o assistente virtual do **ReUse!**, a plataforma de trocas "
            "e doações de Osasco e região.\n\nPosso **fazer tarefas por você**, como "
            "anunciar um item, pausar ou reativar suas ofertas e registrar uma troca, "
            "e também **tirar dúvidas** sobre como usar a plataforma. Por onde começamos?"
        ),
        MAIN_MENU,
        resolver={"type": "end_action"},
    )

    no_match = Action("anything_else", "Não entendi", condition={"expression": "anything_else"})
    no_match.step(
        say(
            "Hmm, não entendi 🤔 Tente com outras palavras ou escolha uma das opções:"
        ),
        MAIN_MENU,
        condition={"lte": [{"system_variable": "no_action_matches_count"}, {"scalar": 3}]},
        resolver={"type": "end_action"},
    )
    no_match.step(
        say(""),
        condition={"gt": [{"system_variable": "no_action_matches_count"}, {"scalar": 3}]},
        resolver={
            "type": "invoke_another_action_and_end",
            "invoke_action": {"action": "fallback", "policy": "default", "parameters": None,
                              "result_variable": "__SELF___result_1"},
        },
    )

    fallback = Action("fallback", "Ajuda extra", condition={"intent": "fallback_connect_to_agent"})
    fallback.step(
        say(
            "Parece que não estou conseguindo te ajudar com isso 😕 Ainda não temos "
            "atendimento humano pelo chat. Você pode reformular a pergunta ou escolher "
            "um dos assuntos que eu domino:"
        ),
        MAIN_MENU,
        resolver={"type": "end_action"},
    )
    return [welcome, no_match, fallback]


def task_actions():
    actions = []

    # T1: o exemplo do enunciado
    pause = Action("action_101", "Pausar minhas ofertas", [
        "quero pausar minhas ofertas ativas",
        "Pausar minhas ofertas",
        "pausar meus anúncios",
        "tira meus itens do ar",
        "vou viajar, pausa todos os meus anúncios",
        "desativar minhas ofertas",
        "suspender meus anúncios por um tempo",
    ])
    pause.ask_email()
    confirm = pause.step(
        say(
            "Vou pausar **todas** as suas ofertas ativas. Elas saem do catálogo até "
            "você pedir para reativar. Posso continuar?"
        ),
        menu("Sim", "Não"),
        question={"entity": "sys-yes-no", "max_tries": 3, "response_collection_behavior": "always_ask"},
        data_type="yes_no",
    )
    call = pause.call("pauseMyItems", body={"email": session(SESSION_EMAIL)}, condition=is_yes(confirm))
    pause.show_result(call, condition=is_yes(confirm))
    pause.step(say("Tudo bem, não mexi em nada. Suas ofertas continuam no ar 👍"), condition=is_no(confirm))
    actions.append(pause)

    # T2
    resume = Action("action_102", "Reativar minhas ofertas", [
        "Reativar minhas ofertas",
        "quero reativar meus anúncios",
        "voltar minhas ofertas para o catálogo",
        "despausar meus itens",
        "colocar meus anúncios no ar de novo",
        "ativar minhas ofertas pausadas",
    ])
    resume.ask_email()
    call = resume.call("resumeMyItems", body={"email": session(SESSION_EMAIL)})
    resume.show_result(call)
    actions.append(resume)

    # T3
    mine = Action("action_103", "Meus anúncios", [
        "Meus anúncios",
        "quais itens eu anunciei?",
        "ver minhas ofertas",
        "qual o status dos meus anúncios",
        "listar meus itens",
        "o que eu tenho publicado?",
    ])
    mine.ask_email()
    call = mine.call("listMyItems", body={"email": session(SESSION_EMAIL)})
    mine.show_result(call)
    actions.append(mine)

    # T4
    create = Action("action_104", "Anunciar um item", [
        "Anunciar um item",
        "quero anunciar um item",
        "publicar um anúncio",
        "quero doar um objeto",
        "cadastrar um item para troca",
        "quero trocar uma coisa que não uso mais",
        "Quero anunciar agora",
    ])
    create.ask_email()
    title = create.step(
        say("Vamos lá! Qual é o **título** do anúncio? Ex.: Cadeira de escritório ergonômica"),
        question={"free_text": True},
    )
    category = create.step(
        say("Em qual **categoria** ele se encaixa?"),
        menu(*CATEGORIES),
        question={"entity": "entity_categoria", "max_tries": 3},
    )
    condition = create.step(
        say("Qual é o **estado de conservação**?"),
        menu(*CONDITIONS),
        question={"entity": "entity_estado", "max_tries": 3},
    )
    description = create.step(
        say(
            "Agora uma **descrição**: conte o estado, medidas, defeitos e o que você "
            "aceita em troca (ou se é doação)."
        ),
        question={"free_text": True},
    )
    confirm = create.step(
        say(
            "Confere o anúncio:\n\n**", answer(title), "**\nCategoria: ", answer(category),
            "\nEstado: ", answer(condition), "\n", answer(description),
            "\n\nPosso publicar?",
        ),
        menu("Sim", "Não"),
        question={"entity": "sys-yes-no", "max_tries": 3, "response_collection_behavior": "always_ask"},
        data_type="yes_no",
    )
    call = create.call(
        "createItem",
        body={
            "email": session(SESSION_EMAIL),
            "title": answer(title),
            "category": answer(category),
            "condition": answer(condition),
            "description": answer(description),
        },
        condition=is_yes(confirm),
    )
    create.show_result(call, condition=is_yes(confirm))
    create.step(
        say('Sem problemas, o anúncio não foi publicado. Quando quiser, é só dizer "anunciar um item".'),
        condition=is_no(confirm),
    )
    actions.append(create)

    # T5
    traded = Action("action_105", "Registrar uma troca", [
        "Registrar uma troca",
        "já troquei meu item",
        "marcar item como trocado",
        "finalizei uma troca",
        "meu item já foi doado",
        "concluí a troca da minha bicicleta",
    ])
    traded.ask_email()
    listing = traded.call("listMyItems", body={"email": session(SESSION_EMAIL)})
    traded.show_result(listing)
    has_items = all_of(call_ok(listing), {"gt": [result(listing, "body.total"), {"scalar": 0}]})
    code = traded.step(
        say("Qual é o **código** do item que foi trocado? É o número depois do #."),
        question={"entity": "sys-number", "max_tries": 3},
        condition=has_items,
        data_type="number",
    )
    call = traded.call(
        "markItemTraded",
        body={"email": session(SESSION_EMAIL), "itemId": answer(code)},
        condition=exists(answer(code)),
    )
    traded.show_result(call, condition=exists(answer(code)))
    actions.append(traded)

    # T6
    search = Action("action_106", "Buscar itens", [
        "Buscar itens",
        "procurar uma bicicleta",
        "tem cadeira disponível?",
        "quero encontrar um monitor",
        "estou procurando móveis",
        "vocês têm plantas?",
        "Buscar um item agora",
    ])
    query = search.step(
        say("O que você está procurando? Pode ser uma palavra, como **bicicleta** ou **vaso**."),
        question={"free_text": True},
    )
    call = search.call("searchItems", query={"query": answer(query)})
    search.show_result(call)
    actions.append(search)

    # Troca do e-mail guardado na sessão
    email = Action("action_107", "Usar outro e-mail", [
        "usar outro e-mail",
        "quero trocar o e-mail",
        "esse não é meu e-mail",
        "mudar a conta",
        "errei meu e-mail",
    ])
    new_email = email.step(
        say("Sem problemas! Qual e-mail devo usar a partir de agora?"),
        question={"entity": "entity_email", "max_tries": 3},
    )
    email.step(
        say("Pronto, agora vou usar ", answer(new_email), " nas suas solicitações. 👍"),
        set_vars={SESSION_EMAIL: answer(new_email)},
    )
    actions.append(email)

    return actions


def guide(ident, title, examples, text, *extra):
    action = Action(ident, title, examples)
    action.step(say(text), *extra, resolver={"type": "end_action"})
    return action


def guidance_actions():
    return [
        guide("action_201", "Como anunciar um item", [
            "como cadastrar um novo item para troca?",
            "como anuncio um objeto",
            "como faço para publicar um anúncio",
            "como coloco um item para doação",
            "passo a passo para anunciar",
            "como divulgo algo que não uso mais",
        ],
            "Anunciar no ReUse leva menos de 2 minutos. **Pelo site:**\n\n"
            f"1. Acesse [reuse.obrian.me]({SITE}) e clique em **Criar anúncio**, o botão verde no topo.\n"
            "2. Informe seu **nome** e **e-mail**. O e-mail identifica seus anúncios.\n"
            "3. Escreva um **título** claro, como \"Cadeira de escritório ergonômica\".\n"
            "4. Escolha a **categoria**: Móveis, Plantas, Bicicletas, Decoração, Eletrônicos ou Outros.\n"
            "5. Na **descrição**, conte o estado, as medidas e o que aceita em troca.\n"
            "6. Selecione o **estado de conservação** e clique em **Publicar anúncio**.\n\n"
            "**Pelo app:** toque no botão **+** no centro da barra inferior e preencha os mesmos campos.\n\n"
            "💡 Se preferir, eu publico para você aqui mesmo:",
            menu("Quero anunciar agora", "Dicas para um bom anúncio"),
        ),
        guide("action_202", "Como funciona uma troca", [
            "Como funciona uma troca?",
            "como faço uma troca",
            "como consigo um item anunciado",
            "como negociar com outro usuário",
            "quero pegar um item, o que faço",
            "o reuse é para vender?",
        ],
            "No ReUse ninguém vende nada: as pessoas **trocam ou doam** o que não usam mais. O caminho é este:\n\n"
            "1. **Encontre** um item no catálogo, ou peça para mim: \"procurar bicicleta\".\n"
            "2. Abra o anúncio e toque em **Tenho interesse no item**.\n"
            "3. **Converse** com quem anunciou pela aba **Chat** do app e combinem a troca (ou a doação), o dia e o local.\n"
            "4. **Encontrem-se** em um lugar público e confiram o item antes de fechar.\n"
            "5. Quem anunciou **registra a troca**, que pode ser aqui comigo. O item sai do catálogo e entra na conta de impacto ambiental 🌱",
            menu("Buscar itens", "Dicas de segurança", "Registrar uma troca"),
        ),
        guide("action_203", "Como buscar e filtrar itens", [
            "como encontro itens perto de mim",
            "como pesquisar um objeto",
            "como filtrar por categoria",
            "onde vejo os itens disponíveis",
            "como usar a busca do site",
        ],
            "Para achar itens no ReUse:\n\n"
            "• **Por palavra**: no site, digite no campo \"Encontre itens próximos...\" e clique na lupa 🔎.\n"
            "• **Por categoria**: use os botões Todos, Móveis, Plantas, Bicicletas, Decoração e Eletrônicos, logo acima do catálogo.\n"
            "• **Perto de você**: no app, a aba **Explorar** busca pelo seu CEP e mostra o mapa da região.\n"
            "• **Comigo**: diga o que procura e eu listo os itens disponíveis com o link de cada um.\n\n"
            "Só aparecem itens **ativos**. Anúncios pausados ou já trocados ficam ocultos.",
            menu("Buscar um item agora"),
        ),
        guide("action_204", "Estados de conservação", [
            "qual estado de conservação devo escolher",
            "o que significa estado bom",
            "diferença entre excelente e bom",
            "como classifico o estado do meu item",
            "o que é estado regular",
        ],
            "Escolha o estado com sinceridade. Isso evita frustração na hora da troca:\n\n"
            "• **Novo**: nunca usado, ou ainda na embalagem.\n"
            "• **Excelente**: usado poucas vezes, sem marcas visíveis.\n"
            "• **Bom**: tem sinais normais de uso, mas funciona perfeitamente.\n"
            "• **Regular**: tem marcas, desgaste ou pequenos defeitos. Descreva todos no anúncio.\n\n"
            "Na dúvida, escolha o estado mais baixo e explique os detalhes na descrição.",
        ),
        guide("action_205", "Dicas para um bom anúncio", [
            "Dicas para um bom anúncio",
            "como faço meu anúncio chamar atenção",
            "como escrever a descrição do item",
            "como tirar boas fotos do item",
            "meu anúncio não tem interessados",
        ],
            "Anúncios completos são trocados mais rápido:\n\n"
            "1. **Título específico**: \"Bicicleta aro 26 com marchas\" funciona melhor que \"Bicicleta\".\n"
            "2. **Descrição honesta**: medidas, tempo de uso, defeitos e o que vem junto (cabos, manual, capa...).\n"
            "3. **Diga o que aceita em troca**, ou se é doação.\n"
            "4. **Fotos com luz natural** e fundo limpo, mostrando detalhes e defeitos (no app dá para enviar até 10 fotos).\n"
            "5. **Responda rápido** no chat: quem demora perde a troca 😉",
            menu("Quero anunciar agora"),
        ),
        guide("action_206", "O que posso anunciar", [
            "o que posso anunciar",
            "posso anunciar roupas?",
            "o que é proibido anunciar",
            "posso vender no reuse?",
            "quais são as regras da plataforma",
        ],
            "O ReUse é feito para **trocar ou doar objetos em condição de uso**: móveis, plantas, "
            "bicicletas, decoração, eletrônicos e outros itens do dia a dia.\n\n"
            "**Não é permitido anunciar:**\n"
            "• venda por dinheiro ou prestação de serviços;\n"
            "• alimentos, medicamentos, cosméticos abertos ou produtos vencidos;\n"
            "• animais;\n"
            "• armas, itens ilegais, falsificados ou de origem duvidosa;\n"
            "• itens quebrados sem conserto (para esses, procure um ponto de reciclagem ♻️).\n\n"
            "Anúncios fora das regras podem ser removidos pela moderação.",
        ),
        guide("action_207", "Dicas de segurança", [
            "Dicas de segurança",
            "é seguro trocar com desconhecidos?",
            "onde encontrar a pessoa para trocar",
            "como evitar golpes",
            "cuidados na hora da troca",
        ],
            "Algumas dicas para trocar com tranquilidade:\n\n"
            "• Combine o encontro em um **local público e movimentado**, de preferência de dia.\n"
            "• Se puder, **vá acompanhado** e avise alguém do horário.\n"
            "• **Confira o item** antes de concluir: ligue eletrônicos e teste as partes móveis.\n"
            "• Mantenha a conversa no **chat do ReUse**, assim tudo fica registrado.\n"
            "• **Nunca envie dinheiro nem dados pessoais** (documentos, senhas, cartões). Trocas no ReUse não envolvem pagamento.\n"
            "• Desconfie de propostas apressadas ou boas demais.",
        ),
        guide("action_208", "Pausar, reativar ou encerrar anúncios", [
            "como pausar um anúncio",
            "como tiro meu item do ar",
            "como excluir um anúncio",
            "vou viajar, o que faço com meus anúncios",
            "como reativar um anúncio pausado",
        ],
            "Você controla a visibilidade dos seus anúncios:\n\n"
            "• **Pausar**: o item sai do catálogo, mas o anúncio fica guardado. Bom para quando você vai viajar ou já está negociando.\n"
            "• **Reativar**: o item volta para o catálogo do jeito que estava.\n"
            "• **Trocado**: registre quando a troca acontecer. O item sai do catálogo de vez e entra na sua conta de impacto 🌱\n\n"
            "Eu faço isso por você agora mesmo:",
            menu("Pausar minhas ofertas", "Reativar minhas ofertas", "Registrar uma troca"),
        ),
        guide("action_209", "Conta e cadastro", [
            "como criar uma conta",
            "como me cadastro",
            "como faço login",
            "preciso de conta para anunciar?",
            "como entro no aplicativo",
        ],
            "• **No app**: na tela de acesso, toque em **Cadastrar** e informe nome, e-mail e senha. Depois é só usar **Entrar** com os mesmos dados.\n"
            "• **No site**: não precisa de senha. O seu **e-mail** identifica seus anúncios, então use sempre o mesmo ao anunciar e ao falar comigo.",
            menu("Anunciar um item", "Meus anúncios"),
        ),
        guide("action_210", "Impacto ambiental e pontos", [
            "o que é a economia de CO2",
            "como funciona a métrica de carbono",
            "qual o impacto de trocar um item",
            "o que são os pontos do app",
            "por que reutilizar é importante",
        ],
            "Cada objeto reaproveitado é um objeto a menos sendo fabricado e descartado. No ReUse estimamos "
            "**cerca de 14,5 kg de CO₂ evitados por item reaproveitado**. O número aparece no banner da página "
            "inicial e em cada anúncio.\n\n"
            "No app você também acumula **pontos** ao publicar e concluir trocas, e acompanha tudo na aba **Perfil**.\n\n"
            "Trocar em vez de comprar economiza dinheiro, reduz lixo e fortalece a comunidade da sua região 💚",
        ),
        guide("action_211", "O que o assistente sabe fazer", [
            "O que você sabe fazer?",
            "ajuda",
            "menu",
            "quais são as opções",
            "como você pode me ajudar",
        ],
            "**Tarefas que eu faço por você:**\n"
            "• anunciar um item\n• buscar itens disponíveis\n• listar seus anúncios\n"
            "• pausar ou reativar suas ofertas\n• registrar uma troca\n• trocar o e-mail da conversa\n\n"
            "**Dúvidas que eu respondo:**\n"
            "• como anunciar e dicas de anúncio\n• como funciona uma troca\n• busca e filtros\n"
            "• estados de conservação\n• o que pode ser anunciado\n• segurança na troca\n"
            "• conta e cadastro\n• impacto ambiental e pontos",
            MAIN_MENU,
        ),
        guide("action_212", "Agradecimento", [
            "obrigado",
            "valeu",
            "muito obrigada",
            "ajudou demais",
            "tchau",
        ],
            "Por nada! 💚 Sempre que precisar, é só chamar. Boas trocas!",
        ),
    ]


# --------------------------------------------------------------------------
# Leitura do download da instância e montagem final
# --------------------------------------------------------------------------

def walk(node):
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from walk(value)
    elif isinstance(node, list):
        for value in node:
            yield from walk(value)


def extension_internal(workspace, args):
    """Identificadores da extensão "ReUse API" na instância.

    Vêm dos argumentos (GET .../catalog/integrations do AI assistant builder)
    ou de uma chamada de extensão já existente no --base.
    """
    if args.catalog_item_id:
        internal = {"catalog_item_id": args.catalog_item_id}
        if args.spec_hash_id:
            internal["spec_hash_id"] = args.spec_hash_id
        return internal
    for node in walk(workspace.get("actions", [])):
        callout = node.get("callout") if isinstance(node.get("callout"), dict) else None
        if callout and callout.get("type") == "integration_interaction":
            return callout["internal"]
    sys.exit("Informe --catalog-item-id ou use um --base que já tenha uma chamada à extensão.")


def not_defined_shape(workspace):
    """Formato de "variável de sessão is not defined": o da instância, se o --base tiver um."""
    for node in walk(workspace.get("actions", [])):
        condition = node.get("condition")
        if isinstance(condition, dict) and SESSION_EMAIL in json.dumps(condition) and "exists" in json.dumps(condition):
            template = json.dumps(condition)
            return lambda name: json.loads(template.replace(SESSION_EMAIL, name))
    return lambda name: {"not": {"exists": {"skill_variable": name}}}


def main():
    global NOT_DEFINED
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("--base", required=True, help="download das actions da instância")
    parser.add_argument("--out", required=True, help="arquivo JSON gerado para upload")
    parser.add_argument("--catalog-item-id", help="catalog_item_id da extensão ReUse API")
    parser.add_argument("--spec-hash-id", help="spec_hash_id da extensão ReUse API")
    args = parser.parse_args()

    with open(args.base, encoding="utf-8") as file:
        base = json.load(file)
    workspace = base["workspace"]
    internal = extension_internal(workspace, args)
    NOT_DEFINED = not_defined_shape(workspace)

    ours = system_actions() + task_actions() + guidance_actions()
    built = {action.ident: action.build() for action in ours}
    for action in workspace["actions"]:
        if action["action"] in SYSTEM_ACTIONS and action["action"] not in built:
            built[action["action"]] = copy.deepcopy(action)

    # O watsonx exige uma corrente única de next_action passando por todas as
    # actions: welcome → actions criadas → fallback → run_always → anything_else
    custom = [action.ident for action in ours if action.ident not in SYSTEM_ACTIONS]
    order = ["welcome", *custom, "fallback", "run_always", "anything_else"]
    order = [ident for ident in order if ident in built]
    actions = []
    for index, ident in enumerate(order):
        action = built[ident]
        action.pop("next_action", None)
        if index + 1 < len(order):
            action["next_action"] = order[index + 1]
        actions.append(action)

    text = json.dumps(actions, ensure_ascii=False).replace('"__EXTENSION__"', json.dumps(internal))
    actions = json.loads(text)

    intents = [i for i in workspace.get("intents", []) if not i["intent"].startswith("action_")]
    intents += [intent for intent in (a.intent() for a in ours) if intent]

    ours_by_name = {e["entity"] for e in ENTITIES}
    entities = [e for e in workspace.get("entities", [])
                if (e["entity"].startswith("sys-") or e["entity"] in SYSTEM_ENTITIES)
                and e["entity"] not in ours_by_name]
    entities += ENTITIES

    variables = [v for v in workspace.get("variables", []) if v["variable"] != SESSION_EMAIL]
    variables.append({
        "title": SESSION_EMAIL,
        "privacy": {"enabled": True},
        "variable": SESSION_EMAIL,
        "data_type": "string",
        "description": "E-mail da conta ReUse informado pelo usuário na conversa",
    })

    workspace.update({
        "actions": actions,
        "intents": intents,
        "entities": entities,
        "variables": variables,
        "language": workspace.get("language", "pt-br"),
    })
    counts = {
        "actions": len(actions),
        "intents": len(intents),
        "entities": len(entities),
        "data_types": len(workspace.get("data_types", [])),
        "collections": len(workspace.get("collections", [])),
        "global_variables": len(variables),
    }
    base["counts"] = counts
    workspace.setdefault("metadata", {}).setdefault("skill", {})["counts"] = counts
    base["name"] = base.get("name") or "ReUse"

    with open(args.out, "w", encoding="utf-8") as file:
        json.dump(base, file, ensure_ascii=False, indent=2)

    print(f"{args.out}: {len(actions)} actions, {len(intents)} intents, {len(entities)} entidades")


if __name__ == "__main__":
    main()

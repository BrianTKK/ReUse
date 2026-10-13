import { findUserByEmail, parseEmail } from "../users";
import { badRequest, readJson, reply } from "./http";

// Identifica o dono dos anúncios pelo e-mail informado na conversa
export async function loadOwner(request: Request) {
  const body = await readJson(request);
  const email = parseEmail(body.email);

  if (!email) {
    return { error: badRequest("Informe um e-mail válido.") } as const;
  }

  const user = await findUserByEmail(email);

  if (!user) {
    return {
      error: reply(
        false,
        `Não encontrei nenhuma conta no ReUse com o e-mail ${email}. Confira se digitou certo ou publique seu primeiro item dizendo "quero anunciar um item".`
      ),
    } as const;
  }

  return { body, user } as const;
}

import { db } from "@/src/prisma/db";
import {
  DEFAULT_CITY,
  imageForCategory,
  parseCategory,
  parseCondition,
} from "@/src/catalog";
import { findOrCreateUser, parseEmail } from "@/src/users";
import {
  badRequest,
  baseUrl,
  isAuthorized,
  readJson,
  reply,
  serverError,
  unauthorized,
} from "@/src/assistant/http";
import { matchesQuery, plural, toItemSummary } from "@/src/assistant/items";

const MAX_RESULTS = 5;

// Busca itens disponíveis no catálogo (tarefa "buscar itens")
export async function GET(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query")?.trim() || "";
    const category = parseCategory(searchParams.get("category"));
    const origin = baseUrl(request);

    const items = await db.orm.public.Item
      .where(category ? { status: "active", category } : { status: "active" })
      .orderBy((item) => item.createdAt.desc())
      .all();

    const found = items.filter((item) => matchesQuery(item, query));
    const shown = found.slice(0, MAX_RESULTS).map((item) => toItemSummary(item, origin));
    const term = query || category || "o catálogo";

    if (found.length === 0) {
      return reply(
        true,
        `Não encontrei itens disponíveis para "${term}" agora. Tente outra palavra ou veja todas as categorias em ${origin}.`,
        { total: 0, items: [] }
      );
    }

    const lines = shown.map(
      (item, index) =>
        `${index + 1}. **${item.title}** (${item.category}, ${item.condition}) em ${item.city}: [ver anúncio](${item.url})`
    );
    const more =
      found.length > shown.length
        ? `\n\nMostrei os ${shown.length} mais recentes. Veja todos em ${origin}/?busca=${encodeURIComponent(query)}`
        : "";

    return reply(
      true,
      `Encontrei ${plural(found.length, "item disponível", "itens disponíveis")} para "${term}":\n\n${lines.join("\n")}${more}`,
      { total: found.length, items: shown }
    );
  } catch (error) {
    return serverError(error);
  }
}

// Publica um item pela conversa (tarefa "anunciar item")
export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  const body = await readJson(request);
  const email = parseEmail(body.email);
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const category = parseCategory(body.category);
  const condition = parseCondition(body.condition);

  if (!email) return badRequest("Informe um e-mail válido.");
  if (!title) return badRequest("Informe o título do item.");
  if (!description) return badRequest("Informe uma descrição para o item.");
  if (!category) return badRequest("Categoria inválida.");
  if (!condition) return badRequest("Estado de conservação inválido.");

  try {
    const user = await findOrCreateUser(email, typeof body.name === "string" ? body.name : null);

    const item = await db.orm.public.Item.create({
      title,
      description,
      category,
      condition,
      city: DEFAULT_CITY,
      image: imageForCategory(category),
      status: "active",
      userId: user.id,
    });

    const summary = toItemSummary(item, baseUrl(request));

    return reply(
      true,
      `Pronto! Seu anúncio **${item.title}** foi publicado em ${category} (estado: ${condition}) com o código #${item.id}. Ele já aparece no catálogo: [ver anúncio](${summary.url})`,
      { item: summary }
    );
  } catch (error) {
    return serverError(error);
  }
}

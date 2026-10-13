import { db } from "@/src/prisma/db";
import { baseUrl, isAuthorized, reply, serverError, unauthorized } from "@/src/assistant/http";
import { plural, toItemSummary } from "@/src/assistant/items";
import { loadOwner } from "@/src/assistant/owner";

// Lista os anúncios do usuário com o status de cada um (tarefa "meus anúncios").
// É POST porque o e-mail vai no corpo, e não na URL.
export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const owner = await loadOwner(request);
    if (owner.error) return owner.error;

    const origin = baseUrl(request);
    const items = (
      await db.orm.public.Item
        .where({ userId: owner.user.id })
        .orderBy((item) => item.createdAt.desc())
        .all()
    ).map((item) => toItemSummary(item, origin));

    if (items.length === 0) {
      return reply(
        true,
        'Você ainda não tem anúncios no ReUse. Quer publicar o primeiro? É só dizer "quero anunciar um item".',
        { total: 0, active: 0, paused: 0, traded: 0, items: [] }
      );
    }

    const count = (status: string) => items.filter((item) => item.status === status).length;
    const active = count("active");
    const paused = count("paused");
    const traded = count("traded");

    const lines = items.map(
      (item) => `• #${item.id} **${item.title}** (${item.category}): ${item.statusLabel}`
    );

    return reply(
      true,
      `Você tem ${plural(items.length, "anúncio", "anúncios")}: ${active} ativo(s), ${paused} pausado(s) e ${traded} trocado(s).\n\n${lines.join("\n")}`,
      { total: items.length, active, paused, traded, items }
    );
  } catch (error) {
    return serverError(error);
  }
}

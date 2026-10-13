import { db } from "@/src/prisma/db";
import { isAuthorized, reply, serverError, unauthorized } from "@/src/assistant/http";
import { listTitles, plural } from "@/src/assistant/items";
import { loadOwner } from "@/src/assistant/owner";

// Reativa as ofertas pausadas do usuário (tarefa "reativar ofertas")
export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const owner = await loadOwner(request);
    if (owner.error) return owner.error;

    const resumed = await db.orm.public.Item
      .where({ userId: owner.user.id, status: "paused" })
      .updateAll({ status: "active" });

    if (resumed.length === 0) {
      return reply(true, "Você não tem ofertas pausadas para reativar.", { count: 0 });
    }

    return reply(
      true,
      `Prontinho! Reativei ${plural(resumed.length, "oferta", "ofertas")}: ${listTitles(resumed)}. Elas já voltaram para o catálogo.`,
      { count: resumed.length, itemIds: resumed.map((item) => item.id) }
    );
  } catch (error) {
    return serverError(error);
  }
}

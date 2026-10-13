import { db } from "@/src/prisma/db";
import { isAuthorized, reply, serverError, unauthorized } from "@/src/assistant/http";
import { listTitles, plural } from "@/src/assistant/items";
import { loadOwner } from "@/src/assistant/owner";

// Pausa todas as ofertas ativas do usuário (tarefa "pausar minhas ofertas")
export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const owner = await loadOwner(request);
    if (owner.error) return owner.error;

    const paused = await db.orm.public.Item
      .where({ userId: owner.user.id, status: "active" })
      .updateAll({ status: "paused" });

    if (paused.length === 0) {
      return reply(true, "Você não tem ofertas ativas para pausar no momento.", { count: 0 });
    }

    return reply(
      true,
      `Feito! Pausei ${plural(paused.length, "oferta", "ofertas")}: ${listTitles(paused)}. Elas saíram do catálogo e voltam quando você pedir para reativar.`,
      { count: paused.length, itemIds: paused.map((item) => item.id) }
    );
  } catch (error) {
    return serverError(error);
  }
}

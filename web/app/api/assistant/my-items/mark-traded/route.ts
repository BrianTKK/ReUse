import { db } from "@/src/prisma/db";
import { CO2_SAVED_PER_ITEM_KG } from "@/src/catalog";
import { badRequest, isAuthorized, reply, serverError, unauthorized } from "@/src/assistant/http";
import { loadOwner } from "@/src/assistant/owner";

// Marca um anúncio do usuário como trocado (tarefa "registrar troca")
export async function POST(request: Request) {
  if (!isAuthorized(request)) return unauthorized();

  try {
    const owner = await loadOwner(request);
    if (owner.error) return owner.error;

    // O Watson pode mandar o código como número ou texto ("#12")
    const itemId = Number(String(owner.body.itemId ?? "").replace(/\D/g, ""));
    if (!Number.isInteger(itemId) || itemId <= 0) {
      return badRequest("Informe o código do anúncio.");
    }

    const item = await db.orm.public.Item.where({ id: itemId, userId: owner.user.id }).first();

    if (!item) {
      return reply(
        false,
        `Não encontrei o anúncio #${itemId} entre os seus. Peça "meus anúncios" para ver os códigos.`
      );
    }

    if (item.status === "traded") {
      return reply(true, `O anúncio **${item.title}** já estava marcado como trocado.`, {
        itemId,
      });
    }

    await db.orm.public.Item.where({ id: itemId }).update({ status: "traded" });

    return reply(
      true,
      `Parabéns pela troca! 🎉 O anúncio **${item.title}** foi marcado como trocado e saiu do catálogo. Reaproveitando esse item você evitou cerca de ${CO2_SAVED_PER_ITEM_KG.toLocaleString("pt-BR")} kg de CO₂.`,
      { itemId }
    );
  } catch (error) {
    return serverError(error);
  }
}

import { NextResponse } from "next/server";
import { db } from "../../../src/prisma/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const busca = searchParams.get("busca")?.trim().toLowerCase() || "";

    const itens = await db.orm.public.Item.where({ status: "active" }).all();

    const resultados = itens.filter((item) => {
      if (!busca) return true;

      return (
        item.title.toLowerCase().includes(busca) ||
        item.category.toLowerCase().includes(busca) ||
        item.description.toLowerCase().includes(busca)
      );
    });

    return NextResponse.json({
      sucesso: true,
      total: resultados.length,
      itens: resultados.map((item) => ({
        id: item.id,
        titulo: item.title,
        categoria: item.category,
        descricao: item.description,
        cidade: item.city,
        estado: item.condition,
        imagem: item.image,
      })),
    });
  } catch (error) {
    console.error("Erro ao consultar anúncios:", error);

    return NextResponse.json(
      {
        sucesso: false,
        mensagem: "Não foi possível consultar os anúncios.",
      },
      { status: 500 }
    );
  }
}
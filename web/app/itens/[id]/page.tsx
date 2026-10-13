import { db } from "../../../src/prisma/db";
import { notFound } from "next/navigation";
import Link from "next/link";

type ItemPageProps = {
  params: Promise<{ id: string }>;
};

const ITENS_PADRAO = [
  {
    id: "1",
    title: "Cadeira de Escritório Ergonômica",
    category: "Móveis",
    city: "Osasco, SP",
    condition: "Excelente",
    image: "https://images.unsplash.com/photo-1580481077195-c328ad45be8e?w=800&q=80",
    description: "Cadeira com regulagem de altura e apoio lombar, em ótimo estado de conservação.",
  },
  {
    id: "2",
    title: "Monitor 24 Full HD",
    category: "Eletrônicos",
    city: "Osasco, SP",
    condition: "Bom",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    description: "Funcionando perfeitamente, sem marcas na tela e com cabos originais.",
  },
  {
    id: "3",
    title: "Bicicleta Urbana Aro 26",
    category: "Bicicletas",
    city: "Osasco, SP",
    condition: "Bom",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
    description: "Revisada recentemente, ótima para deslocamento sustentável.",
  },
  {
    id: "4",
    title: "Kit de Vasos Cerâmicos",
    category: "Decoração",
    city: "Osasco, SP",
    condition: "Novo",
    image: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
    description: "Três vasos esmaltados artesanais sem marcas de uso.",
  },
];

export default async function ItemDetailPage({ params }: ItemPageProps) {
  const { id } = await params;

  let item: any = null;

  try {
     const itens = await db.orm.public.Item
      .where({ id: Number(id) })
      .all();

    item = itens[0] ?? null;
  } catch (error) {
  console.error("Erro ao consultar o produto:", error);
}

  if (!item) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F8FBF9] text-[#1B281F] py-8 px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#278753] hover:underline"
        >
          ← Voltar para o Catálogo
        </Link>

        <div className="bg-white rounded-3xl border border-[#E7EFEA] overflow-hidden shadow-sm grid grid-cols-1 md:grid-cols-2">
          <div className="h-72 md:h-full bg-gray-100 relative min-h-[300px]">
            <img
              src={item.image || "https://images.unsplash.com/photo-1580481077195-c328ad45be8e?w=800&q=80"}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4 bg-white/95 px-3 py-1 rounded-full text-xs font-bold text-gray-800 shadow-sm">
              {item.category}
            </div>
          </div>

          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                  Disponível para troca / doação
                </span>
                <span className="px-3 py-1 rounded-full bg-[#E6F9EC] text-[#278753] text-xs font-bold">
                  {item.condition}
                </span>
              </div>

              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                {item.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-[#718078]">
                <span>📍 {item.city || "Osasco, SP"}</span>
                <span>•</span>
                <span>Disponível no catálogo</span>
              </div>

              <p className="text-sm text-gray-600 leading-relaxed">
                {item.description || "Nenhuma descrição detalhada informada para este objeto."}
              </p>

              <div className="p-4 bg-[#EDFBF2] border border-[#C5ECD4] rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#1A4632]">Impacto Ambiental Estimado</p>
                  <p className="text-base font-extrabold text-[#278753]">-14.5 kg de CO₂ evitado</p>
                </div>
                <span className="text-2xl">🌱</span>
              </div>
            </div>

            <button
              type="button"
              className="w-full py-3.5 bg-[#19E65E] hover:bg-[#26C9B9] text-[#1B281F] font-bold rounded-xl transition shadow-sm text-center"
            >
              Tenho Interesse no Item
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
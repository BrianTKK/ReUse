import { db } from "../../../src/prisma/db";

type ItemDetalhesProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ItemDetalhes({
  params,
}: ItemDetalhesProps) {
  const { id } = await params;
  const itemId = Number(id);

  const item = await db.orm.public.Item
    .where({ id: itemId })
    .first();

  if (!item) {
    return (
      <main className="min-h-screen bg-[#F8FBF9] px-6 py-20 text-[#1B281F]">
        <div className="mx-auto max-w-3xl rounded-[28px] bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-[#1A4632]">
            Item não encontrado
          </h1>

          <p className="mt-3 text-[#718078]">
            Este anúncio não existe ou não está mais disponível.
          </p>

          <a
            href="/"
            className="mt-6 inline-block rounded-full bg-[#19E65E] px-6 py-3 font-semibold"
          >
            Voltar para explorar
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FBF9] text-[#1B281F]">
      <header className="border-b border-[#E7EFEA] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <a
            href="/"
            className="text-sm font-semibold text-[#278753]"
          >
            ← Voltar
          </a>

          <span className="text-xl font-bold text-[#1A4632]">
            ReUse!
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid overflow-hidden rounded-[32px] bg-white shadow-sm md:grid-cols-2">
          <div className="min-h-[420px] bg-[#EFF7F2]">
            <img
              src={item.image || "/items/cadeira.jpg"}
              alt={item.title}
              className="h-full min-h-[420px] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-8 md:p-12">
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-[#E6F9EC] px-4 py-2 text-xs font-semibold text-[#278753]">
                {item.category}
              </span>

              <span className="rounded-full bg-[#F0F4F1] px-4 py-2 text-xs font-semibold">
                {item.condition}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-bold text-[#1A4632]">
              {item.title}
            </h1>

            <p className="mt-3 text-sm font-medium text-[#278753]">
              📍 {item.city}
            </p>

            <div className="my-8 h-px bg-[#E7EFEA]" />

            <h2 className="text-lg font-bold">
              Sobre este item
            </h2>

            <p className="mt-3 leading-7 text-[#5A6C61]">
              {item.description}
            </p>

            <button
              type="button"
              className="mt-10 w-full rounded-full bg-[#19E65E] px-6 py-3 font-semibold transition hover:bg-[#26C9B9]"
            >
              Tenho interesse
            </button>

            <p className="mt-4 text-center text-xs text-[#809087]">
              Combine a retirada do item de forma segura.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
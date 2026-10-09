import { redirect } from "next/navigation";
import { db } from "../../src/prisma/db";

async function criarItem(formData: FormData) {
  "use server";

  const title = String(formData.get("title") || "");
  const category = String(formData.get("category") || "");
  const description = String(formData.get("description") || "");
  const condition = String(formData.get("condition") || "");

  if (!title || !category || !description || !condition) {
    return;
  }

  const imagensPorCategoria: Record<string, string> = {
    Móveis: "/items/cadeira.jpg",
    Plantas: "/items/planta.jpg",
    Bicicletas: "/items/bicicleta.jpg",
    Decoração: "/items/vaso.jpg",
    Eletrônicos: "/items/monitor.jpg",
  };

  const image =
    imagensPorCategoria[category] || "/items/cadeira.jpg";

  await db.orm.public.Item.create({
    title,
    category,
    description,
    condition,
    city: "Osasco, SP",
    image,
  });

  redirect("/");
}

export default function CriarAnuncio() {
  return (
    <main className="min-h-screen bg-[#F8FBF9] text-[#1B281F]">
      <header className="border-b border-[#E7EFEA] bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <a href="/" className="text-sm font-medium text-[#278753]">
            ← Voltar
          </a>

          <h1 className="text-xl font-bold text-[#1A4632]">
            Novo anúncio
          </h1>

          <span className="text-sm font-semibold text-[#19E65E]">
            ReUse!
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-[28px] bg-white p-8 shadow-sm">
          <div className="mb-8">
            <p className="text-sm font-semibold text-[#278753]">
              Crie um novo anúncio
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Dê uma nova vida ao seu item.
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#718078]">
              Preencha as informações abaixo para publicar um item na plataforma.
            </p>
          </div>

          <div className="mb-8 rounded-[24px] border-2 border-dashed border-[#CFE5D7] bg-[#F7FCF9] p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#DDF8E6] text-2xl">
              +
            </div>

            <p className="mt-4 font-semibold">
              Imagem ilustrativa por categoria
            </p>

            <p className="mt-1 text-xs text-[#809087]">
              A imagem será definida automaticamente conforme a categoria.
            </p>
          </div>

          <form action={criarItem} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold"
              >
                Título do objeto
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                placeholder="Ex: Cadeira de escritório ergonômica"
                className="w-full rounded-xl border border-[#DDE9E1] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#19E65E]"
              />
            </div>

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold"
              >
                Categoria
              </label>

              <select
                id="category"
                name="category"
                required
                defaultValue=""
                className="w-full rounded-xl border border-[#DDE9E1] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#19E65E]"
              >
                <option value="" disabled>
                  Selecionar categoria
                </option>
                <option value="Móveis">Móveis</option>
                <option value="Plantas">Plantas</option>
                <option value="Bicicletas">Bicicletas</option>
                <option value="Decoração">Decoração</option>
                <option value="Eletrônicos">Eletrônicos</option>
                <option value="Outros">Outros</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold"
              >
                Descrição detalhada
              </label>

              <textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Descreva o estado, dimensões, detalhes e motivo da doação ou troca..."
                className="w-full resize-none rounded-xl border border-[#DDE9E1] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#19E65E]"
              />
            </div>

            <div>
              <label
                htmlFor="condition"
                className="mb-2 block text-sm font-semibold"
              >
                Estado de conservação
              </label>

              <select
                id="condition"
                name="condition"
                required
                defaultValue=""
                className="w-full rounded-xl border border-[#DDE9E1] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#19E65E]"
              >
                <option value="" disabled>
                  Selecionar estado
                </option>
                <option value="Novo">Novo</option>
                <option value="Excelente">Excelente</option>
                <option value="Bom">Bom</option>
                <option value="Regular">Regular</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-[#19E65E] px-6 py-3 font-semibold text-[#1B281F] transition hover:bg-[#26C9B9]"
            >
              Publicar anúncio
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
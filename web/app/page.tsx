import { db } from "../src/prisma/db";

type HomeProps = {
  searchParams: Promise<{
    categoria?: string;
    busca?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const categoriaSelecionada = params.categoria || "Todos";
  const busca = params.busca?.trim() || "";

  const itemsDoBanco =
    categoriaSelecionada === "Todos"
      ? await db.orm.public.Item
          .orderBy((item) => item.createdAt.desc())
          .all()
      : await db.orm.public.Item
          .where({ category: categoriaSelecionada })
          .orderBy((item) => item.createdAt.desc())
          .all();

  const items = busca
    ? itemsDoBanco.filter((item) =>
        item.title.toLowerCase().includes(busca.toLowerCase())
      )
    : itemsDoBanco;

  const categorias = [
    "Todos",
    "Móveis",
    "Plantas",
    "Bicicletas",
    "Decoração",
  ];

  return (
    <main className="min-h-screen bg-[#F8FBF9] text-[#1B281F]">
      <header className="border-b border-[#E7EFEA] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#19E65E] text-xl">
              ♻
            </div>

            <span className="text-2xl font-bold text-[#1A4632]">
              ReUse!
            </span>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a href="#explorar" className="hover:text-[#278753]">
              Explorar
            </a>

            <a href="#categorias" className="hover:text-[#278753]">
              Categorias
            </a>

            <a href="#sobre" className="hover:text-[#278753]">
              Sobre
            </a>

            <a
              href="/criar"
              className="rounded-full bg-[#19E65E] px-5 py-2.5 font-semibold text-[#1B281F] transition hover:bg-[#26C9B9]"
            >
              Criar anúncio
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 font-semibold text-[#278753]">
            Reutilize. Troque. Transforme.
          </p>

          <h1 className="max-w-xl text-4xl font-bold leading-tight md:text-6xl">
            Dê uma nova vida ao que você não usa mais.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-[#5A6C61]">
            Encontre itens próximos, anuncie objetos que estão parados em casa
            e conecte-se com pessoas que acreditam em um consumo mais consciente.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#explorar"
              className="rounded-full bg-[#19E65E] px-7 py-3 text-center font-semibold transition hover:bg-[#26C9B9]"
            >
              Explorar itens
            </a>

            <a
              href="/criar"
              className="rounded-full border border-[#278753] px-7 py-3 text-center font-semibold text-[#278753] transition hover:bg-[#EFFAF3]"
            >
              Criar anúncio
            </a>
          </div>
        </div>

        <div className="rounded-[32px] bg-[#E7FFF0] p-8">
          <div className="rounded-[28px] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-[#278753]">
                  Localização atual
                </p>

                <p className="font-semibold">
                  Osasco, SP
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#19E65E]">
                ♻
              </div>
            </div>

            <form method="GET" action="/" className="flex gap-2">
              {categoriaSelecionada !== "Todos" && (
                <input
                  type="hidden"
                  name="categoria"
                  value={categoriaSelecionada}
                />
              )}

              <input
                type="text"
                name="busca"
                defaultValue={busca}
                placeholder="Encontre itens próximos"
                className="min-w-0 flex-1 rounded-2xl border border-[#DDE9E1] bg-[#FAFCFB] px-4 py-3 text-sm outline-none transition placeholder:text-[#809087] focus:border-[#19E65E]"
              />

              <button
                type="submit"
                className="rounded-2xl bg-[#19E65E] px-5 py-3 font-semibold transition hover:bg-[#26C9B9]"
              >
                🔎
              </button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#19E65E] px-4 py-2 text-xs font-medium">
                Osasco, SP
              </span>

              <span className="rounded-full bg-[#EFF4F0] px-4 py-2 text-xs">
                Móveis
              </span>

              <span className="rounded-full bg-[#EFF4F0] px-4 py-2 text-xs">
                Plantas
              </span>

              <span className="rounded-full bg-[#EFF4F0] px-4 py-2 text-xs">
                Decoração
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="categorias"
        className="mx-auto max-w-7xl px-6 pb-8"
      >
        <div className="flex flex-wrap gap-3">
          {categorias.map((categoria) => {
            const ativa = categoriaSelecionada === categoria;

            let href =
              categoria === "Todos"
                ? "/#explorar"
                : `/?categoria=${encodeURIComponent(categoria)}#explorar`;

            if (busca) {
              href =
                categoria === "Todos"
                  ? `/?busca=${encodeURIComponent(busca)}#explorar`
                  : `/?categoria=${encodeURIComponent(
                      categoria
                    )}&busca=${encodeURIComponent(busca)}#explorar`;
            }

            return (
              <a
                key={categoria}
                href={href}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  ativa
                    ? "bg-[#19E65E] text-[#1B281F]"
                    : "bg-white text-[#1B281F] hover:bg-[#E7FFF0]"
                }`}
              >
                {categoria}
              </a>
            );
          })}
        </div>
      </section>

      <section
        id="explorar"
        className="mx-auto max-w-7xl px-6 pb-20"
      >
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold text-[#278753]">
              ReUse perto de você
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              {busca
                ? `Resultados para "${busca}"`
                : categoriaSelecionada === "Todos"
                ? "Itens recentes"
                : categoriaSelecionada}
            </h2>

            {busca && (
              <p className="mt-2 text-sm text-[#718078]">
                {items.length}{" "}
                {items.length === 1
                  ? "item encontrado"
                  : "itens encontrados"}
              </p>
            )}
          </div>

          {(categoriaSelecionada !== "Todos" || busca) && (
            <a
              href="/#explorar"
              className="text-sm font-semibold text-[#278753]"
            >
              Limpar filtros
            </a>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-[24px] bg-white p-8 text-center shadow-sm">
            <p className="font-semibold text-[#1A4632]">
              Nenhum item encontrado.
            </p>

            <p className="mt-2 text-sm text-[#718078]">
              Tente pesquisar outro nome ou selecionar outra categoria.
            </p>

            <a
              href="/#explorar"
              className="mt-5 inline-block rounded-full bg-[#19E65E] px-6 py-3 text-sm font-semibold"
            >
              Ver todos os itens
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <a
                key={item.id}
                href={`/itens/${item.id}`}
                className="block"
              >
                <article className="overflow-hidden rounded-[24px] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={item.image || "/items/cadeira.jpg"}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />

                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-bold">
                        {item.title}
                      </h3>

                      <span className="text-xl">
                        ♡
                      </span>
                    </div>

                    <p className="mt-2 text-sm text-[#718078]">
                      {item.city}
                    </p>

                    <span className="mt-4 inline-block rounded-full bg-[#E6F9EC] px-3 py-1 text-xs font-semibold text-[#278753]">
                      {item.condition}
                    </span>
                  </div>
                </article>
              </a>
            ))}
          </div>
        )}
      </section>

      <section
        id="sobre"
        className="mx-auto max-w-7xl px-6 pb-20"
      >
        <div className="rounded-[32px] bg-[#1A4632] px-8 py-12 text-white md:flex md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#9BE8B5]">
              Devolva à terra
            </p>

            <h2 className="mt-2 text-3xl font-bold">
              Recicle itens que você não usa.
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#D8E9DE]">
              O ReUse aproxima pessoas interessadas em dar um novo destino para
              objetos que ainda podem ser aproveitados.
            </p>
          </div>

          <a
            href="/criar"
            className="mt-6 inline-block rounded-full bg-[#19E65E] px-6 py-3 font-semibold text-[#1B281F] md:mt-0"
          >
            Começar
          </a>
        </div>
      </section>

      <footer className="border-t border-[#E2ECE5] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-sm text-[#718078] md:flex-row md:items-center md:justify-between">
          <p>© 2026 ReUse!</p>

          <p>
            Consumo consciente, reutilização e sustentabilidade.
          </p>
        </div>
      </footer>
    </main>
  );
}
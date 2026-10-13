import { db } from "../src/prisma/db";

type HomeProps = {
  searchParams: Promise<{
    categoria?: string;
    busca?: string;
  }>;
};

// Dados de contingência caso o banco/contrato esteja offline ou sem migração
const ITENS_PADRAO = [
  {
    id: "1",
    title: "Cadeira de Escritório Ergonômica",
    category: "Móveis",
    city: "Osasco, SP",
    condition: "Excelente",
    image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80",
    description: "Cadeira com regulagem de altura e apoio lombar, em ótimo estado.",
  },
  {
    id: "2",
    title: "Monitor 24 Full HD",
    category: "Eletrônicos",
    city: "Osasco, SP",
    condition: "Bom",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&q=80",
    description: "Funcionando perfeitamente, com cabo HDMI incluso.",
  },
  {
    id: "3",
    title: "Bicicleta Urbana Aro 26",
    category: "Bicicletas",
    city: "Osasco, SP",
    condition: "Bom",
    image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&q=80",
    description: "Revisada recentemente, ótima para deslocamento urbano sustentável.",
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

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const categoriaSelecionada = params.categoria || "Todos";
  const busca = params.busca?.trim() || "";

  let itemsDoBanco: any[] = [];

  try {
    // Ofertas pausadas ou já trocadas não aparecem no catálogo
    itemsDoBanco =
      categoriaSelecionada === "Todos"
        ? await db.orm.public.Item
            .where({ status: "active" })
            .orderBy((item: any) => item.createdAt.desc())
            .all()
        : await db.orm.public.Item
            .where({ category: categoriaSelecionada, status: "active" })
            .orderBy((item: any) => item.createdAt.desc())
            .all();
  } catch (error) {
    console.warn("Banco de dados não acessível, utilizando fallback em memória.");
    itemsDoBanco =
      categoriaSelecionada === "Todos"
        ? ITENS_PADRAO
        : ITENS_PADRAO.filter((i) => i.category === categoriaSelecionada);
  }

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
    "Eletrônicos",
  ];

  const totalCo2Estimado = (items.length * 14.5).toFixed(1);

  return (
    <main className="min-h-screen bg-[#F8FBF9] text-[#1B281F]">
      <header className="border-b border-[#E7EFEA] bg-white sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#19E65E] text-xl font-bold">
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

      {/* Hero Section */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-12 md:grid-cols-2 md:items-center">
        <div>
          <p className="mb-4 font-semibold text-[#278753]">
            Reutilize. Troque. Transforme.
          </p>
          <h1 className="max-w-xl text-4xl font-bold leading-tight md:text-5xl">
            Dê uma nova vida ao que você não usa mais.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[#5A6C61]">
            Encontre itens próximos em Osasco e região, anuncie objetos parados e fortaleça a economia circular sem gerar novos resíduos.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
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

        <div className="rounded-[32px] bg-[#E7FFF0] p-6">
          <div className="rounded-[24px] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#278753] font-semibold uppercase tracking-wider">
                  Localização principal
                </p>
                <p className="font-bold text-lg">Osasco, SP</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#19E65E] text-base">
                📍
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
                placeholder="Encontre itens próximos..."
                className="min-w-0 flex-1 rounded-xl border border-[#DDE9E1] bg-[#FAFCFB] px-4 py-2.5 text-sm outline-none transition focus:border-[#19E65E]"
              />
              <button
                type="submit"
                className="rounded-xl bg-[#19E65E] px-4 py-2.5 font-semibold transition hover:bg-[#26C9B9]"
              >
                🔎
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Banner de Impacto Ecológico */}
      <section className="mx-auto max-w-7xl px-6 pb-6">
        <div className="rounded-2xl border border-[#C5ECD4] bg-[#EDFBF2] p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌱</span>
            <div>
              <p className="text-sm font-bold text-[#1A4632]">
                Métrica de Redução de Pegada de Carbono
              </p>
              <p className="text-xs text-[#5A6C61]">
                Reutilizar itens cadastrados nesta plataforma evita a emissão de novos gases estufa na fabricação e descarte.
              </p>
            </div>
          </div>
          <div className="bg-white px-4 py-2 rounded-xl border border-[#DDE9E1] text-right whitespace-nowrap">
            <span className="text-xs text-[#5A6C61] block">Economia Comunitária</span>
            <span className="text-lg font-bold text-[#278753]">~{totalCo2Estimado} kg CO₂</span>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section id="categorias" className="mx-auto max-w-7xl px-6 pb-6">
        <div className="flex flex-wrap gap-2">
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
                className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                  ativa
                    ? "bg-[#19E65E] text-[#1B281F]"
                    : "bg-white text-[#1B281F] border border-[#E7EFEA] hover:bg-[#E7FFF0]"
                }`}
              >
                {categoria}
              </a>
            );
          })}
        </div>
      </section>

      {/* Grade de Itens */}
      <section id="explorar" className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-semibold text-[#278753] uppercase tracking-wider">
              Catálogo ReUse
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              {busca
                ? `Resultados para "${busca}"`
                : categoriaSelecionada === "Todos"
                ? "Itens recentes disponíveis"
                : categoriaSelecionada}
            </h2>
          </div>

          {(categoriaSelecionada !== "Todos" || busca) && (
            <a href="/#explorar" className="text-xs font-semibold text-[#278753] hover:underline">
              Limpar filtros
            </a>
          )}
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-[#E7EFEA]">
            <p className="font-semibold text-[#1A4632]">Nenhum item encontrado.</p>
            <p className="mt-1 text-xs text-[#718078]">
              Tente buscar por outro termo ou cadastre um anúncio.
            </p>
            <a
              href="/criar"
              className="mt-4 inline-block rounded-full bg-[#19E65E] px-5 py-2 text-xs font-semibold"
            >
              Publicar um item
            </a>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item) => (
              <a key={item.id} href={`/itens/${item.id}`} className="block group">
                <article className="overflow-hidden rounded-2xl bg-white border border-[#E7EFEA] shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-md">
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={item.image || "https://images.unsplash.com/photo-1580481077195-c328ad45be8e?w=800&q=80"}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-bold">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-[#278753] transition-colors truncate">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs text-[#718078]">
                      📍 {item.city || "Osasco, SP"}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="rounded-full bg-[#E6F9EC] px-2.5 py-0.5 text-[11px] font-bold text-[#278753]">
                        {item.condition}
                      </span>
                      <span className="text-xs font-semibold text-[#278753]">
                        Ver detalhes →
                      </span>
                    </div>
                  </div>
                </article>
              </a>
            ))}
          </div>
        )}
      </section>

      <footer className="border-t border-[#E2ECE5] bg-white py-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 text-xs text-[#718078] sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 ReUse! — Plataforma desenvolvida com Next.js</p>
          <p>Consumo consciente, reaproveitamento e sustentabilidade.</p>
        </div>
      </footer>
    </main>
  );
}
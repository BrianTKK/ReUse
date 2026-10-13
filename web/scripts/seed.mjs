// Dados de demonstração para testar o assistente: node scripts/seed.mjs
// Idempotente: usuários que já existem são ignorados.
import { db } from "../src/prisma/db.ts";

const USERS = [
  {
    email: "clara@reuse.demo",
    name: "Clara Sustento",
    items: [
      ["Cadeira de Escritório Ergonômica", "Móveis", "Excelente", "Cadeira com regulagem de altura e apoio lombar, em ótimo estado."],
      ["Monitor 24 Full HD", "Eletrônicos", "Bom", "Funcionando perfeitamente, com cabo HDMI incluso."],
      ["Kit de Vasos Cerâmicos", "Decoração", "Novo", "Três vasos esmaltados artesanais sem marcas de uso."],
    ],
  },
  {
    email: "esteves@reuse.demo",
    name: "Esteves Jobs",
    items: [
      ["Bicicleta Urbana Aro 26", "Bicicletas", "Bom", "Revisada recentemente, ótima para deslocamento urbano sustentável."],
      ["Costela-de-adão em vaso", "Plantas", "Excelente", "Muda grande e saudável, acompanha vaso de plástico."],
      ["Mesa de Estudos Dobrável", "Móveis", "Regular", "Tem marcas de uso no tampo, mas está firme."],
    ],
  },
];

const IMAGES = {
  Móveis: "/items/cadeira.jpg",
  Plantas: "/items/planta.jpg",
  Bicicletas: "/items/bicicleta.jpg",
  Decoração: "/items/vaso.jpg",
  Eletrônicos: "/items/monitor.jpg",
};

for (const { email, name, items } of USERS) {
  if (await db.orm.public.User.where({ email }).first()) {
    console.log(`já existe: ${email}`);
    continue;
  }

  const user = await db.orm.public.User.create({ email, name });

  for (const [title, category, condition, description] of items) {
    await db.orm.public.Item.create({
      title,
      category,
      condition,
      description,
      city: "Osasco, SP",
      image: IMAGES[category] ?? "/items/cadeira.jpg",
      status: "active",
      userId: user.id,
    });
  }

  console.log(`criado: ${email} com ${items.length} itens`);
}

await db.close?.();

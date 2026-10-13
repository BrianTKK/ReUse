export const CATEGORIES = [
  "Móveis",
  "Plantas",
  "Bicicletas",
  "Decoração",
  "Eletrônicos",
  "Outros",
] as const;

export const CONDITIONS = ["Novo", "Excelente", "Bom", "Regular"] as const;

export type ItemStatus = "active" | "paused" | "traded";

export const STATUS_LABELS: Record<ItemStatus, string> = {
  active: "Ativo",
  paused: "Pausado",
  traded: "Trocado",
};

export const DEFAULT_CITY = "Osasco, SP";

// Estimativa usada na home e na página do item
export const CO2_SAVED_PER_ITEM_KG = 14.5;

const CATEGORY_IMAGES: Record<string, string> = {
  Móveis: "/items/cadeira.jpg",
  Plantas: "/items/planta.jpg",
  Bicicletas: "/items/bicicleta.jpg",
  Decoração: "/items/vaso.jpg",
  Eletrônicos: "/items/monitor.jpg",
};

export function imageForCategory(category: string) {
  return CATEGORY_IMAGES[category] || "/items/cadeira.jpg";
}

// Compara sem acento e sem diferenciar maiúsculas: "eletronicos" == "Eletrônicos"
export function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function matchOption<T extends string>(options: readonly T[], value: unknown) {
  if (typeof value !== "string") return null;
  const wanted = normalizeText(value);
  return options.find((option) => normalizeText(option) === wanted) ?? null;
}

export function parseCategory(value: unknown) {
  return matchOption(CATEGORIES, value);
}

export function parseCondition(value: unknown) {
  return matchOption(CONDITIONS, value);
}

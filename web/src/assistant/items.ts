import { STATUS_LABELS, normalizeText, type ItemStatus } from "../catalog";

type ItemRow = {
  id: number;
  title: string;
  description: string;
  category: string;
  condition: string;
  city: string;
  status: ItemStatus;
};

export function toItemSummary(item: ItemRow, origin: string) {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    condition: item.condition,
    city: item.city,
    status: item.status,
    statusLabel: STATUS_LABELS[item.status],
    url: `${origin}/itens/${item.id}`,
  };
}

export function listTitles(items: { title: string }[]) {
  const titles = items.map((item) => `**${item.title}**`);
  if (titles.length <= 1) return titles.join("");
  return `${titles.slice(0, -1).join(", ")} e ${titles.at(-1)}`;
}

export function plural(count: number, singular: string, pluralForm: string) {
  return `${count} ${count === 1 ? singular : pluralForm}`;
}

// Busca simples: cada palavra precisa aparecer no título, categoria ou descrição
// ("cadeiras" encontra "Cadeira", "eletronico" encontra "Eletrônicos")
export function matchesQuery(item: ItemRow, query: string) {
  const words = normalizeText(query)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => (word.length > 3 && word.endsWith("s") ? word.slice(0, -1) : word));

  if (words.length === 0) return true;

  const haystack = normalizeText(`${item.title} ${item.category} ${item.description}`);
  return words.every((word) => haystack.includes(word));
}

import { ImageProps } from 'expo-image';

export type ItemCondition = 'Novo' | 'Excelente' | 'Bom' | 'OK';

export interface ReUseItem {
  id: string;
  title: string;
  category: string;
  points: number;
  image: ImageProps['source'];
  condition: ItemCondition;
  location: string;
  description: string;
}

// Dados fixos enquanto o app não lê a API: a Home e a tela de detalhe usam a mesma lista.
export const REUSE_ITEMS: ReUseItem[] = [
  {
    id: '1',
    title: 'Cadeira de Escritório',
    category: 'Móveis',
    points: 50,
    image: require('../assets/images/chair.jpg'),
    condition: 'Bom',
    location: 'Osasco, SP',
    description:
      'Cadeira giratória com regulagem de altura e encosto em tela. Tem marcas leves de uso no assento, mas está firme e confortável para estudar ou trabalhar.',
  },
  {
    id: '2',
    title: 'Monitor 24"',
    category: 'Eletrônicos',
    points: 120,
    image: require('../assets/images/monitor.jpg'),
    condition: 'Excelente',
    location: 'Osasco, SP',
    description:
      'Monitor Full HD de 24 polegadas com entrada HDMI. Sem riscos na tela e sem pixels queimados. Acompanha o cabo de força e a base original.',
  },
  {
    id: '3',
    title: 'Kit de Vasos',
    category: 'Decoração',
    points: 30,
    image: require('../assets/images/pots.jpg'),
    condition: 'Novo',
    location: 'Osasco, SP',
    description:
      'Três vasos de cerâmica pintados à mão, em tamanhos diferentes. Nunca foram usados e são ideais para suculentas e plantas pequenas.',
  },
  {
    id: '4',
    title: 'Bicicleta',
    category: 'Esporte',
    points: 200,
    image: require('../assets/images/bicycle.jpg'),
    condition: 'Bom',
    location: 'Osasco, SP',
    description:
      'Bicicleta aro 26 com 18 marchas e freios revisados. A pintura tem alguns riscos, mas os pneus estão em bom estado e ela está pronta para rodar.',
  },
];

export function getItemById(id: string | undefined): ReUseItem | undefined {
  return REUSE_ITEMS.find((item) => item.id === id);
}

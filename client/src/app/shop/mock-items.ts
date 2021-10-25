import { Item } from './item/item.model'

const JsonItems = [
  {
    name: 'golden medal',
    price: 10000
  },
  {
    name: 'silver medal',
    price: 7500
  },
  {
    name: 'bronze medal',
    price: 5000
  },
];
export const ITEMS: Item[] = JsonItems.map(Item.fromJSON);
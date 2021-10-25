import { Pipe, PipeTransform } from '@angular/core';
import { Item } from './item/item.model';

@Pipe({
  name: 'itemFilter'
})
export class ItemFilterPipe implements PipeTransform {

  transform(items: Item[], ascending: boolean): Item[] {
    return ascending? items.sort((n1, n2) => n1.price - n2.price) : items.sort((n1, n2) => n2.price - n1.price);
  }

}

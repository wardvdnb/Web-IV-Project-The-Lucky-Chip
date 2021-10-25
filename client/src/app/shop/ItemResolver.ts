import {
    Resolve,
    RouterStateSnapshot,
    ActivatedRouteSnapshot
} from '@angular/router';
import { Item } from './item/item.model';
import { Injectable } from '@angular/core';
import { ShopDataService } from './shop-data.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ItemResolver implements Resolve<Item> {
constructor(private shopService: ShopDataService) {}

resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
): Observable<Item> {
    return this.shopService.getItem$(route.params['id']);
}
}
  
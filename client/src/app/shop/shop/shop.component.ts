import { Component, OnInit } from '@angular/core';
import { Item} from '../item/item.model';
import{ ShopDataService } from '../shop-data.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {  
  //need this else you get an endless loop of the dataservice returning observables and triggering change detection in the (items$ | async) code
  private _fetchItems$: Observable<Item[]>;
  public sortAscending: boolean = true;
  public errorMessage: string = '';

  constructor(private _shopDataService : ShopDataService) {}

  ngOnInit(): void {
    this._fetchItems$ = this._shopDataService.allItems$.pipe(
      catchError(err => {
        this.errorMessage = err;
        return EMPTY;
      })
    );
  }

  get items$() : Observable<Item[]>{
    return this._fetchItems$;
  }

  applyFilter() {
    this.sortAscending = !this.sortAscending;
  }
}

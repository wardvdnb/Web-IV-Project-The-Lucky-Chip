import { Injectable } from '@angular/core';
import {ITEMS} from './mock-items';
import {Item} from './item/item.model';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map, tap, delay, catchError} from 'rxjs/operators';
import { BehaviorSubject, Observable, pipe, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ShopDataService {
  private _items$ = new BehaviorSubject<Item[]>([]);
  private _items : Item[];
  constructor(private http: HttpClient) {
    this.items$.pipe(
      catchError(err => {
        this._items$.error(err);
        return throwError(err);
      })
    ).subscribe((items: Item[]) => {
      this._items = items;
      this._items$.next(this._items);
    });
  }

  get allItems$(){
    return this._items$;
  }

  get items$(): Observable<Item[]> {
    return this.http
      .get(`${environment.apiUrl}/items/`)
      .pipe(
        catchError(this.handleError),
        // delay(2000),
        // tap(console.log), //tap will simply pass everything it gets to the next operator, leaving it untouched, but you get a chance to 'tap into' the stream
        map((list: any[]): Item[] => list.map(Item.fromJSON)) //of gewoon map(Item.fromJSON)
      );
  }

  getItem$(id: string): Observable<Item> {
    return this.http
      .get(`${environment.apiUrl}/items/${id}`)
      .pipe(catchError(this.handleError), map(Item.fromJSON)); // returns just one item, as json
  }

  addNewItem(item: Item){
    return this.http
      .post(`${environment.apiUrl}/items/`, item.toJSON())
      .pipe(catchError(this.handleError), map(Item.fromJSON))
      .pipe(// temporary fix, while we use the behaviorsubject as a cache stream
          catchError((err) => {
            this._items$.error(err);
            return throwError(err);
          }),
          tap((item: Item) => {
            this._items = [...this._items, item];
            this._items$.next(this._items);
        })
      );
  }

  deleteItem(item: Item) {
    return this.http
      .delete(`${environment.apiUrl}/items/${item.id}`)
      .pipe(tap(console.log), catchError(this.handleError))
      .subscribe(() => {
        this._items = this._items.filter(shopitem => shopitem.id != item.id);
        this._items$.next(this._items);
      });
  }

  handleError(err: any) : Observable<never>{
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else if (err instanceof HttpErrorResponse) {
      console.log(err);
      errorMessage = `'${err.status} ${err.statusText}' when accessing '${err.url}'`;
    } else {
      errorMessage = err;
    }
    return throwError(errorMessage);
  }
}

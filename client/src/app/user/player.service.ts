import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map, tap } from 'rxjs/operators';
import { Item } from '../shop/item/item.model';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  private _balance$: BehaviorSubject<number> = new BehaviorSubject<number>(0);;
  private _items$ = new BehaviorSubject<Item[]>([]);
  private _items : Item[];

  constructor(private http: HttpClient) { 
    this.fetchBalance().pipe(
      catchError(err => {
        this._balance$.error(err);
        return throwError(err);
      })
    ).subscribe(newBalance => this._balance$.next(newBalance));
    
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

  get balance$(): BehaviorSubject<number> {
    return this._balance$;
  }

  fetchBalance(){
    return this.http.get<number>(
      `${environment.apiUrl}/Account/getmoney`
    ).pipe(
      catchError(this.handleError)
    );
  }

  updateBalance(money: number) : Observable<number>{
    this._balance$.next(money);
    return this.http
      .put(`${environment.apiUrl}/Account/updatemoney/${money}`, '')
      .pipe(
        catchError(this.handleError),
        map((result) => Number(result))
      );
      // .pipe(
      //   map((result: any) => {
      //     if (result) {
      //       return true;
      //     } else {
      //       return false;
      //     }
      //   })
      // );
  }

  get allItems$(){
    return this._items$;
  }

  get items$(): Observable<Item[]> {
    return this.http
      .get(`${environment.apiUrl}/Account/getitems`)
      .pipe(
        catchError(this.handleError),
        // delay(2000),
        tap(console.log), //tap will simply pass everything it gets to the next operator, leaving it untouched, but you get a change to 'tap into' the stream
        map((list: any[]): Item[] => list.map(Item.fromJSON)) //of gewoon map(Item.fromJSON)
      );
  }

  buyItem(id: number){
    return this.http
      .post(`${environment.apiUrl}/Account/buyitem/${id}`, '')
      .pipe(tap(console.log), catchError(this.handleError), map(Item.fromJSON))
      .pipe(
          catchError((err) => {
            this._items$.error(err);
            return throwError(err);
          }))
      .subscribe((item: Item) => {
            this._items = [...this._items, item];
            this._items$.next(this._items);
            this._balance$.next(this.balance$.value - item.price);
            location.reload();
      });
  }

  checkPlayerBalance(){
    return this.http
      .get<number>(
        `${environment.apiUrl}/Account/getmoney`
      )
      .pipe(
        catchError(this.handleError)
      );
  };

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

import { Component, OnInit } from '@angular/core';
import {Item} from '../../../shop/item/item.model';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PlayerService } from '../../player.service';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

   //need this else you get an endless loop of the dataservice returning observables and triggering change detection in the (items$ | async) code
   private _fetchItems$: Observable<Item[]>;
   public errorMessage: string = '';
 
   constructor(private _playerService : PlayerService) {}
 
   ngOnInit(): void {
     this._fetchItems$ = this._playerService.allItems$.pipe(
       catchError(err => {
         this.errorMessage = err;
         return EMPTY;
       })
     );
   }
 
   get items$() : Observable<Item[]>{
     return this._fetchItems$;
   }

}

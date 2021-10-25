import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Item } from '../item/item.model'
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { ShopDataService } from '../shop-data.service';
import { debounceTime, distinctUntilChanged, catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@Component({
  selector: 'app-add-item',
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.css']
})
export class AddItemComponent implements OnInit {
  public item: FormGroup;
  public errorMessage: string = '';
  public confirmationMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private _shopDataService: ShopDataService
  ) { }

  ngOnInit(): void {
    this.item = this.fb.group({
      name: ['platinum medal', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.minLength(1), Validators.min(1)]]
    });
  }

  onSubmit() {
    this._shopDataService
    .addNewItem(new Item(this.item.value.name, this.item.value.price))
    .pipe(
      catchError((err) => {
        this.errorMessage = err;
        return EMPTY;
      })
    )
    .subscribe((item: Item) => {
        this.confirmationMessage = `an item, ${item.name} was successfully added`;
      });

    this.item = this.fb.group({
      name: ['platinum medal', [Validators.required, Validators.minLength(2)]],
      price: [0, [Validators.required, Validators.minLength(1)]]
    });
  }

  getErrorMessage(errors: any): string {
    if (errors.required) {
      return 'is required';
    } else if (errors.minlength) {
      return `needs at least ${errors.minlength.requiredLength} 
        characters (got ${errors.minlength.actualLength})`;
    } else if (errors.min){
      return 'please insert a positive value';
    }
  }
}

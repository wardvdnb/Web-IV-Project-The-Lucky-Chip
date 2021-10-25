import { Component, Input, OnInit } from '@angular/core';
import { Item } from 'src/app/shop/item/item.model';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrls: ['./user-item.component.css']
})
export class UserItemComponent implements OnInit {

  @Input() public item: Item;

  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, Input, OnInit } from '@angular/core';
import {Item} from './item.model'
import { ShopDataService } from '../shop-data.service';
import { PlayerService } from 'src/app/user/player.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() public item: Item;

  constructor(private _shopDataService: ShopDataService, 
    private _playerService : PlayerService) { }

  ngOnInit(): void {
  }

  deleteItem(){
    this._shopDataService.deleteItem(this.item);
  }

  buyItem(){
    this._playerService.buyItem(this.item.id);
  }
}

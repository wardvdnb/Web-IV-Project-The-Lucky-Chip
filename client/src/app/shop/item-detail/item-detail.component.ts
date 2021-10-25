import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Item } from '../item/item.model';
import { ShopDataService } from '../shop-data.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  public item : Item;

  constructor(
    private route: ActivatedRoute,
    private shopDataService: ShopDataService
  ) { }

  ngOnInit(): void {
    this.route.data.subscribe(
      data => (this.item = data['item']));
  }

}

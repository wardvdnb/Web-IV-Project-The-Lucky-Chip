import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item/item.component';
import { ShopComponent } from './shop/shop.component';
import { MaterialModule } from '../material/material.module';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AddItemComponent } from './add-item/add-item.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ItemDetailComponent } from './item-detail/item-detail.component';
import { Routes, RouterModule } from '@angular/router';
import { ItemResolver } from './ItemResolver';
import { ItemFilterPipe } from './item-filter.pipe';

const routes: Routes = [
  { path: 'list', component: ShopComponent},
  { path: 'add', component: AddItemComponent },
  { 
    path: 'detail/:id', 
    component: ItemDetailComponent,
    resolve: { item : ItemResolver }
  }
];

@NgModule({
  declarations: [ 
    ShopComponent, 
    ItemComponent, 
    AddItemComponent, 
    ItemDetailComponent, ItemFilterPipe
  ],
  imports: [
    CommonModule, 
    MaterialModule, 
    FontAwesomeModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [ShopComponent, AddItemComponent]
})
export class ShopModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './user-profile/user-profile/user-profile.component';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FaIconLibrary, FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ShopModule } from '../shop/shop.module';
import { UserItemComponent } from './user-profile/user-item/user-item.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent, UserProfileComponent, UserItemComponent],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule, 
    FontAwesomeModule,
    RouterModule.forChild(routes), 
    //forRoot will initialize that service and register it to DI together with some route config,
    //while forChild will only register additional route configs and tell Angular2 to reuse the RouterService that forRoot has created
  ]
})
export class UserModule {
  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SelectivePreloadStrategy } from './SelectivePreloadStrategy';
import { AuthGuard } from './user/auth.guard';
import { UserProfileComponent } from './user/user-profile/user-profile/user-profile.component';

const appRoutes: Routes = [
  //resolve guard later nodig voor logged in check?
  { 
    path: 'game',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./game/game.module').then(mod => mod.GameModule),
      data: {preload: true}
  },
  {
    path: 'shop',
    canActivate: [ AuthGuard ],
    loadChildren: () =>
      import('./shop/shop.module').then(mod => mod.ShopModule),
      data: {preload: true}
  },
  {
    path: 'profile', 
    canActivate: [AuthGuard],
    component: UserProfileComponent
  },
  { path: '', redirectTo: 'shop/list', pathMatch: 'full'},
  { path: '**', component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(appRoutes, {preloadingStrategy: SelectivePreloadStrategy /*alternatief: PreloadAllModules*/}
      /*, {enableTracing: true} (for debugging) */)
  ],
  declarations: [],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
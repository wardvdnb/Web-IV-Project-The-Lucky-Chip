import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material/material.module';
import { HttpClientModule } from '@angular/common/http';
import { httpInterceptorProviders } from './http-interceptors';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    MainNavComponent,
  ],
  imports: [
    BrowserModule,
    //GameModule,
    BrowserAnimationsModule,
    MaterialModule,
    //ShopModule (lazy loaded, see app-routing module), routing order matters! approuting has a "*" that matches everything!
    HttpClientModule,
    LayoutModule,
    UserModule,
    AppRoutingModule
  ],
  providers: [httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }

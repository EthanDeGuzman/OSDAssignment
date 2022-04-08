import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Router, RouterModule } from '@angular/router';
import { routingComponents } from './app-routing.module';
import { GamesService } from './services/games.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JwtinterceptorService } from './services/helper/jwtinterceptor.service';
import { ErrorInterceptor } from './services/helper/errorinterceptor';

import { AngularFireModule } from "@angular/fire/compat";
import {AngularFireDatabaseModule, AngularFireDatabase} from '@angular/fire/compat/database';
import { environment } from 'src/environments/environment.prod';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtinterceptorService, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }

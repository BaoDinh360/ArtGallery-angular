import { Injectable, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthInterceptor } from './services/auth-interceptor';
import { UserModule } from './user/user.module';
import { MaterialModule } from './material-ui/material.module';
import { SharedModule } from './shared/shared.module';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { PostModule } from './post/post.module';
import { HttpErrorInterceptor } from './shared/interceptors/http-error.interceptor';

//socket config
// const socketConfig : SocketIoConfig = { url: 'http://localhost:3000', options: { autoConnect: false, }};



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthenticateComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    //Module for Material 3rd party module
    MaterialModule,
    UserModule,
    PostModule,

    //Module shared
    SharedModule,

    // SocketIoModule.forRoot(socketConfig),
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi:true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true
    },
    CookieService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

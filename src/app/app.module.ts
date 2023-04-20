import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http'

import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CookieService } from 'ngx-cookie-service';

//MaterialUIModule
// import {MatToolbarModule} from '@angular/material/toolbar';
// import {MatButtonModule} from '@angular/material/button';
// import {MatGridListModule} from '@angular/material/grid-list'
// import {MatCardModule} from '@angular/material/card'
// import {MatDividerModule} from '@angular/material/divider'
// import {MatDialogModule} from '@angular/material/dialog'
// import {MatFormFieldModule} from '@angular/material/form-field'
// import {MatInputModule} from '@angular/material/input'
// import {MatIconModule} from '@angular/material/icon'
// import {MatMenuModule} from '@angular/material/menu'
// import {MatListModule} from '@angular/material/list'
// import {MatProgressBarModule} from '@angular/material/progress-bar'
// import {MatSidenavModule} from '@angular/material/sidenav'

import { AuthenticateComponent } from './authenticate/authenticate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserDialogComponent } from './user/user-dialog/user-dialog.component';
import { AuthInterceptor } from './services/auth-interceptor';
import { FileUploadComponent } from './shared/components/file-upload/file-upload.component';
import { AlertComponent } from './shared/components/alert/alert.component';
import { UserModule } from './user/user.module';
import { MaterialModule } from './shared/material.module';
import { SharedModule } from './shared/shared.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthenticateComponent,
    RoutingComponents,
    // FileUploadComponent,
    // AlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NoopAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,

    //Module shared
    SharedModule,

    //Module for Material 3rd party module
    MaterialModule,
    // MatToolbarModule,
    // MatButtonModule,
    // MatGridListModule,
    // MatCardModule,
    // MatDividerModule,
    // MatDialogModule,
    // MatFormFieldModule,
    // MatInputModule,
    // MatIconModule,
    // MatMenuModule,
    // MatListModule,
    // MatProgressBarModule,
    // MatSidenavModule,

    UserModule
  ],
  providers: [
    {
      provide : HTTP_INTERCEPTORS, useClass : AuthInterceptor, multi:true
    },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingComponents, UserRoutingModule } from './user-routing.module';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    UserDialogComponent,
    UserRoutingComponents
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports :[
    UserDialogComponent,
    UserRoutingComponents
  ]
})
export class UserModule { }

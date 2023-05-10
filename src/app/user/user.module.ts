import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingComponents, UserRoutingModule } from './user-routing.module';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { MaterialModule } from '../material-ui/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { UserPostListComponent } from './user-post-list/user-post-list.component';


@NgModule({
  declarations: [
    UserDialogComponent,
    UserRoutingComponents,
    UserProfileComponent,
    UserPostListComponent
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

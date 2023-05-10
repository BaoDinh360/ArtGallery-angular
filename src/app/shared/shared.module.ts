import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AlertComponent } from './components/alert/alert.component';
import { MaterialModule } from '../material-ui/material.module';
import { PostDetailComponent } from './components/post-detail/post-detail.component';



@NgModule({
  declarations: [
    FileUploadComponent,
    AlertComponent,
    PostDetailComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    FileUploadComponent,
    AlertComponent,
    PostDetailComponent
  ]
})
export class SharedModule { }

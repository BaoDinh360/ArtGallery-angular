import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AlertComponent } from './components/alert/alert.component';
import { MaterialModule } from './material.module';



@NgModule({
  declarations: [
    FileUploadComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    FileUploadComponent,
    AlertComponent
  ]
})
export class SharedModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { AlertComponent } from './components/alert/alert.component';
import { MaterialModule } from '../material-ui/material.module';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { SnackbarNotificationComponent } from './components/snackbar-notification/snackbar-notification.component';
import { ToolbarActionsComponent } from './components/toolbar-actions/toolbar-actions.component';



@NgModule({
  declarations: [
    FileUploadComponent,
    AlertComponent,
    ConfirmDialogComponent,
    CommentListComponent,
    SnackbarNotificationComponent,
    ToolbarActionsComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule
  ],
  exports:[
    FileUploadComponent,
    AlertComponent,
    CommentListComponent,
    ToolbarActionsComponent
  ]
})
export class SharedModule { }

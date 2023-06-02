import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AuthenticateComponent } from 'src/app/authenticate/authenticate.component';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  dialogConfig: MatDialogConfig = {
    height : 'auto',
    width : '40%',
  }

  constructor(
    private dialog: MatDialog,
  ) { }

  showAuthDialog(authType: string){
    const dialogRef = this.dialog.open(AuthenticateComponent, {
      ...this.dialogConfig,
      data: {authType : authType}
    })
    return dialogRef;
  }

  showDialog(dialogType: string = 'info', title: string, message: string, dialogButtonTitle: string= 'Ok', hasCancelButton: boolean = false){
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      ...this.dialogConfig,
      data : {
        dialogType: dialogType,
        dialogTitle: title,
        dialogMessage: message,
        dialogButtonTitle: dialogButtonTitle,
        hasCancelButton: hasCancelButton
      }
    })
    return dialogRef; 
  }

  showDeleteDialog(title: string, message: string, hasCancelButton: boolean = false){
    return this.showDialog('delete', title, message, 'Delete', hasCancelButton); 
  }
  showInfoDialog(title: string, message: string, hasCancelButton: boolean = false){
    return this.showDialog('info', title, message, 'Ok', hasCancelButton); 
  }
}

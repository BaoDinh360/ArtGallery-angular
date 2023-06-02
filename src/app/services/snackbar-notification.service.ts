import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarNotificationComponent } from '../shared/components/snackbar-notification/snackbar-notification.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarNotificationService {

  constructor(
    private _snackBar: MatSnackBar
  ) { }

  showSnackBar(message: string | undefined, duration?:  number, type: string = 'info'){
    if(message == undefined) return;
    return this._snackBar.openFromComponent(SnackbarNotificationComponent, {
      duration: duration == undefined? undefined : duration * 1000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-container',`snackbar-${type}`],
      data: message
    })
  }

  showSuccessSnackbar(message: string, duration?: number){
    return this.showSnackBar(message, duration, 'success');
  }
  showErrorSnackbar(message: string | undefined,  duration?: number){
    return this.showSnackBar(message, duration, 'error');
  }
  showWarningSnackbar(message: string, duration?: number){
    return this.showSnackBar(message, duration, 'warning');
  }
}

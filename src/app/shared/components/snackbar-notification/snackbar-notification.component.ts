
import { Component, Inject, Input, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-notification',
  templateUrl: './snackbar-notification.component.html',
  styleUrls: ['./snackbar-notification.component.css']
})
export class SnackbarNotificationComponent implements OnInit {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ){}

  snackBarRef = inject(MatSnackBarRef);
  message!: string;

  ngOnInit(): void {
    this.message = this.data;
  }

  closeSnackbar(){
    this.snackBarRef.dismissWithAction();
  }
}

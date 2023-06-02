import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  dialogType: string = 'info';
  dialogTitle!: string;
  dialogMessage!: string;
  dialogButtonTitle!: string;
  hasCancelButton: boolean = false;

  constructor(
    private dialogRef : MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : any,
  ){}
  
  ngOnInit(): void {
    this.dialogType = this.data.dialogType;
    this.dialogTitle = this.data.dialogTitle;
    this.dialogMessage = this.data.dialogMessage;
    this.dialogButtonTitle = this.data.dialogButtonTitle;
    this.hasCancelButton = this.data.hasCancelButton;
  }

  closeDialogAndEmitData(confirm: boolean){
    this.dialogRef.close(confirm);
  }
}

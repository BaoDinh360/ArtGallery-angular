import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {

  dataDisplay!: string;

  constructor(
    private dialogRef : MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : string,
  ){}
  
  ngOnInit(): void {
    this.dataDisplay = this.data; 
  }

  closeDialogAndEmitData(confirm: boolean){
    this.dialogRef.close(confirm);
  }
}

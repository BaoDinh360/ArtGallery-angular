import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SnackbarNotificationService } from 'src/app/services/snackbar-notification.service';
import { UserService } from 'src/app/services/user.service';
import { FileUploadComponent } from 'src/app/shared/components/file-upload/file-upload.component';
import { RESPONSE_STATUS } from 'src/app/shared/models/enums';

@Component({
  selector: 'app-avatar-upload-dialog',
  templateUrl: './avatar-upload-dialog.component.html',
  styleUrls: ['./avatar-upload-dialog.component.css']
})
export class AvatarUploadDialogComponent implements OnInit {
  
  fileImage!: File;
  previewImageUrl!: string;

  @ViewChild('fileUpload') fileUpload! : FileUploadComponent;

  constructor(
    private userService: UserService,
    private dialogRef : MatDialogRef<AvatarUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar : SnackbarNotificationService
  ){}

  ngOnInit(): void {
    this.previewImageUrl = this.data.currentAvatarUrl;
  }
  
  openFolder(){
    this.fileUpload.openFolder();
  }

  onFileSelected(result: any){
    this.previewImageUrl = result.imageUrl;
    this.fileImage = result.fileImg;
  }

  onChangeAvatar(){
    if(this.fileImage){
      const imageFormData = new FormData();
      imageFormData.append('avatar', this.fileImage);
      
      this.userService.uploadUserAvatar(imageFormData).subscribe(result =>{
        if(result.status === RESPONSE_STATUS.SUCCESS){
          this.snackBar.showSuccessSnackbar('Avatar uploaded successfully', 3);
          setTimeout(() =>{
            this.oncloseDialogAndEmitData();
          }, 3);
          this.userService.loadUserProfile();
        }
      })
    }
    else{
      this.snackBar.showErrorSnackbar('Please upload a photo');
    }
  }

  oncloseDialogAndEmitData(){
    this.dialogRef.close();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DialogService } from 'src/app/services/dialog/dialog.service';
import { SnackbarNotificationService } from 'src/app/services/snackbar-notification.service';
import { UserService } from 'src/app/services/user.service';
import { RESPONSE_STATUS } from 'src/app/shared/models/enums';
import { UpdateUserInfo, User } from 'src/app/shared/models/userModel';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  userInfoForm : FormGroup;
  userModel!: User;
  // fileImage!: File;
  previewImageUrl!: string;
  constructor(
    private userService : UserService,
    private snackBar: SnackbarNotificationService,
    private dialogService: DialogService
  ){
    this.userInfoForm = new FormGroup({
      nameControl : new FormControl<string>('', [
        Validators.required
      ]),
      emailControl : new FormControl<string>('', [
        Validators.required
      ]),
      usernameControl : new FormControl<string>('', [
        Validators.required
      ]),
      avatarUploadControl: new FormControl('')
    })
  }

  ngOnInit(): void {
    this.getUserProfileInfo();
  }

  get nameInfo() {return this.userInfoForm.get('nameControl')};
  get emailInfo() {return this.userInfoForm.get('emailControl')};
  get usernameInfo() {return this.userInfoForm.get('usernameControl')};
  get avatarInfo() {return this.userInfoForm.get('avatarUploadControl')};

  getUserProfileInfo() :void{
    this.userService.loadUserProfile();
    this.userService.currentUserProfile$.subscribe(result =>{
      this.userModel = result;
      this.previewImageUrl = this.userModel.avatar.path;
      this.userInfoForm.patchValue({
        nameControl : this.userModel.name,
        emailControl : this.userModel.email,
        usernameControl : this.userModel.username
      })
    })
  }

  openChangeAvatar(){
    const dialogRef = this.dialogService.showChangeAvatarDialog(this.previewImageUrl);
    dialogRef.afterClosed().subscribe(result =>{

    })
  }

  // onFileSelected(result: any){
  //   this.previewImageUrl = result.imageUrl;
  //   this.fileImage = result.fileImg;
  // }

  // onUpdateInfo() : void{
  //   if(this.userInfoForm.valid){
  //     const imageFormData = new FormData();
  //     imageFormData.append('avatar', this.fileImage);
  //     this.userService.uploadUserAvatar(imageFormData).subscribe(result =>{
  //       const currentUserInfo: UpdateUserInfo = {
  //         name: this.nameInfo?.value,
  //         username: this.usernameInfo?.value,
  //         avatar: result.data
  //       }
  //       this.userService.updateCurrentUserInfo(currentUserInfo).subscribe(result =>{
  //         if(result.status === RESPONSE_STATUS.SUCCESS){
  //           this.snackBar.showSuccessSnackbar('Update user info successfully', 3);
  //           this.userService.loadUserProfile();
  //         }
  //       })
  //     })
  //   }

  onUpdateInfo() : void{
    if(this.userInfoForm.valid){
      const currentUserInfo: UpdateUserInfo ={
        name: this.nameInfo?.value,
        username: this.usernameInfo?.value
      }
      this.userService.updateCurrentUserInfo(currentUserInfo).subscribe(result =>{
        if(result.status === RESPONSE_STATUS.SUCCESS){
          this.snackBar.showSuccessSnackbar('Update user info successfully', 3);
          this.userService.loadUserProfile();
        }
      })
    }
  }
  
}

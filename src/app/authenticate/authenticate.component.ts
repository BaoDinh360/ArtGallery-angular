import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { UserRegistration } from '../shared/models/userModel';
import { RESPONSE_STATUS } from '../shared/models/enums';
import { SnackbarNotificationService } from '../services/snackbar-notification.service';

@Component({
  selector: 'app-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.css']
})
export class AuthenticateComponent implements OnInit {

  authType : string = '';
  authForm : FormGroup;

  constructor(
    public dialogRef : MatDialogRef<AuthenticateComponent>,
    @Inject(MAT_DIALOG_DATA) public data : {authType : string},
    private authService : AuthService,
    private snackBar: SnackbarNotificationService,
  ){

    this.authForm = new FormGroup({
      nameControl : new FormControl('', [
        Validators.required
      ]),
      usernameControl : new FormControl('', [
        Validators.required
      ]),
      emailControl : new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      passwordControl : new FormControl('', [
        Validators.required
      ])
    })
  }

  get name() { return this.authForm.get('nameControl');}
  get username() { return this.authForm.get('usernameControl');}
  get email() { return this.authForm.get('emailControl');}
  get password() { return this.authForm.get('passwordControl');}

  ngOnInit(): void {
    // this.authType = this.data.authType;
    // console.log(this.authType);

    // //nếu là đăng nhập thì k cần name, username
    // if(this.authType == 'Sign in'){
    //   // this.authForm.removeControl('nameControl');
    //   // this.authForm.removeControl('usernameControl');
    //   this.name?.disable();
    //   this.username?.disable();
    // }
    // else{
    //   this.name?.enable();
    //   this.username?.enable();
    // }
    this.setUpAuthType(this.data.authType);
  }
  

  switchAuthType(authType: string){
    this.setUpAuthType(authType);
  }

  setUpAuthType(authType: string){
    this.authType = authType;
    //disable name, username control if using login
    if(this.authType == 'Sign in'){
      // this.authForm.removeControl('nameControl');
      // this.authForm.removeControl('usernameControl');
      this.name?.disable();
      this.username?.disable();
    }
    else{
      this.name?.enable();
      this.username?.enable();
    }
  }

  closeDialog() : void{
    this.dialogRef.close();
  }

  inputValueChanged(event : any){

  }

  onSubmit(){
    console.log(this.authForm.valid);
    console.log(this.authForm.value);
    
    if(this.authForm.valid){
      let email = this.email?.value;
      let password = this.password?.value;

      const userRegistration : UserRegistration = {
        name : this.name?.value,
        email : email,
        username : this.username?.value,
        password : password
      }

      //Sign in
      if(this.authType == 'Sign in'){
        this.signIn(email, password);
      }
      else if(this.authType == 'Sign up'){
        this.signUp(userRegistration);
      }
    }
    
  }

  signIn(email : string, password : string){
    this.authService.signIn(email, password)
      .subscribe(result =>{
          if(result.status === RESPONSE_STATUS.SUCCESS){
            this.authService.storeUserLoginInfo(result.data.accessToken);
            // this.authService.setUpCurrentUserLoginInfo();
            this.dialogRef.close({
              event : 'Signed in',
              data : {isSignedIn : true}
            })
          }
          else if(result.status === RESPONSE_STATUS.ERROR){

          }
        });
  }

  signUp(userRegistration : UserRegistration){
    this.authService.signUp(userRegistration)
      .subscribe(result =>{
        console.log(result);
        if(result.status === RESPONSE_STATUS.SUCCESS){
          this.snackBar.showSuccessSnackbar('Your account is successfully created. You can sign in now.', 8);
          this.switchAuthType('Sign in');
          // this.dialogRef.close({
          //   event : 'Signed in',
          //   data : {isSignedIn : true}
          // })
        }
        else if(result.status == RESPONSE_STATUS.ERROR){
        }
      })
  }
}

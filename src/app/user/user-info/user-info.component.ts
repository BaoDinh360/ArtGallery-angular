import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/userModel';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  userInfoForm : FormGroup;

  constructor(
    private userService : UserService
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
      ])
    })
  }
  ngOnInit(): void {
    this.getUserProfileInfo();
  }

  get nameInfo() {return this.userInfoForm.get('nameControl')};
  get emailInfo() {return this.userInfoForm.get('emailControl')};
  get usernameInfo() {return this.userInfoForm.get('usernameControl')};

  getUserProfileInfo() :void{
    this.userService.getUserProfile().subscribe(result =>{
      if(result.status == 'success'){
        console.log(result);
        const data = result.data;
        this.userInfoForm.setValue({
          nameControl : data.name,
          emailControl : data.email,
          usernameControl : data.username
        })
      }
    })
  }
  onUpdateInfo() : void{

  }
}

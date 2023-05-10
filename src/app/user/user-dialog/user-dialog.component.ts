import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/userModel';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit, AfterViewInit {

  @Output() signOutEvent : EventEmitter<boolean> = new EventEmitter<boolean>();
  
  // currentUserLoginInfo = {
  //   id : '',
  //   email : '',
  //   username : ''
  // };
  currentUserLoginInfo! : User;
  display : string = '';
  constructor(
    private authService : AuthService,
    private router : Router,
    private userService: UserService,
  ){
  }

  ngOnInit(): void {
    this.userService.getUserProfile().subscribe(result =>{
      this.currentUserLoginInfo = result.data;
      if(this.currentUserLoginInfo.avatar != undefined){
        this.currentUserLoginInfo.avatarUrl = window.location.origin + '/' + this.currentUserLoginInfo.avatar.path;
      }
      else{
        this.currentUserLoginInfo.avatarUrl = 'https://material.angular.io/assets/img/examples/shiba1.jpg';
      }
    });
  }
  ngAfterViewInit(): void {
  }

  signOut() : void{
    this.authService.signOut().subscribe();
    this.signOutEvent.emit(false);
    this.router.navigate(['']);
  }
}

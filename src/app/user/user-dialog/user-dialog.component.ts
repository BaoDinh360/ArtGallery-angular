import { AfterViewInit, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-dialog',
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit, AfterViewInit {

  @Output() signOutEvent : EventEmitter<boolean> = new EventEmitter<boolean>();
  
  currentUserLoginInfo = {
    id : '',
    email : '',
    username : ''
  };
  display : string = '';
  constructor(
    private authService : AuthService,
    private router : Router
  ){
  }

  ngOnInit(): void {
    this.authService.getCurrentUserLoginInfo().subscribe(currentUserLoginInfo =>{
      this.currentUserLoginInfo = currentUserLoginInfo;
    })
  }
  ngAfterViewInit(): void {
  }

  signOut() : void{
    this.authService.signOut();
    this.signOutEvent.emit(false);
    this.router.navigate(['']);
  }
}

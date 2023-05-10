import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthenticateComponent } from '../authenticate/authenticate.component';
import { AuthService } from '../services/auth.service';
import { UserDialogComponent } from '../user/user-dialog/user-dialog.component';
import { EventSocketService } from '../services/event-socket.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  @Input() isUserSignedIn : boolean = false;
  @Output() userSignInEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  openSignIn : boolean = false;

  constructor(
    public dialog : MatDialog,
    private authService : AuthService,
    private router : Router,
  ){
    // this.authService.checkTokenExpiresOnStartUp();
  }

  ngOnInit(): void {
    // this.authService.setUpCurrentUserLoginInfo();
    // this.isUserSignedIn = this.authService.isSignedIn();
  }

  ngAfterViewInit(): void {
    if(this.router.getCurrentNavigation()?.extras.state != undefined){
      this.openSignIn = this.router.getCurrentNavigation()?.extras.state?.['openSignIn']
      console.log(this.openSignIn);
      
    }
    if(this.openSignIn){
      this.openForm('Sign in');
    }
  }

  openForm(authType : string) : void{
    const dialogRef = this.dialog.open(AuthenticateComponent, 
      {
        height : 'auto',
        width : '40%',
        data : {authType : authType}
      });
    
    dialogRef.afterClosed().subscribe(result =>{
      if(result == undefined){
        return;
      }
      else{
        if(result.event == 'Signed in'){
          // this.isUserSignedIn = result.data.isSignedIn;
          this.userSignInEvent.emit(result.data.isSignedIn);
        }
      }
      
    })
  }

  userSignOut(event : boolean) : void{
    // this.isUserSignedIn = event;
    this.userSignInEvent.emit(event);
  }
}

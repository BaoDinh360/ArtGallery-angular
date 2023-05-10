import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isUserSignedIn: boolean = false;
  constructor(
    private authService : AuthService
  ){
    this.authService.checkTokenExpiresOnStartUp();
  }
  // getIsUserSignedIn() : boolean{
  //   return this.isUserSignedIn;
  // }
  ngOnInit(): void {
    this.authService.setUpCurrentUserLoginInfo();
    this.isUserSignedIn = this.authService.isSignedIn();
  }
  
  onUserSignedIn(event: boolean){
    this.isUserSignedIn = event;
  }

  title = 'art-gallery';
}

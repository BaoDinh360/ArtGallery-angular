import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { EventSocketService } from './services/event-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isUserSignedIn: boolean = false;
  constructor(
    private authService : AuthService,
    private eventSocket: EventSocketService,
  ){
    this.authService.checkTokenExpiresOnStartUp();
  }
  ngOnInit(): void {
    // this.authService.setUpCurrentUserLoginInfo();
    //set up socket listeners
    this.eventSocket.connectToSocket();
    // this.isUserSignedIn = this.authService.isSignedIn();
    this.authService.isSignedIn().subscribe(result =>{
      this.isUserSignedIn = result;
    })
    console.log(this.isUserSignedIn);
    
  }
  
  onUserSignedIn(event: boolean){
    this.isUserSignedIn = event;
  }

  title = 'art-gallery';
}

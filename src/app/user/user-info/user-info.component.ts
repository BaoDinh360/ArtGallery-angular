import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/app/shared/models/userModel';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent implements OnInit {

  username! : string | null;
  constructor(
    private activatedRoute : ActivatedRoute,
    private router : Router
  ){}

 ngOnInit(): void {
   
 }

 navigateToUserProfile(){
  this.router.navigate(['profile'], {relativeTo: this.activatedRoute});
 }
 navigateToUserPost(){
  this.router.navigate(['posts'], {relativeTo: this.activatedRoute});
 }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseResult } from '../shared/models/responseResult';
import { User } from '../shared/models/userModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private httpClient : HttpClient
  ) { }

  getUserProfile(){
    return this.httpClient.get<ResponseResult<User>>('/api/users/my-profile');
  }
}

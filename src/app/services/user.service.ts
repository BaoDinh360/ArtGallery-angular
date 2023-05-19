import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseResult } from '../shared/models/responseResult';
import { UpdateUserInfo, User, UserAvatar } from '../shared/models/userModel';
import { BehaviorSubject, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserProfile = new Subject<User>();
  currentUserProfile$ = this.currentUserProfile.asObservable();

  constructor(
    private httpClient : HttpClient
  ) { }

  getUserProfile(){
    return this.httpClient.get<ResponseResult<User>>('/api/users/profile')
  }

  loadUserProfile(){
    this.getUserProfile().subscribe(result =>{
      this.currentUserProfile.next(result.data);
    })
  }

  uploadUserAvatar(formData: FormData){
    return this.httpClient.post<ResponseResult<UserAvatar>>('/api/users/upload', formData);
  }

  updateCurrentUserInfo(currentUserInfo: UpdateUserInfo){
    return this.httpClient.put<ResponseResult<User>>('/api/users/update', currentUserInfo);

  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject, tap } from 'rxjs';
import { ResponseResult } from '../shared/models/responseResult';
import { UserLoginInfo } from '../shared/models/userLoginModel';
import { User, UserLoginCredentials, UserRegistration } from '../shared/models/userModel';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserLoginInfo = new BehaviorSubject<any>({
    id : '',
    email : '',
    username : ''
  });

  private currentUserLoginInfo$ = this.currentUserLoginInfo.asObservable();

  constructor(
    private httpClient : HttpClient,
    private cookieService : CookieService
  ) { 
  }

  signIn(email : string, password : string) {
    return this.httpClient.post<ResponseResult<UserLoginCredentials>>('/api/login', {email : email, password : password});
  }
  signUp(userRegistration : UserRegistration){
    return this.httpClient.post<ResponseResult<UserLoginCredentials>>('/api/register', userRegistration);
  }

  refreshAccessToken(refreshToken : string){
    return this.httpClient.post<ResponseResult<any>>('/api/token', {refreshToken : refreshToken})
      .pipe(tap(result =>{
        this.cookieService.set('access-token', result.data.accessToken);
      }));
  }

  storeUserLoginInfo(userLoginInfo : UserLoginCredentials){
    const decodedToken = jwtDecode<any>(userLoginInfo.accessToken);
    const userLoginId = decodedToken._id;
    const userName = decodedToken.username;
    const email = decodedToken.email;
    let duration = parseInt(userLoginInfo.expiredIn.split("")[0]);
    let expiresAt = dayjs().add(duration, 'm');

    this.cookieService.set('access-token', userLoginInfo.accessToken);
    this.cookieService.set('expire-at', JSON.stringify(expiresAt.valueOf()));
    this.cookieService.set('refresh-token', userLoginInfo.refreshToken);
    this.cookieService.set('user-id', userLoginId);
    this.cookieService.set('username', userName);
    this.cookieService.set('email', email);
  }

  signOut(){
    this.cookieService.delete('access-token');
    this.cookieService.delete('expire-at');
    this.cookieService.delete('refresh-token');
    this.cookieService.delete('user-id');
    this.cookieService.delete('username');
    this.cookieService.delete('email');
  }

  isSignedIn(){
    if(this.getExpiration() == undefined){
      return false;
    }
    return dayjs().isBefore(this.getExpiration());
  }

  isSignedOut(){
    return !this.isSignedIn;
  }

  // getCurrentUserLoginId(){
  //   const token = localStorage.getItem('token');
  //   if(token != null){
  //     const decoded = jwtDecode<any>(token);
  //     return decoded['id'];
  //   }
  //   return undefined;
  // }

  setUpCurrentUserLoginInfo(){
    this.currentUserLoginInfo.next({
      id : this.cookieService.get('user-id'),
      email : this.cookieService.get('email'),
      username : this.cookieService.get('username')
      
    })
  }

  getCurrentUserLoginInfo(){
    return this.currentUserLoginInfo$;
  }

  getAuthAcessToken() {
    return this.cookieService.get('access-token');
  }

  getRefreshToken(){
    return this.cookieService.get('refresh-token');
  }

  getExpiration(){
    const expiration = this.cookieService.get('expire-at');
    if(expiration != ''){
      const expiredAt = JSON.parse(expiration);
      return dayjs(expiredAt);
    }
    return undefined;
  }
}

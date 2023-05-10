import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject, map, tap } from 'rxjs';
import { ResponseResult } from '../shared/models/responseResult';
import { UserLoginInfo } from '../shared/models/userLoginModel';
import { User, UserLoginCredentials, UserRegistration } from '../shared/models/userModel';
import { RESPONSE_STATUS } from '../shared/models/enums';
import { EventSocketService } from './event-socket.service';


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
  // private accessTokenTimeout?: any;

  constructor(
    private httpClient : HttpClient,
    private cookieService : CookieService,
    private eventSocket: EventSocketService,
  ) { 
  }

  signIn(email : string, password : string) {
    return this.httpClient.post<ResponseResult<UserLoginCredentials>>('/api/auth/login', {email : email, password : password});
  }
  signUp(userRegistration : UserRegistration){
    return this.httpClient.post<ResponseResult<UserLoginCredentials>>('/api/auth/register', userRegistration);
  }

  refreshAccessToken(refreshToken : string){
    return this.httpClient.post<ResponseResult<any>>('/api/auth/token', {refreshToken : refreshToken})
      // .pipe(tap(result =>{
      //   if(result.status === RESPONSE_STATUS.SUCCESS){
      //     this.cookieService.set('access-token', result.data.accessToken);
      //   }
      // }));
      .pipe(map(result =>{
        this.storeUserLoginInfo(result.data);
        this.setUpCurrentUserLoginInfo();
        this.startAccessTokenTimer();
        return result;
      }))
  }

  private startAccessTokenTimer(){
    // const expires = this.getExpiration();
    // if(expires != undefined){
    //   // refresh new access token 1m before expire
    //   const timeout = expires.minute() - (60 * 1000);
    //   this.accessTokenTimeout =  setTimeout(
    //     () => this.refreshAccessToken(this.cookieService.get('refresh-token')).subscribe(), 
    //     timeout);
    // }
  }
  private stopAccessTokenTimer(){
    //clearTimeout(this.accessTokenTimeout);
  }

  storeUserLoginInfo(userLoginInfo : UserLoginCredentials){
    const decodedToken = jwtDecode<any>(userLoginInfo.accessToken);
    const userLoginId = decodedToken._id;
    const userName = decodedToken.username;
    const email = decodedToken.email;
    let duration = parseInt(userLoginInfo.expiredIn.split("")[0]);
    let expiresAt = dayjs().add(duration, 'm');
    let expireDate = expiresAt.toDate();
    let refreshTokenDuration = parseInt(userLoginInfo.expiredIn.split("")[0]);
    let refreshExpireDate = dayjs().add(refreshTokenDuration, 'd').toDate();

    this.cookieService.set('access-token', userLoginInfo.accessToken, expireDate);
    this.cookieService.set('expire-at', JSON.stringify(expiresAt.valueOf()), expireDate);
    this.cookieService.set('refresh-token', userLoginInfo.refreshToken, refreshExpireDate);
    this.cookieService.set('user-id', userLoginId, expireDate);
    this.cookieService.set('username', userName, expireDate);
    this.cookieService.set('email', email, expireDate);
  }

  signOut(){
    return this.httpClient.post<ResponseResult<any>>('/api/auth/logout', {})
      .pipe(map(result =>{
        this.stopAccessTokenTimer();
        this.eventSocket.disconnectSocket(this.cookieService.get('user-id'));
        this.cookieService.delete('access-token');
        this.cookieService.delete('expire-at');
        this.cookieService.delete('refresh-token');
        this.cookieService.delete('user-id');
        this.cookieService.delete('username');
        this.cookieService.delete('email');
        return result;
      }));
    
  }

  isSignedIn(){
    // if(this.getExpiration() == undefined){
    //   return false;
    // }
    // return dayjs().isBefore(this.getExpiration());
    if(this.cookieService.get('expire-at') != ''){
      return true;
    }
    return false;
  }

  isSignedOut(){
    return !this.isSignedIn;
  }

  setUpCurrentUserLoginInfo(){
    this.currentUserLoginInfo.next({
      id : this.cookieService.get('user-id'),
      email : this.cookieService.get('email'),
      username : this.cookieService.get('username')
    })
    this.setUpSocketConnection();
  }

  getCurrentUserLoginInfo(){
    return this.currentUserLoginInfo$;
  }

  setUpSocketConnection(){
    this.currentUserLoginInfo$.subscribe(result =>{
      if(result.id != ''){
        this.eventSocket.connectSocket(result.id);
      }
    })
  }

  checkTokenExpiresOnStartUp(){
    //Nếu refresh token còn thời hạn
    if(this.cookieService.get('refresh-token') != ''){
      //nếu access token đã hết hạn --> request lấy access token mới
      const refreshToken = this.cookieService.get('refresh-token');
      if(this.cookieService.get('access-token') == ''){
        this.refreshAccessToken(refreshToken).subscribe();
      }
    }
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

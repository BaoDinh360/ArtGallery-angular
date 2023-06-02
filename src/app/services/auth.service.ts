import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as dayjs from 'dayjs';
import jwtDecode, { JwtPayload } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Subject, map, tap } from 'rxjs';
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

  private isUserSignedIn = new BehaviorSubject<boolean>(false);
  private isUserSignedIn$ = this.isUserSignedIn.asObservable();

  private accessToken!: string;
  // private isUserSignedIn: boolean = false;

  private currentUserLoginInfo$ = this.currentUserLoginInfo.asObservable();

  constructor(
    private httpClient : HttpClient,
    private cookieService : CookieService,
  ) { 
  }

  signIn(email : string, password : string) {
    return this.httpClient.post<ResponseResult<UserLoginCredentials>>('/api/auth/login', {email : email, password : password});
  }
  signUp(userRegistration : UserRegistration){
    return this.httpClient.post<ResponseResult<UserLoginCredentials>>('/api/auth/register', userRegistration);
  }

  // refreshAccessToken(refreshToken : string){
  //   return this.httpClient.post<ResponseResult<any>>('/api/auth/token', {refreshToken : refreshToken})
  //     .pipe(map(result =>{
  //       this.storeUserLoginInfo(result.data);
  //       this.setUpCurrentUserLoginInfo();
  //       return result;
  //     }))
  // }

  refreshAccessToken(){
    return this.httpClient.post<ResponseResult<any>>('/api/auth/token', {withCredentials: true})
      .pipe(map(result =>{
        if(result.data != undefined){
          this.storeUserLoginInfo(result.data.accessToken);
        // this.setUpCurrentUserLoginInfo();
        }
        return result;
      }))
  }

  storeUserLoginInfo(accessToken: string){
    if(accessToken){
      this.accessToken = accessToken;
      this.isUserSignedIn.next(true);
      try {
        const payload = jwtDecode<any>(accessToken);
      this.currentUserLoginInfo.next({
        id : payload._id,
        email : payload.email,
        username : payload.username
      })
      } catch (error) {
        console.log(error); 
      }
    }
    else{
      this.isUserSignedIn.next(false);
    }
  }

  // storeUserLoginInfo(userLoginInfo : UserLoginCredentials){
  //   const decodedToken = jwtDecode<any>(userLoginInfo.accessToken);
  //   const userLoginId = decodedToken._id;
  //   const userName = decodedToken.username;
  //   const email = decodedToken.email;
  //   let duration = parseInt(userLoginInfo.expiredIn.split("")[0]);
  //   let expiresAt = dayjs().add(duration, 'm');
  //   let expireDate = expiresAt.toDate();
  //   let refreshTokenDuration = parseInt(userLoginInfo.expiredIn.split("")[0]);
  //   let refreshExpireDate = dayjs().add(refreshTokenDuration, 'd').toDate();

  //   this.cookieService.set('access-token', userLoginInfo.accessToken, refreshExpireDate);
  //   this.cookieService.set('expire-at', JSON.stringify(expiresAt.valueOf()), refreshExpireDate);
  //   this.cookieService.set('refresh-token', userLoginInfo.refreshToken, refreshExpireDate);
  //   this.cookieService.set('user-id', userLoginId, refreshExpireDate);
  //   this.cookieService.set('username', userName, refreshExpireDate);
  //   this.cookieService.set('email', email, refreshExpireDate);
  // }

  // signOut(){
  //   return this.httpClient.post<ResponseResult<any>>('/api/auth/logout', {})
  //     .pipe(map(result =>{
  //       //disconnect from socket users namespace when sign out
  //       // this.disconnectFromUserSocket();
  //       this.cookieService.delete('access-token');
  //       this.cookieService.delete('expire-at');
  //       this.cookieService.delete('refresh-token');
  //       this.cookieService.delete('user-id');
  //       this.cookieService.delete('username');
  //       this.cookieService.delete('email');
  //       return result;
  //     }));
  // }

  signOut(){
    return this.httpClient.post<ResponseResult<any>>('/api/auth/logout', {});
  }

  // isSignedIn(){
  //   // if(this.getExpiration() == undefined){
  //   //   return false;
  //   // }
  //   // return dayjs().isBefore(this.getExpiration());
  //   // if(this.cookieService.get('expire-at') != ''){
  //   //   return true;
  //   // }
  //   // return false;
  //   return this.isUserSignedIn;
  // }

  // isSignedOut(){
  //   return !this.isSignedIn();
  // }

  isSignedIn(){
    return this.isUserSignedIn$;
  }

  // setUpCurrentUserLoginInfo(){
  //   this.currentUserLoginInfo.next({
  //     id : this.cookieService.get('user-id'),
  //     email : this.cookieService.get('email'),
  //     username : this.cookieService.get('username')
  //   })
  //   // this.setUpSocketConnection();
  // }

  getCurrentUserLoginInfo(){
    return this.currentUserLoginInfo$;
  }

  // setUpSocketConnection(){
  //   // this.currentUserLoginInfo$.subscribe(result =>{
  //   //   if(result.id != ''){
  //   //     //connect to socket users namespace
  //   //     this.userSocket.connectToSocket();
  //   //   }
  //   // })
  //   //if user is already signed in, connect to socket users namespace
  //   if(this.isSignedIn()){
  //     this.guestSocket.disconnectFromSocket();
  //     const accessToken = this.cookieService.get('access-token');
  //     this.userSocket.connectToSocket(accessToken);
  //   }
  //   // else connect to socket guests namespace
  //   else{
  //     this.guestSocket.connectToSocket();
  //   }
  // }
  // disconnectFromUserSocket(){
  //   //when disconnect from socket users namespace, connect to socket guests namespace
  //   const userId = this.cookieService.get('user-id');
  //   this.userSocket.disconnectFromSocket(userId);
  //   this.guestSocket.connect();
  // }

  checkTokenExpiresOnStartUp(){
    //Nếu refresh token còn thời hạn
    // if(this.getRefreshToken() != ''){
    //   //nếu access token đã hết hạn --> request lấy access token mới
    //   const refreshToken = this.getRefreshToken();
    //   if(this.getAuthAcessToken() == ''){
    //     this.refreshAccessToken(refreshToken).subscribe();
    //   }
    // }
    const accessToken = this.getAuthAcessToken();
    if(accessToken == undefined || accessToken == ''){
      this.refreshAccessToken().subscribe();
    }
  }

  // getAuthAcessToken() {
  //   return this.cookieService.get('access-token');
  // }
  getAuthAcessToken() {
    return this.accessToken;
  }

  getRefreshToken(){
    return this.cookieService.get('jwt-refresh');
  }

  // getExpiration(){
  //   const expiration = this.cookieService.get('expire-at');
  //   if(expiration != ''){
  //     const expiredAt = JSON.parse(expiration);
  //     return dayjs(expiredAt);
  //   }
  //   return undefined;
  // }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { RESPONSE_STATUS } from '../models/enums';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService : AuthService,
    private router : Router
  ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if(this.authService.isSignedIn()){
        return true;
      }
      else{
        const isRefreshTokenSuccess = this.refreshingToken();
        if(!isRefreshTokenSuccess){
          this.router.navigate(['']);
        }
        console.log(isRefreshTokenSuccess);
        
        return isRefreshTokenSuccess;
      }
      
  }

  private refreshingToken(){
    return this.authService.refreshAccessToken().pipe(
      map(result =>{
        if(result.status === RESPONSE_STATUS.SUCCESS){
          return true;
        }
        else return false;
      })
    )
  }
  
}

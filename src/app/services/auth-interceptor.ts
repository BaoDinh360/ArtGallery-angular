import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { AuthService } from "./auth.service";
import { RESPONSE_STATUS } from "../shared/models/enums";
import { SnackbarNotificationService } from "./snackbar-notification.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(
        private authService : AuthService,
        private snackBar : SnackbarNotificationService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authAccessToken = this.authService.getAuthAcessToken();
        //Access token found
        if(authAccessToken){
            //Clone req và thêm authorization bearer vào header nếu đã login 
            const clonedReq = this.addTokenToHeader(req, authAccessToken);
            // return next.handle(clonedReq);
            return next.handle(clonedReq).pipe(catchError(err =>{
                //If access token expired, request new access token
                if(err instanceof HttpErrorResponse && err.status === 401){
                    return this.handle401Error(req, next);
                }
                else{
                    return throwError(() => err);
                }
            }));
        }
        //No access token found
        // else return next.handle(req).pipe(catchError(err =>{
        //     //If access token expired, request new access token
        //     if(err instanceof HttpErrorResponse && err.status === 401){
        //         return this.handle401Error(req, next);
        //     }
        //     else{
        //         return throwError(() => err);
        //     }
        // }));
        else return next.handle(req).pipe(catchError(err =>{
            return throwError(() => err);
        }));
    }

    private addTokenToHeader(req: HttpRequest<any>, accessToken : string){
        return req.clone({
            setHeaders : {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    private isRefreshing : boolean = false;
    private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private handle401Error(req: HttpRequest<any>, next: HttpHandler){
        if(!this.isRefreshing){
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.authService.refreshAccessToken().pipe(
                switchMap((result) =>{
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(result.data.accessToken);
                    return next.handle(this.addTokenToHeader(req, result.data.accessToken));
                    
                }),
                catchError((err) =>{
                    this.isRefreshing = false;
                    //if error 401 or 403, log out and show message
                    if(err.status === 401 || err.status === 403){
                        console.log('log out');
                        
                        this.authService.signOut().subscribe();
                        this.snackBar.showErrorSnackbar('Your session has expired. Please sign in again to continue using!');
                    }
                    return throwError(() => err);
                })
            )
        }
        else{
            return this.refreshTokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(token =>{
                    return next.handle(this.addTokenToHeader(req, token))
                }) 
                
            )
        }
    }
}
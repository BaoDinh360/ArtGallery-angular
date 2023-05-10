import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, filter, Observable, switchMap, take, throwError } from "rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{

    constructor(
        private authService : AuthService
    ){}

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const authAccessToken = this.authService.getAuthAcessToken();
        if(authAccessToken){
            //Clone req và thêm authorization bearer vào header nếu đã login 
            const clonedReq = this.addTokenToHeader(req, authAccessToken);
            // return next.handle(clonedReq);
            return next.handle(clonedReq).pipe(catchError(err =>{
                //Trong TH accessToken hết hạn, lấy lại access token mới
                if(err instanceof HttpErrorResponse && err.status === 401){
                    return this.handle401Error(req, next);
                }
                else{
                    return throwError(err);
                }
            }));
        }
        //trả về req bth 
        else return next.handle(req);
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

            return this.authService.refreshAccessToken(this.authService.getRefreshToken()).pipe(
                switchMap(result =>{
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(result.data.accessToken);
                    return next.handle(this.addTokenToHeader(req, result.data.accessToken))
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
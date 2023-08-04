import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode
} from '@angular/common/http';
import { Observable, catchError, retry, throwError } from 'rxjs';
import { SnackbarNotificationService } from 'src/app/services/snackbar-notification.service';
import { AuthService } from 'src/app/services/auth.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: SnackbarNotificationService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request)
      .pipe(
        // retry(1),
        catchError((error: HttpErrorResponse) => {
          let errorMsg = undefined;
          console.log(error);
          //client side error
          if(error.error instanceof ErrorEvent){
            errorMsg = `Error: ${error.error.message}`;
          }
          //server side error
          else{
            //internal server error
            if(error.status === HttpStatusCode.InternalServerError){
              errorMsg = `Server Error: ${error.status} \nMessage: ${error.error.message}`
            }
            //request error
            else if(error.status !== HttpStatusCode.Unauthorized && error.status !== HttpStatusCode.Forbidden){
              errorMsg = `Error: ${error.error.message}`
            }
            //only sign out when 403 error
            //exclude 401 error because if request return 401, it will request for refresh token first
            //if refresh token result return 403 then sign out
            // else if(error.status === HttpStatusCode.Forbidden){
            //   errorMsg = undefined;
            //   this.authService.signOut().subscribe();
            // }
          }
          this.snackBar.showErrorSnackbar(errorMsg);
          return throwError(() => error); 
        })
      );
  }
}

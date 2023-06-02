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

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private snackBar: SnackbarNotificationService,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return next.handle(request)
      .pipe(
        retry(1),
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
            else if(error.status !== HttpStatusCode.Unauthorized){
              errorMsg = `Error: ${error.error.message}`
            }
            //401 error
            else{
              errorMsg = undefined;
            }
          }
          this.snackBar.showErrorSnackbar(errorMsg);
          return throwError(() => error); 
        })
      );
  }
}

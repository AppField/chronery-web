import { Observable, throwError as observableThrowError } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { AuthService } from '../user/auth.service';
import { MatSnackBar } from '@angular/material';
import { catchError, mergeMap } from 'rxjs/operators';

// operators


@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  private handleError = (error: Response) => {
    const message = 'Daten konnten nicht geladen werden. Bitte versuchen Sie es erneut';
    // if (error.status === 0) {
    // 	message = 'Keine Netzwerkverbindung';
    // }
    this.snackBar.open(message, null, {
      duration: 10000,
    });

    return observableThrowError(error);
  }

  constructor(private authService: AuthService,
              public snackBar: MatSnackBar) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.includes('amazonaws')) {

      return this.authService.getSession()
        .pipe(
          mergeMap((session) => {
            request = request.clone({
              setHeaders: {
                Authorization: session.idToken.jwtToken
              }
            });

            return next.handle(request).pipe(catchError(this.handleError));
          }));
    }
    return next.handle(request).pipe(catchError(this.handleError));
  }

}

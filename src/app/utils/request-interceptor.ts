import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../user/auth.service';
import { MatSnackBar } from '@angular/material';
// operators
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/map'


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

    return Observable.throw(error);
  }

  constructor(private authService: AuthService,
              public snackBar: MatSnackBar) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (request.url.includes('amazonaws')) {
      this.authService.getSession()
        .subscribe(
          result => {
            request = request.clone({
              setHeaders: {
                Authorization: result.accessToken.jwtToken
              }
            });
          },
          error => {
            this.handleError(error);
          });

      return next.handle(request).catch(this.handleError);
    }
    return next.handle(request);
  }

}

import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpRequest, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

// operators
import 'rxjs/add/operator/catch'
import 'rxjs/add/observable/throw'
import 'rxjs/add/operator/map'
import { AuthService } from '../user/auth.service';


@Injectable()
export class RequestInterceptor implements HttpInterceptor {

	constructor(private authService: AuthService) {
	}


	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (request.url.includes('amazonaws')) {

			this.authService.getAuthenticatedUser().getSession((err, session) => {
				request = request.clone({
					setHeaders: {
						Authorization: session.getIdToken().getJwtToken()
					}
				});
			});
		}

		return next.handle(request);
	}

	//
	// public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
	// 	return super.request(url, options)
	// 		.catch(this.handleError);
	// }
	//
	// private handleError = (error: Response) => {
	// 	// Do messaging and error handling
	//
	// 	return Observable.throw(error);
	// }

}

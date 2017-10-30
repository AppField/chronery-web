import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService,
				private router: Router) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return new Promise<boolean>((resolve, reject) => {
			this.authService.isAuthenticated().subscribe(isAuthenticated => {

				if (isAuthenticated) {
					console.log('Authenticated!');
					resolve(true);
				} else {
					this.router.navigate(['login']);
				}
				resolve(false);
			});
		});
	}
}

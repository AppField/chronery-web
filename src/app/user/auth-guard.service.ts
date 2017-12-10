import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private authService: AuthService,
				private router: Router) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		console.log('HELLO FROM AUTH GUARD');
		return new Promise<boolean>((resolve, reject) => {
			console.log('INSIDE AUTH NEW PROMISE');
			this.authService.isAuthenticated().subscribe(isAuthenticated => {
				console.log('CHECKING AUTHENTICATION');
				if (isAuthenticated) {
					console.log('Authenticated!');
					resolve(true);
				} else {
					console.error('Not Authenticated!');
					resolve(false);
					this.router.navigate(['login']);
				}
				resolve(false);
			});
		});
	}
}

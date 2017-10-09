import { Component, OnInit } from '@angular/core';
import { AuthService } from './user/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'chy-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	isAuthenticated = false;

	constructor(private authService: AuthService,
				private router: Router) {
	}

	ngOnInit() {
		this.authService.authStatusChanged.subscribe(authenticated => {
			this.isAuthenticated = authenticated;
			if (authenticated) {
				this.router.navigate(['/dashboard']);
			} else {
				this.router.navigate(['/']);
			}
		});
		this.authService.initAuth();
	}
}

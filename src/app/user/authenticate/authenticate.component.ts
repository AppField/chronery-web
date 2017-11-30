import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { MdSnackBar } from '@angular/material';

@Component({
	selector: 'chy-authenticate',
	templateUrl: './authenticate.component.html',
	styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements OnInit {

	isLoading = false;

	constructor(private authService: AuthService, public snackBar: MdSnackBar) {
	}

	ngOnInit() {
		this.authService.authIsLoading.subscribe((isLoading: boolean) => this.isLoading = isLoading);


		this.authService.errorChange.subscribe(error => {
			switch (error['code']) {
				case 'UserNotConfirmedException':
					const snackbar = this.snackBar.open('Please confirm your account', 'Resend E-Mail', {
						duration: 10000
					});
					snackbar.onAction().subscribe(() => {
						alert('send email');
					});
					break;
				case 'NotAuthorizedException':
					this.snackBar.open('E-Mail or password wrong.', null, {
						duration: 10000
					});
					break;
				case 'UsernameExistsException':
					this.snackBar.open('E-Mail is already taken.', null, {
						duration: 10000
					});
					break;
			}
		});
	}

}

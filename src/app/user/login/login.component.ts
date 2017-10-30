import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'chy-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	email: AbstractControl;


	constructor(public fb: FormBuilder, private authService: AuthService, private router: Router) {
	}

	ngOnInit() {
		// Setup form
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]]
		});

		this.email = this.loginForm.controls['email'];


		if (this.authService.isAuthenticated()) {
			this.router.navigate(['dashboard']);
		}


		this.authService.authStatusChanged
			.subscribe(authenticated => {
				if (authenticated) {
					this.router.navigate(['dashboard']);
				}
			});
	}

	login(): void {
		if (this.loginForm.valid) {
			const email = this.loginForm.controls['email'].value;
			const password = this.loginForm.controls['password'].value;
			this.authService.signIn(email, password);
		}
	}

	get emailErrorMessage(): string {
		return this.email.hasError('required') ? 'Please enter your E-Mail Address' :
			this.email.hasError('email') ? 'Not a valid email' : '';
	}

}

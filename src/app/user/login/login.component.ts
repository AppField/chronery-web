import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
	selector: 'chy-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
	loginForm: FormGroup;
	email: AbstractControl;

	constructor(public fb: FormBuilder, private authService: AuthService) {
	}

	ngOnInit() {
		// Setup form
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]]
		});

		this.email = this.loginForm.controls['email'];
	}

	login(): void {
		if (this.loginForm.valid) {
			alert('LOGING IN');
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

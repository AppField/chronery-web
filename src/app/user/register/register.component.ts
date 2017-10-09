import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
	selector: 'chy-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup;
	email: AbstractControl;

	constructor(public fb: FormBuilder, private authService: AuthService) {
	}

	ngOnInit() {
		// Setup Form
		this.registerForm = this.fb.group({
			given_name: ['', [Validators.required]],
			family_name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]]
		});

		this.email = this.registerForm.controls['email'];
	}

	register(): void {
		if (this.registerForm.valid) {
			const givenName = this.registerForm.controls['given_name'].value;
			const family_name = this.registerForm.controls['family_name'].value;
			const email = this.registerForm.controls['email'].value;
			const password = this.registerForm.controls['password'].value;

			this.authService.signUp(givenName, family_name, email, password);
		}
	}

	get emailErrorMessage(): string {
		return this.email.hasError('required') ? 'Please enter your E-Mail Address' :
			this.email.hasError('email') ? 'Not a valid email' : '';
	}
}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
	selector: 'chy-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.scss']
})


export class RegisterComponent implements OnInit {
	registerForm: FormGroup;
	email: AbstractControl;
	didFail = false;
	signupSent = false;

	static matchPasswordValidator(control: FormControl): any {
		if (control.parent) {
			const password = control.parent.controls['password'].value;
			const repeatPassword = control.value;
			return password === repeatPassword ? true : {mismatch: true};
		}
		return null;
	}

	constructor(public fb: FormBuilder, private authService: AuthService) {
	}

	ngOnInit() {
		this.authService.authDidFail.subscribe((didFail: boolean) => this.didFail = didFail);


		// Setup Form
		this.registerForm = this.fb.group({
			given_name: ['', [Validators.required]],
			family_name: ['', [Validators.required]],
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]],
			repeatPassword: ['', [Validators.required, RegisterComponent.matchPasswordValidator]]
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
			this.signupSent = true;
		}
	}

	get emailErrorMessage(): string {
		return this.email.hasError('required') ? 'Please enter your E-Mail Address' :
			this.email.hasError('email') ? 'Not a valid email' : '';
	}

	get isPasswordMismatch(): boolean {
		return this.registerForm.controls['repeatPassword'].hasError('mismatch');
	}

	get didRegisterFail(): boolean {
		return this.didFail && this.signupSent;
	}
}

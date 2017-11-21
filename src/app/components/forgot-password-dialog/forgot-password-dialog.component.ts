import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

@Component({
	selector: 'chy-forgot-password-dialog',
	templateUrl: './forgot-password-dialog.component.html',
	styleUrls: ['./forgot-password-dialog.component.css']
})
export class ForgotPasswordDialogComponent implements OnInit {
	forgotPasswordForm: FormGroup;

	static matchPasswordValidator(control: FormControl): any {
		if (control.parent) {
			const password = control.parent.controls['password'].value;
			const repeatPassword = control.value;
			return password === repeatPassword ? true : {mismatch: true};
		}
		return null;
	}

	// order matters
	constructor(public fb: FormBuilder,
				public dialogRef: MdDialogRef<ForgotPasswordDialogComponent>) {
	}

	ngOnInit() {
		this.forgotPasswordForm = this.fb.group({
			code: ['', [Validators.required]],
			password: ['', [Validators.required]],
			repeatPassword: ['', [Validators.required, ForgotPasswordDialogComponent.matchPasswordValidator]]
		});
	}

	resetPassword() {
		const code = this.forgotPasswordForm.controls['code'].value;
		const password = this.forgotPasswordForm.controls['password'].value;

		this.dialogRef.close({
			code,
			password
		});
	}

	get isPasswordMismatch(): boolean {
		return this.forgotPasswordForm.controls['repeatPassword'].hasError('mismatch');
	}

}

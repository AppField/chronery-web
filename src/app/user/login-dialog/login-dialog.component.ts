import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdDialogRef } from '@angular/material';

@Component({
	selector: 'chy-login-dialog',
	templateUrl: './login-dialog.component.html',
	styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent implements OnInit {
	loginForm: FormGroup;

	// order matters
	constructor(public fb: FormBuilder,
				public dialogRef: MdDialogRef<LoginDialogComponent>) {
	}

	ngOnInit() {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required]],
			password: ['', [Validators.required]]
		});
	}

}

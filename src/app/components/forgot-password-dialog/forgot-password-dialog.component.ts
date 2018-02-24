import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { CustomValidators } from '../../utils/custom-validators';

@Component({
  selector: 'chy-forgot-password-dialog',
  templateUrl: './forgot-password-dialog.component.html',
  styleUrls: ['./forgot-password-dialog.component.css']
})
export class ForgotPasswordDialogComponent implements OnInit {
  forgotPasswordForm: FormGroup;

  // order matters
  constructor(public fb: FormBuilder,
              public dialogRef: MatDialogRef<ForgotPasswordDialogComponent>) {
  }

  get isPasswordMismatch(): boolean {
    return this.forgotPasswordForm.controls['repeatPassword'].hasError('mismatch');
  }

  get getPasswordErrorState(): number {
    return CustomValidators.getPasswordErrorState(this.forgotPasswordForm.controls['password']);
  }

  static matchPasswordValidator(control: FormControl): any {
    if (control.parent) {
      const password = control.parent.controls['password'].value;
      const repeatPassword = control.value;
      return password === repeatPassword ? true : { mismatch: true };
    }
    return null;
  }

  ngOnInit() {
    this.forgotPasswordForm = this.fb.group({
      code: ['', [Validators.required]],
      password: ['', [Validators.required, CustomValidators.hasLengthEight, CustomValidators.containsNumbersValidator, CustomValidators.containsUpperValidator, CustomValidators.containsLowerValidator]],
      repeatPassword: ['', [Validators.required, CustomValidators.matchPasswordValidator]]
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

}

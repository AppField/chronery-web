import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { CustomValidators } from '../../utils/custom-validators';

@Component({
  selector: 'chy-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})


export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  email: AbstractControl;
  privacyAccepted: AbstractControl;
  signupSent = false;
  justRegisted = false;

  constructor(public fb: FormBuilder, private authService: AuthService) {
  }

  get emailErrorMessage(): string {
    return this.email.hasError('required') ? 'Please enter your E-Mail Address' :
      this.email.hasError('email') ? 'Not a valid email' : '';
  }

  get isPasswordMismatch(): boolean {
    return this.registerForm.controls['repeatPassword'].hasError('mismatch');
  }

  get getPasswordErrorState(): number {
    return CustomValidators.getPasswordErrorState(this.registerForm.controls['password']);
  }

  get isPrivacyAccepted(): boolean {
    return this.privacyAccepted.value || !this.privacyAccepted.touched;
  }

  ngOnInit() {
    // Setup Form
    this.registerForm = this.fb.group({
      given_name: [''],
      family_name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.hasLengthEight, CustomValidators.containsNumbersValidator, CustomValidators.containsUpperValidator, CustomValidators.containsLowerValidator]],
      repeatPassword: ['', [Validators.required, CustomValidators.matchPasswordValidator]],
      data_prtctn_accepted: ['', [Validators.required]]
    });

    this.email = this.registerForm.controls['email'];
    this.privacyAccepted = this.registerForm.controls['data_prtctn_accepted'];
  }

  register(): void {
    console.log(this.registerForm.controls['data_prtctn_accepted'].value);
    this.privacyAccepted.markAsTouched();

    if (this.registerForm.valid) {
      const givenName = this.registerForm.controls['given_name'].value;
      const family_name = this.registerForm.controls['family_name'].value;
      const email = this.registerForm.controls['email'].value.toLowerCase();
      const password = this.registerForm.controls['password'].value;
      const data_prtctn_accepted = this.registerForm.controls['data_prtctn_accepted'].value;

      this.authService.signUp(givenName, family_name, email, password, data_prtctn_accepted)
        .subscribe(
          (result) => {
            this.justRegisted = true;
          },
          error => this.authService.handleError(error));

      this.signupSent = true;
    }
  }
}

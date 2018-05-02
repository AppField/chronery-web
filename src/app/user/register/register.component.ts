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

  ngOnInit() {
    // Setup Form
    this.registerForm = this.fb.group({
      given_name: [''],
      family_name: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, CustomValidators.hasLengthEight, CustomValidators.containsNumbersValidator, CustomValidators.containsUpperValidator, CustomValidators.containsLowerValidator]],
      repeatPassword: ['', [Validators.required, CustomValidators.matchPasswordValidator]]
    });

    this.email = this.registerForm.controls['email'];
  }

  register(): void {
    if (this.registerForm.valid) {
      const givenName = this.registerForm.controls['given_name'].value;
      const family_name = this.registerForm.controls['family_name'].value;
      const email = this.registerForm.controls['email'].value.toLowerCase();
      const password = this.registerForm.controls['password'].value;

      this.authService.signUp(givenName, family_name, email, password)
        .subscribe(
          (result) => {
            this.justRegisted = true;
          },
          error => this.authService.handleError(error));

      this.signupSent = true;
    }
  }
}

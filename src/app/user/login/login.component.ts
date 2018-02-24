import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'chy-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  loginForm: FormGroup;
  email: AbstractControl;
  didFail = false;
  loginSent = false;

  constructor(public fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.authService.authDidFail
      .takeUntil(this.destroy$)
      .subscribe(
        (didFail: boolean) => this.didFail = didFail
      );

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
      .takeUntil(this.destroy$)
      .subscribe(authenticated => {
        if (authenticated) {
          this.router.navigate(['dashboard']);
        }
      });
  }

  login(): void {
    if (this.loginForm.valid) {
      const email = this.loginForm.controls['email'].value.toLowerCase();
      const password = this.loginForm.controls['password'].value;

      this.didFail = false;
      this.authService.signIn(email, password);
      this.loginSent = true;
    }
  }

  forgotPassword(): void {
    const email = this.loginForm.controls['email'].value;
    this.authService.forgotPassword(email)
      .then((result) => {
        if (result) {
          this.loginForm.reset();
        }
      })
      .catch(err => {
      });
  }

  get emailErrorMessage(): string {
    return this.email.hasError('required') ? 'Please enter your E-Mail Address' :
      this.email.hasError('email') ? 'Not a valid email' : '';
  }

  get didLoginFail(): boolean {
    return this.didFail && this.loginSent;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

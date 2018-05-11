import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'chy-authenticate',
  templateUrl: './authenticate.component.html',
  styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements OnInit, OnDestroy {
  isLoading = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.authIsLoading
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => this.isLoading = isLoading);


    // this.authService.errorChange
    //   .takeUntil(this.destroy$)
    //   .subscribe(error => {
    //     switch (error['code']) {
    //       case 'UserNotConfirmedException':
    //         const snackbar = this.snackBar.open('Please confirm your account', 'Resend E-Mail', {
    //           duration: 10000
    //         });
    //         snackbar.onAction().subscribe(() => {
    //           alert('send email');
    //         });
    //         break;
    //       case 'NotAuthorizedException':
    //         this.snackBar.open('E-Mail or password wrong.', null, {
    //           duration: 10000
    //         });
    //         break;
    //       case 'UsernameExistsException':
    //         this.snackBar.open('E-Mail is already taken.', null, {
    //           duration: 10000
    //         });
    //         break;
    //     }
    //   });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

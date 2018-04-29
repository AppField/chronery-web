import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AmplifyService } from 'aws-amplify-angular';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ForgotPasswordDialogComponent } from '../components/forgot-password-dialog/forgot-password-dialog.component';
import { TranslatePipe } from '../pipes/translate/translate.pipe';

@Injectable()
export class AuthService implements OnInit {
  auth: any;
  user: any;

  authIsLoading = new BehaviorSubject<boolean>(false);
  loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router,
              public dialog: MatDialog,
              public amplify: AmplifyService,
              public snackBar: MatSnackBar,
              private translate: TranslatePipe) {
  }

  ngOnInit() {
    this.amplify.auth().authStateChange$
      .subscribe(authState => {
        this.loggedIn.next(authState.state === 'signedIn');
        if (!authState.user) {
          console.log('no user!');
          this.user = null;
        } else {
          console.log('user', authState.user);
          this.user = authState.user;
        }
      });
  }

  signUp(given_name: string, family_name: string, email: string, password: string): Observable<any> {
    this.authIsLoading.next(true);
    return fromPromise(this.amplify.auth().signUp({
      username: email,
      password,
      attributes: {
        email,
        given_name,
        family_name,
        updated_at: Date.now().toString(),
        'custom:created_at': Date.now().toString()
      }
    }))
      .pipe(
        finalize(() => this.authIsLoading.next(false))
      );
  }


  signIn(email: string, password: string): Observable<any> {
    this.authIsLoading.next(true);
    return fromPromise(this.amplify.auth().signIn(email, password))
      .pipe(
        tap(() => {
          this.loggedIn.next(true);
        }),
        finalize(() => this.authIsLoading.next(false))
      );
  }

  // getAuthenticatedUser() {
  //   this.auth().sign
  // }

  logout() {
    fromPromise(this.amplify.auth().signOut())
      .subscribe(
        result => {
          this.loggedIn.next(true);
          this.router.navigate(['/login']);
        },
        error => console.log(error));
  }

  isAuthenticated(): Observable<boolean> {
    return fromPromise(this.amplify.auth().currentAuthenticatedUser())
      .pipe(
        map(result => {
          this.loggedIn.next(true);
          return true;
        }),
        catchError(error => {
          this.loggedIn.next(false);
          return of(false);
        })
      );
  }

  deleteAccount(): void {
    this.amplify.auth().currentAuthenticatedUser()
      .then(user => {
        user.deleteUser((error, response) => {
          if (error) {
            return;
          }
          window.location.reload();
        });
      });
  }

  // forgotPassword(email: string): Promise<boolean> {
  forgotPassword(email: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.amplify.auth().forgotPassword(email)
        .then(result => {
          const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, { disableClose: true });

          dialogRef.afterClosed().subscribe((resetData) => {
            if (resetData) {
              this.amplify.auth().forgotPasswordSubmit(email, resetData.code, resetData.password)
                .then(response => resolve(true))
                .catch(error => reject(error));
            } else {
              resolve(false);
            }
          });
        })
        .catch(error => this.handleError(error));
    });
  }

  getSession(): Observable<any> {
    return fromPromise(this.amplify.auth().currentSession());
  }

  getUserAttributes(): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      this.amplify.auth().currentAuthenticatedUser()
        .then(user => {
          this.user = user;
          this.amplify.auth().userAttributes(user)
            .then(result => {
              const attributes = [];
              result.map(attribute => {
                attributes[attribute.getName()] = attribute.getValue();
              });
              resolve(attributes);
            })
            .catch(error => reject(error));
        });
    });
  }

  updateAccount(given_name: string, family_name: string): void {

    this.amplify.auth().currentAuthenticatedUser().then(user => {
      this.amplify.auth().updateUserAttributes(user, {
        given_name,
        family_name
      })
        .then(result => {
          this.snackBar.open(this.translate.transform('UserSuccessfullyUpdated'));
        })
        .catch(error => {
          this.handleError(error);
        });
    });
  }

  resendEmail(): void {

  }

  handleError(error) {
    switch (error['code']) {
      case 'UserNotConfirmedException':
        const snackbar = this.snackBar.open(this.translate.transform('UserNotConfirmedException'),
          this.translate.transform('UserNotConfirmedExceptionAction'), {
            duration: 10000
          });
        snackbar.onAction().subscribe(() => {
          alert('send email');
        });
        break;
      case 'NotAuthorizedException':
        this.snackBar.open(this.translate.transform('NotAuthorizedException'), null, {
          duration: 10000
        });
        break;
      case 'UsernameExistsException':
        this.snackBar.open(this.translate.transform('UsernameExistsException'), null, {
          duration: 10000
        });
        break;
      case 'UserNotFoundException':
        this.snackBar.open(this.translate.transform('UserNotFoundException'), null, {
          duration: 10000
        });
        break;
    }
  }

}

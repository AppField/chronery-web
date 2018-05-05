import { Injectable, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ForgotPasswordDialogComponent } from '../components/forgot-password-dialog/forgot-password-dialog.component';
import { TranslatePipe } from '../pipes/translate/translate.pipe';
import { Auth } from 'aws-amplify';

@Injectable()
export class AuthService implements OnInit {
  auth: any;
  user: any;

  authIsLoading = new BehaviorSubject<boolean>(false);
  loggedIn = new BehaviorSubject<boolean>(false);

  constructor(private router: Router,
              public dialog: MatDialog,
              public snackBar: MatSnackBar,
              private translate: TranslatePipe) {
  }

  ngOnInit() {


  }

  signUp(given_name: string, family_name: string, email: string, password: string): Observable<any> {
    this.authIsLoading.next(true);
    return fromPromise(Auth.signUp({
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
    return fromPromise(Auth.signIn(email, password))
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
    fromPromise(Auth.signOut())
      .subscribe(
        result => {
          this.loggedIn.next(true);
          this.router.navigate(['/login']);
        },
        error => console.log(error));
  }

  isAuthenticated(): Observable<boolean> {
    return fromPromise(Auth.currentAuthenticatedUser())
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
    Auth.currentAuthenticatedUser()
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
      Auth.forgotPassword(email)
        .then(result => {
          const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, { disableClose: true });

          dialogRef.afterClosed().subscribe((resetData) => {
            if (resetData) {
              Auth.forgotPasswordSubmit(email, resetData.code, resetData.password)
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
    return fromPromise(Auth.currentSession());
  }

  getUserAttributes(): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      Auth.currentAuthenticatedUser()
        .then(user => {
          this.user = user;
          Auth.userAttributes(user)
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

    Auth.currentAuthenticatedUser().then(user => {
      Auth.updateUserAttributes(user, {
        given_name,
        family_name,
        updated_at: Date.now().toString()
      })
        .then(result => {
          this.snackBar.open(this.translate.transform('UserSuccessfullyUpdated'));
        })
        .catch(error => {
          this.handleError(error);
        });
    });
  }

  resendEmail(email: string): void {
    Auth.resendSignUp(email)
      .then(data => console.log(data))
      .catch(error => console.log(error));
  }

  handleError(error) {
    switch (error['code']) {
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

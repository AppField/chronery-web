import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
	AuthenticationDetails,
	CognitoUser,
	CognitoUserAttribute,
	CognitoUserPool,
	CognitoUserSession
} from 'amazon-cognito-identity-js';

import { User } from '../models/user';
import { MatDialog } from '@angular/material';
import { ForgotPasswordDialogComponent } from '../components/forgot-password-dialog/forgot-password-dialog.component';

const POOL_DATA = {
	UserPoolId: 'eu-central-1_kdg6hHeXX',
	ClientId: '7gddc195e3gak097o6veegd27v'
};
const userPool = new CognitoUserPool(POOL_DATA);

@Injectable()
export class AuthService {
	authIsLoading = new BehaviorSubject<boolean>(false);
	authDidFail = new BehaviorSubject<boolean>(false);
	errorChange = new BehaviorSubject<{}>({});
	authStatusChanged = new Subject<boolean>();
	registeredUser: CognitoUser;

	constructor(private router: Router, public dialog: MatDialog) {
	}

	signUp(givenName: string, familyName: string, email: string, password: string): Promise<{}> {
		return new Promise<{}>((resolve, reject) => {

			this.authIsLoading.next(true);
			const user: User = {
				given_name: givenName,
				family_name: familyName,
				email: email,
				password: password,
				createdAt: Date.now().toString(),
				updated_at: Date.now().toString()
			};

			const attrList: CognitoUserAttribute[] = [];
			const emailAttribute = {
				Name: 'email',
				Value: user.email
			};

			const givenNameAttribute = {
				Name: 'given_name',
				Value: user.given_name
			};

			const familyNameAttribute = {
				Name: 'family_name',
				Value: user.family_name
			};

			const createdAtAttribute = {
				Name: 'custom:createdAt',
				Value: user.createdAt
			};

			const updatedAtAttribute = {
				Name: 'updated_at',
				Value: user.updated_at
			};

			attrList.push(new CognitoUserAttribute(givenNameAttribute));
			attrList.push(new CognitoUserAttribute(familyNameAttribute));
			attrList.push(new CognitoUserAttribute(emailAttribute));
			attrList.push(new CognitoUserAttribute(createdAtAttribute));
			attrList.push(new CognitoUserAttribute(updatedAtAttribute));

			userPool.signUp(user.email, user.password, attrList, null, (err, result) => {
				if (err) {
					console.log(err);
					this.authDidFail.next(true);
					this.authIsLoading.next(false);
					this.errorChange.next(err);
					reject(err);
					return;
				}
				this.authDidFail.next(false);
				this.authIsLoading.next(false);
				resolve(result);
				this.registeredUser = result.user;
			});

		});
	}


	signIn(email: string, password: string): void {
		this.authIsLoading.next(true);
		const authData = {
			Username: email,
			Password: password
		};

		const authDetails = new AuthenticationDetails(authData);
		const userData = {
			Username: email,
			Pool: userPool
		};
		const cognitoUser = new CognitoUser(userData);
		const self = this;
		cognitoUser.authenticateUser(authDetails, {
			onSuccess(result: CognitoUserSession) {
				self.authStatusChanged.next(true);
				self.authDidFail.next(false);
				self.authIsLoading.next(false);
				console.log(result);
			},
			onFailure(err) {
				self.authDidFail.next(true);
				self.authIsLoading.next(false);
				self.errorChange.next(err);
				console.log(err);
			}
		});
		this.authStatusChanged.next(true);
		return;
	}

	getAuthenticatedUser() {
		return userPool.getCurrentUser();
	}

	logout() {
		this.getAuthenticatedUser().signOut();
		this.authStatusChanged.next(false);
		this.router.navigate(['/login']);
	}

	isAuthenticated(): Observable<boolean> {
		const user = this.getAuthenticatedUser();
		const obs = Observable.create((observer) => {
			if (!user) {
				observer.next(false);
			} else {
				user.getSession((err, session) => {
					if (err) {
						observer.next(false);
					} else {
						if (session.isValid()) {
							observer.next(true);
						} else {
							observer.next(false);
						}
					}
				});
			}
			observer.complete();
		});
		return obs;
	}

	deleteAccount(): void {

		const cognitoUser = this.getAuthenticatedUser();
		if (cognitoUser) {
			cognitoUser.getSession((err, result) => {
				if (err) {
					this.authDidFail.next(true);
					console.log(err);
					return;
				}

				cognitoUser.deleteUser((error, response) => {
					if (error) {
						this.authDidFail.next(true);
						console.log(err);
						return;
					}
					window.location.reload();
				});

			});
		}
		console.log(cognitoUser);
	}

	forgotPassword(email: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const userData = {
				Username: email,
				Pool: userPool
			};
			const cognitoUser = new CognitoUser(userData);

			cognitoUser.forgotPassword({
				onSuccess: (data) => {
					console.log('CodeDeliveryData from forgotPassword: ' + data);
				},
				onFailure: (err) => {
					console.log(err);
				},
				inputVerificationCode: (data) => {
					console.log('Code sent to: ' + data);

					const dialogRef = this.dialog.open(ForgotPasswordDialogComponent, {disableClose: true});

					dialogRef.afterClosed().subscribe((resetData) => {
						if (resetData) {
							cognitoUser.confirmPassword(resetData.code, resetData.password, {
								onSuccess() {
									console.log('Password confirmed!');
									resolve(true);
								},
								onFailure(err) {
									console.log('Password not confirmed!');
									reject();
								}
							});
						} else {
							resolve(false);
						}
					});
				}
			});
		});
	}

	getUserAttributes(): Promise<User> {
		return new Promise<User>((resolve, reject) => {
			const cognitoUser = this.getAuthenticatedUser();
			if (cognitoUser) {
				cognitoUser.getSession((err, result) => {
					if (err) {
						this.authDidFail.next(true);
						console.log(err);
						return;
					}

					cognitoUser.getUserAttributes((error, response: CognitoUserAttribute[]) => {
						if (error) {
							this.authDidFail.next(true);
							console.log(err);
							reject(error);
							return;
						}
						const attributes = new User();
						response.map((attribute: CognitoUserAttribute) => {
							attributes[attribute.getName()] = attribute.getValue();
						});
						console.log(attributes);
						resolve(attributes ? attributes : null);
					});
				});
			}


		});
	}

	initAuth() {
		this.isAuthenticated().subscribe(
			(auth) => this.authStatusChanged.next(auth)
		);
	}
}

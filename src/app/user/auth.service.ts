import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';

import { User } from '../models/user';

const POOL_DATA = {
	UserPoolId: 'eu-central-1_kdg6hHeXX',
	ClientId: '7gddc195e3gak097o6veegd27v'
};
const userPool = new CognitoUserPool(POOL_DATA);

@Injectable()
export class AuthService {
	authIsLoading = new BehaviorSubject<boolean>(false);
	authDidFail = new BehaviorSubject<boolean>(false);
	authStatusChanged = new Subject<boolean>();
	registeredUser: CognitoUser;

	constructor(private router: Router) {
	}

	signUp(givenName: string, familyName: string, email: string, password: string): void {
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
				return;
			}
			this.authDidFail.next(false);
			this.authIsLoading.next(false);
			this.registeredUser = result.user;
		});

		return;
	}

	confirmUser(email: string, code: string) {
		this.authIsLoading.next(true);
		const userData = {
			Email: email,
		};
	}

	signIn(email: string, password: string): void {
		this.authIsLoading.next(true);
		const authData = {
			Email: email,
			Password: password
		};
		this.authStatusChanged.next(true);
		return;
	}

	getAuthenticatedUser() {
	}

	logout() {
		this.authStatusChanged.next(false);
	}

	isAuthenticated(): Observable<boolean> {
		const user = this.getAuthenticatedUser();
		const obs = Observable.create((observer) => {
			if (!user) {
				observer.next(false);
			} else {
				observer.next(false);
			}
			observer.complete();
		});
		return obs;
	}

	initAuth() {
		this.isAuthenticated().subscribe(
			(auth) => this.authStatusChanged.next(auth)
		);
	}
}

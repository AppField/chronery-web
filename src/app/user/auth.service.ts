import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';

import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { User } from '../models/user';

@Injectable()
export class AuthService {
	authIsLoading = new BehaviorSubject<boolean>(false);
	authDidFail = new BehaviorSubject<boolean>(false);
	authStatusChanged = new Subject<boolean>();

	constructor(private router: Router) {
	}

	signUp(givenName: string, familyName: string, email: string, password: string): void {
		this.authIsLoading.next(true);
		const user: User = {
			given_name: givenName,
			family_name: familyName,
			email: email,
			password: password,
		};
		const emailAttribute = {
			Name: 'email',
			Value: user.email
		};
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

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
	selector: 'chy-authenticate',
	templateUrl: './authenticate.component.html',
	styleUrls: ['./authenticate.component.scss']
})
export class AuthenticateComponent implements OnInit {

	didFail = false;
	isLoading = false;

	constructor(private authService: AuthService) {
	}

	ngOnInit() {
		// Setup Authentication
		this.authService.authIsLoading.subscribe((isLoading: boolean) => this.isLoading = isLoading);

		this.authService.authDidFail.subscribe((didFail: boolean) => this.didFail = didFail);
	}

}

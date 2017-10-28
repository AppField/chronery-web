import { Injectable, OnInit } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Project } from '../../models/project';
import { AuthService } from '../../user/auth.service';


@Injectable()
export class ProjectsService implements OnInit {
	dataIsLoading = new BehaviorSubject<boolean>(false);
	dataLoaded: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
	dataLoadFailed = new Subject<boolean>();


	get data(): Project[] {
		if (this.dataLoaded) {
			return this.dataLoaded.value;
		}
	}

	constructor(private http: Http,
				private authService: AuthService) {

		this.onRetrieveData();
	}

	ngOnInit() {
		// this.onRetrieveData();
	}

	onStoreData(data: Project) {
		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			if (err) {
				console.log(err);
			} else {
				this.http.post('https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/projects', data, {
					headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
				})
					.subscribe(
						(result) => {

							this.dataLoadFailed.next(false);
							this.dataIsLoading.next(false);
							console.log(result);
						},
						(error) => {
							this.dataIsLoading.next(false);
							this.dataLoadFailed.next(true);
						}
					);
			}
		});
	}

	onRetrieveData() {
		this.dataLoaded.next(null);
		this.dataLoadFailed.next(false);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			const queryParam = '?accessToken=' + session.getAccessToken().getJwtToken();

			this.http.get('https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/projects/' + queryParam, {
				headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
			})
				.map(
					(response: Response) => response.json()
				)
				.subscribe((data) => {
						console.log('DATA: ', data);
						if (data) {
							this.dataLoaded.next(data);
						} else {
							this.dataLoadFailed.next(true);
						}
					},
					(error) => {
						console.log(error);
						this.dataLoadFailed.next(true);
						this.dataLoaded.next(null);
					}
				);
		});
	}

	onDeleteData() {
		this.dataLoadFailed.next(false);
		this.http.delete('https://API_ID.execute-api.REGION.amazonaws.com/dev/', {
			headers: new Headers({'Authorization': 'XXX'})
		})
			.subscribe(
				(data) => {
					console.log(data);
				},
				(error) => this.dataLoadFailed.next(true)
			);
	}
}

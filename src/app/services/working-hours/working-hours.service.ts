import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Project } from '../../models/project';
import { AuthService } from '../../user/auth.service';
import { WorkingHours } from '../../models/working-hours';


@Injectable()
export class WorkingHoursService {
	dataIsLoading = new BehaviorSubject<boolean>(false);
	dataChange: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
	dataLoadFailed = new Subject<boolean>();


	get data(): Project[] {
		if (this.dataChange.value) {
			return this.dataChange.value;
		}
	}

	constructor(private http: Http,
				private authService: AuthService) {
	}

	onStoreData(data: WorkingHours, date: String) {

		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			if (err) {
				console.log(err);
			} else {
				this.http.post(`https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/working-hours/${date}`, data, {
					headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
				})
					.subscribe(
						(result) => {
							this.dataLoadFailed.next(false);
							this.dataIsLoading.next(false);

							console.log(result);
							// const newData = this.data.slice();
							// newData.push(project);
							// this.dataChange.next(newData);
						},
						(error) => {
							console.log(error);
							this.dataIsLoading.next(false);
							this.dataLoadFailed.next(true);
						}
					);
			}
		});
	}

	onRetrieveData(date: string) {
		this.dataChange.next(null);
		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			const queryParam = '?accessToken=' + session.getAccessToken().getJwtToken();

			this.http.get(`https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/working-hours/${date}`, {
				headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
			})
				.map(
					(response: Response) => response.json()
				)
				.subscribe((data) => {
						console.log('DATA: ', data);
						if (data) {
							this.dataChange.next(data);
						} else {
							this.dataLoadFailed.next(true);
						}
						this.dataIsLoading.next(false);
					},
					(error) => {
						console.log(error);
						this.dataLoadFailed.next(true);
						this.dataIsLoading.next(false);
						this.dataChange.next(null);
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

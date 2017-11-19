import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { AuthService } from '../../user/auth.service';
import { WorkingHours } from '../../models/working-hours';


@Injectable()
export class WorkingHoursService {
	dataIsLoading = new BehaviorSubject<boolean>(false);
	dataChange: BehaviorSubject<WorkingHours[]> = new BehaviorSubject<WorkingHours[]>([]);
	dataLoadFailed = new Subject<boolean>();


	get data(): WorkingHours[] {
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
							const obj = JSON.parse(data['_body']);
							console.log(obj);
							this.dataChange.next(obj);
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

	onUpdateData(data: WorkingHours) {

	}

	onDeleteData(date: string, index: number) {
		this.dataLoadFailed.next(false);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			this.http.delete(`https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/working-hours/${date}?index=${index}`, {
				headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
			})
				.subscribe(
					(data) => {
						console.log(data);

						this.dataChange.next(data['events']);

						this.dataLoadFailed.next(false);
						this.dataIsLoading.next(false);
					},
					(error) => {
						this.dataLoadFailed.next(true)
						this.dataIsLoading.next(false);
					}
				);
		});
	}
}

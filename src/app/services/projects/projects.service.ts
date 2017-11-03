import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Project } from '../../models/project';
import { AuthService } from '../../user/auth.service';


@Injectable()
export class ProjectsService {
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

		this.onRetrieveData();
	}

	onStoreData(data: Project) {
		if (!data.id) {
			data.id = 'project' + Date.now();
		}

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

							const newData = this.data.slice();
							const obj = JSON.parse(result['_body']).Attributes;
							const project = new Project(obj.userId, obj.id, obj.number, obj.name);
							newData.push(project);
							this.dataChange.next(newData);
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

	onUpdateData(data: Project) {
		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			if (err) {
				console.log(err);
			} else {
				this.http.put('https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/projects', data, {
					headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
				})
					.subscribe(
						(result) => {
							console.log(result);
							this.dataLoadFailed.next(false);
							this.dataIsLoading.next(false);
							// clone array to prevent change detection issues
							const newData = this.data.slice(0);
							const updatedProject = JSON.parse(result['_body']).Attributes;

							const index = newData.map(project => {
								return project.id;
							}).indexOf(updatedProject.id);
							newData[index] = updatedProject;

							this.dataChange.next(newData);
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


	onRetrieveData() {
		this.dataChange.next(null);
		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);

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

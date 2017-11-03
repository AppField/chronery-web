import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Http, Headers, Response } from '@angular/http';
import { AuthService } from '../../user/auth.service';
import { Comment } from '../../models/comment';

@Injectable()
export class CommentsService {

	dataIsLoading = new BehaviorSubject<boolean>(false);
	dataChange: BehaviorSubject<Comment[]> = new BehaviorSubject<Comment[]>([]);
	dataLoadFailed = new Subject<boolean>();


	get data(): Comment[] {
		if (this.dataChange.value) {
			return this.dataChange.value;
		}
	}

	constructor(private http: Http,
				private authService: AuthService) {

		this.onRetrieveData();
	}

	onStoreData(data: Comment, callback) {
		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			if (err) {
				console.log(err);
			} else {
				this.http.post('https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/comments', data, {
					headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
				})
					.subscribe(
						(result) => {
							this.dataLoadFailed.next(false);
							this.dataIsLoading.next(false);

							console.log(result);

							const newData = this.data.slice();
							const obj = JSON.parse(result['_body']);
							const comment = new Comment(obj.userId, obj.id, obj.comment);
							newData.push(comment);
							this.dataChange.next(newData);

							callback();
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

	onUpdateData(comment: Comment) {
		const index = this.data.map((obj: Comment) => obj.id).indexOf(comment.id);

		if (this.data[index].comment === comment.comment) {
			return;
		}

		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);

		this.authService.getAuthenticatedUser().getSession((err, session) => {
			if (err) {
				console.log(err);
			} else {
				this.http.put('https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/comments', comment, {
					headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
				})
					.subscribe(
						(result) => {
							console.log(result);
							this.dataLoadFailed.next(false);
							this.dataIsLoading.next(false);
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

			this.http.get('https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/comments', {
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

	onDeleteData(comment: Comment) {
		this.dataLoadFailed.next(false);
		this.dataIsLoading.next(true);
		this.authService.getAuthenticatedUser().getSession((err, session) => {
			this.http.delete('https://qa1nu08638.execute-api.eu-central-1.amazonaws.com/dev/comments/' + comment.id, {
				headers: new Headers({'Authorization': session.getIdToken().getJwtToken()})
			})
				.subscribe(
					(data) => {
						console.log(data);

						const newData = this.data.slice();
						const obj = JSON.parse(data['_body']).Attributes;
						const deletedId = obj.id;
						const index = newData.map((com: Comment) => com.id).indexOf(deletedId);
						newData.splice(index, 1);
						this.dataChange.next(newData);

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

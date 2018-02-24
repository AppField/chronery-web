import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Comment } from '../../models/comment';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

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

  constructor(private http: HttpClient) {

    this.onRetrieveData();
  }

  onStoreData(data: Comment, callback) {
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);

    this.http.post(environment.apiComments, data)
      .subscribe(
        (result: Comment) => {
          this.dataLoadFailed.next(false);
          this.dataIsLoading.next(false);
          console.log('COMMENTS', result);
          const newData = this.data.slice();
          newData.push(result);
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

  onUpdateData(comment: Comment) {
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);

    this.http.post(environment.apiComments, comment)
      .subscribe(
        (data: Comment) => {
          console.log(data);

          const newData = this.data.slice();
          const idx = newData.map((com: Comment) => com.id).indexOf(data.id);
          newData[idx] = data;
          this.dataChange.next(newData);

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


  onRetrieveData() {
    this.dataChange.next(null);
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);

    this.http.get(environment.apiComments)
      .subscribe((data: Comment[]) => {
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
  }

  onDeleteData(comment: Comment) {
    this.dataLoadFailed.next(false);
    this.dataIsLoading.next(true);

    this.http.delete(`${environment.apiComments}/${comment.id}`)
      .subscribe(
        (data: Comment) => {
          console.log('DELETED COMMENT', data);

          const newData = this.data.slice();
          const index = newData.map((com: Comment) => com.id).indexOf(data.id);
          newData.splice(index, 1);
          this.dataChange.next(newData);

          this.dataLoadFailed.next(false);
          this.dataIsLoading.next(false);
        },
        (error) => {
          this.dataLoadFailed.next(true);
          this.dataIsLoading.next(false);
        }
      );
  }
}

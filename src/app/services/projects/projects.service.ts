import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Project } from '../../models/project';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable()
export class ProjectsService {
    dataIsLoading = new BehaviorSubject<boolean>(false);
    dataChange: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);
    dataLoadFailed = new Subject<boolean>();

    constructor(private http: HttpClient) {
        this.onRetrieveData(false);
    }

    get data(): Project[] {
        if (this.dataChange.value) {
            return this.dataChange.value;
        }
    }

    onStoreData(data: Project) {
        if (!data.id) {
            data.id = 'project' + Date.now();
        }

        this.dataLoadFailed.next(false);
        this.dataIsLoading.next(true);

        this.http.post(environment.apiProjects, data)
            .subscribe(
                (result: Project) => {
                    this.dataLoadFailed.next(false);
                    this.dataIsLoading.next(false);

                    const newData = this.data.slice();
                    newData.push(result);
                    this.dataChange.next(newData);
                },
                (error) => {
                    console.log(error);
                    this.dataIsLoading.next(false);
                    this.dataLoadFailed.next(true);
                }
            );
    }

    onUpdateData(data: Project) {
        this.dataLoadFailed.next(false);
        this.dataIsLoading.next(true);

        this.http.put(environment.apiProjects, data)
            .subscribe(
                (result: Project) => {
                    console.log('PROJECT', result);
                    this.dataLoadFailed.next(false);
                    this.dataIsLoading.next(false);
                    // clone array to prevent change detection issues
                    const newData = this.data.slice();

                    const index = newData.map(project => {
                        return project.id;
                    }).indexOf(result.id);
                    newData[index] = result;

                    this.dataChange.next(newData);
                },
                (error) => {
                    console.log(error);
                    this.dataIsLoading.next(false);
                    this.dataLoadFailed.next(true);
                }
            );
    }


    onRetrieveData(inactive: boolean) {
        // this.dataChange.next(null);
        this.dataLoadFailed.next(false);
        this.dataIsLoading.next(true);

        this.http.get(environment.apiProjects + `?inactive=${inactive}`)
            .subscribe((data: Project[]) => {
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

    onDeleteData() {
        this.dataLoadFailed.next(false);
        this.http.delete('https://API_ID.execute-api.REGION.amazonaws.com/dev/', {
            // headers: new HttpHeaders().set('Authorization', session.getIdToken().getJwtToken())
        })
            .subscribe(
                (data) => {
                    console.log(data);
                },
                (error) => this.dataLoadFailed.next(true)
            );
    }
}

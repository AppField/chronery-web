import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../models/project';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import { MdDialog } from '@angular/material';
import { ProjectDialogComponent } from '../../components/project-modal/project-dialog.component';
import { ObservableMedia } from '@angular/flex-layout';
import { ProjectsService } from '../../services/projects/projects.service';
import { ProjectsDbService } from '../../services/projects-db/projects-db.service';

@Component({
	selector: 'chy-projects',
	templateUrl: './projects.component.html',
	styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
	displayedColumns = ['projectNumber', 'projectName', 'edit'];
	dataSource: ProjectSource | null;

	@ViewChild('filter') filter: ElementRef;

	constructor(public dialog: MdDialog,
				private projectsService: ProjectsService,
				private media: ObservableMedia,
				private detector: ChangeDetectorRef) {
	}

	ngOnInit() {
		this.dataSource = new ProjectSource(this.projectsService);

		Observable.fromEvent(this.filter.nativeElement, 'keyup')
			.debounceTime(150)
			.distinctUntilChanged()
			.subscribe(() => {
				if (!this.dataSource) {
					return;
				}
				this.dataSource.filter = this.filter.nativeElement.value;
			});


		this.projectsService.dataLoaded.subscribe(data => {
			console.log('Data updated!', data);
			this.detector.detectChanges();
		})
	}

	trackByFn(index, item): string {
		return item._id;
	}

	editProject(project: Project): void {
		this.openProjectDialog(project);
	}


	editMobileProject(project: Project): void {
		if (!this.media.isActive('gt-sm')) {
			this.openProjectDialog(project);
		}
	}

	openProjectDialog(project: Project = new Project()): void {
		const dialogRef = this.dialog.open(ProjectDialogComponent, {
			data: project
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				if (result.userId) {
					// TODO: Table doesn't get updated. Fix this.
					this.projectsService.onUpdateData(result);
				} else {
					this.projectsService.onStoreData(result);
				}
			}
		});
	}
}

export class ProjectSource extends DataSource<any> {
	private _filterChange = new BehaviorSubject('');

	get filter(): string {
		return this._filterChange.value;
	}

	set filter(filter: string) {
		this._filterChange.next(filter);
	}

	constructor(private projectsService: ProjectsService) {
		super();
	}

	/** Connect function called by the table to retrieve one stream containing the data to render. */
	connect(): Observable<Project[]> {
		const displayDataChanges = [
			this.projectsService.dataLoaded,
			this._filterChange
		];

		return Observable.merge(...displayDataChanges).map(() => {
			if (this.projectsService.data) {
				return this.projectsService.data.slice().filter((item: Project) => {
					const searchStr = (item.number + item.name).toLowerCase();
					return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
				});
			} else return [];

		});
	}

	disconnect() {
	}
}

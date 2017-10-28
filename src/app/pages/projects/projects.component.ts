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
				private projectsDB: ProjectsDbService,
				private media: ObservableMedia) {
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
				this.projectsService.onStoreData(result);
				// if (result.hasOwnProperty('_id')) {
				// 	this.projectsDB.updateProject(result);
				// } else {
				// 	this.projectsDB.createProject(result);
				// 	// TODO: Remove workaraound which makes shure that the newly created project is correctly shown.
				// 	setTimeout(() => {
				// 		this.detector.detectChanges();
				// 	}, 100)
				// }
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

import {AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Project} from '../../models/project';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/fromEvent';
import {MdDialog} from '@angular/material';
import {ProjectDialogComponent} from '../../components/project-modal/project-dialog.component';
import {ProjectsDbService} from '../../services/projects-db/projects-db.service';

@Component({
	selector: 'wtc-projects',
	templateUrl: './projects.component.html',
	styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit {
	displayedColumns = ['number', 'name', 'edit'];
	dataSource: ProjectSource | null;

	@ViewChild('filter') filter: ElementRef;

	constructor(public dialog: MdDialog, private detector: ChangeDetectorRef, public projectsDB: ProjectsDbService) {
	}

	ngOnInit() {
		this.dataSource = new ProjectSource(this.projectsDB);

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

	ngAfterViewInit() {
		// TODO: Remove this as it is a workaround to make the table visible when the page got reloaded
		this.detector.detectChanges();
	}

	openProjectDialog(project: Project = new Project()): void {
		console.log(project);
		const dialogRef = this.dialog.open(ProjectDialogComponent, {
			data: project
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				if (result.hasOwnProperty('_id')) {
					this.projectsDB.updateProject(result);
				} else {
					this.projectsDB.createProject(result);
				}
			}
		});
	}
}

export class ProjectSource extends DataSource<any> {
	_filterChange = new BehaviorSubject('');

	get filter(): string {
		return this._filterChange.value;
	}

	set filter(filter: string) {
		this._filterChange.next(filter);
	}

	constructor(private projectsDB: ProjectsDbService) {
		super();
	}

	/** Connect function called by the table to retrieve one stream containing the data to render. */
	connect(): Observable<Project[]> {
		const displayDataChanges = [
			this.projectsDB.dataChange,
			this._filterChange
		];

		return Observable.merge(...displayDataChanges).map(() => {
			return this.projectsDB.dataChange.getValue().slice().filter((item: Project) => {
				const searchStr = (item.number + item.name).toLowerCase();
				return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
			});
		});
	}

	disconnect() {
	}
}

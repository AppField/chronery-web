import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { MatCheckbox, MatDialog } from '@angular/material';
import { ProjectDialogComponent } from '../../components/project-modal/project-dialog.component';
import { ObservableMedia } from '@angular/flex-layout';
import { ProjectsService } from '../../services/projects/projects.service';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
	selector: 'chy-projects',
	templateUrl: './projects.component.html',
	styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, OnDestroy {
	private destroy$: Subject<boolean> = new Subject<boolean>();

	displayedColumns = ['projectNumber', 'projectName', 'inactive', 'edit'];
	dataSource: ProjectSource | null;
	isLoading = false;

	@ViewChild('filter') filter: ElementRef;
	@ViewChild('inactive') inactive: ElementRef;

	constructor(public dialog: MatDialog,
				private projectsService: ProjectsService,
				private media: ObservableMedia) {
	}

	ngOnInit() {
		this.projectsService.dataIsLoading
			.takeUntil(this.destroy$)
			.subscribe((isLoading: boolean) => this.isLoading = isLoading);

		this.dataSource = new ProjectSource(this.projectsService);

		Observable.fromEvent(this.filter.nativeElement, 'keyup')
			.takeUntil(this.destroy$)
			.debounceTime(150)
			.distinctUntilChanged()
			.subscribe(() => {
				if (!this.dataSource) {
					return;
				}
				this.dataSource.filter = this.filter.nativeElement.value;
			});
	}

	onInactiveChange(inactive: MatCheckbox): void {
		this.projectsService.onRetrieveData(inactive.checked);
	}

	trackByFn(index, item): string {
		return item.id;
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
		dialogRef.afterClosed()
			.takeUntil(this.destroy$)
			.subscribe(result => {
				if (result) {
					if (result.userId) {
						this.projectsService.onUpdateData(result);
					} else {
						this.projectsService.onStoreData(result);
					}
				}
			});
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
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
			this.projectsService.dataChange,
			this._filterChange
		];

		return Observable.merge(...displayDataChanges).map(() => {
			if (this.projectsService.data) {
				return this.projectsService.data.slice().filter((item: Project) => {
					const searchStr = (item.number + item.name).toLowerCase();
					return searchStr.indexOf(this.filter.toLowerCase()) !== -1;
				});
			} else {
				return [];
			}

		});
	}

	disconnect() {
	}
}

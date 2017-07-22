import {Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import * as moment from 'moment/moment';
import {Project} from '../../models/project';
import {Observable} from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {ProjectsDbService} from '../../services/projects-db/projects-db.service';
import {Subscription} from 'rxjs/Subscription';
import {DataSource} from '@angular/cdk';
import {WorkingHoursDbService} from '../../services/working-hours-db/working-hours-db.service';
import {Work} from '../../models/work';
import {WorkingHoursFilter} from '../../models/working-hours-filter';
import {Utility} from '../../utils/utility';

@Component({
	selector: 'wtc-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewInit, OnDestroy {
	date: Date;

	startDate: Date;
	endDate: Date;
	projects: Project[];
	filteredProjects: Observable<Project[]>;
	projectsCtrl: FormControl;
	projectsSub: Subscription;
	emptyProject = new Project();

	dataSource: ReportSource | null;
	displayedColumns = ['date', 'from', 'to', 'spent', 'projectNumber', 'projectName', 'comment'];

	constructor(private projectsDB: ProjectsDbService, private workingHoursDB: WorkingHoursDbService, private detector: ChangeDetectorRef) {

		// initialize start and end date for the date pickers
		this.startDate = moment().startOf('month').toDate();
		this.endDate = moment().endOf('month').toDate();

		this.projectsCtrl = new FormControl();

		this.projectsSub = this.projectsDB.dataChange.subscribe(data => {
			this.projects = data;
			this.filteredProjects = this.projectsCtrl.valueChanges
				.startWith(null)
				.map(project => project && typeof project === 'object' ? project.name : project)
				.map(name => name ? this.filterProjects(name) : this.projects.slice());

		});

		this.dataSource = new ReportSource(this.workingHoursDB);
		this.updateReport();
	}

	ngOnInit() {
	}

	updateReport(event?, project?: Project): void {
		setTimeout(() => {
			const filter = new WorkingHoursFilter();
			if (this.startDate) {
				filter.date = Utility.encodeDate(this.startDate);
			}
			if (this.endDate) {
				filter.toDate = Utility.encodeDate(this.endDate);
			}
			if (project) {
				if (event) {
					if (event.source.selected) {
						if (project._id) {
							filter.project = project;
						}
					} else {
						return
					}
				}
			}
			this.workingHoursDB.getWorkingHours(filter);
		});
	}

	ngAfterViewInit() {
		// TODO: Remove this as it is a workaround to make the table visible when the page got reloaded
		this.detector.detectChanges();
	}

	filterProjects(val: string) {
		return this.projects.filter(project => new RegExp(val, 'i').test(project.name));
	}

	displayFn(project: Project) {
		if (project) {
			if (project.name) {
				return project.name + '  |  ' + project.number
			} else {
				return '';
			}
		}
	}

	ngOnDestroy() {
		this.projectsSub.unsubscribe();
	}
}


export class ReportSource extends DataSource<any> {
	constructor(private workingHoursDB: WorkingHoursDbService) {
		super();
	}

	connect(): Observable<Work[]> {
		return this.workingHoursDB.dataChange;
	}

	disconnect() {
	}
}

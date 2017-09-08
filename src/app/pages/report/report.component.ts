import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as moment from 'moment/moment';
import { Project } from '../../models/project';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { ProjectsDbService } from '../../services/projects-db/projects-db.service';
import { Subscription } from 'rxjs/Subscription';
import { DataSource } from '@angular/cdk/collections';
import { WorkingHoursDbService } from '../../services/working-hours-db/working-hours-db.service';
import { Work } from '../../models/work';
import { WorkingHoursFilter } from '../../models/working-hours-filter';
import { Utility } from '../../utils/utility';
import { Angular2Csv } from 'angular2-csv';
import { ObservableMedia } from '@angular/flex-layout';

@Component({
	selector: 'chy-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {
	date: Date;

	startDate: Date;
	endDate: Date;
	projects: Project[];
	filteredProjects: Observable<Project[]>;
	projectsCtrl: FormControl;
	projectsSub: Subscription;
	emptyProject = new Project();
	totalTime: string;

	dataSource: ReportSource | null;
	displayedColumns = ['date', 'from', 'to', 'spent', 'projectNumber', 'projectName', 'comment'];

	constructor(private projectsDB: ProjectsDbService,
				private workingHoursDB: WorkingHoursDbService,
				private detector: ChangeDetectorRef,
				private media: ObservableMedia) {

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

	get isMobile(): boolean {
		return !this.media.isActive('gt-sm');
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
			this.workingHoursDB.getWorkingHours(filter).then(data => {
				const times = data.map((work: Work) => {
					return work.spent;
				});
				if (times.length) {
					this.totalTime = Utility.sumTotalTimes(times);
				} else {
					this.totalTime = null;
				}
			});
		});
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

	exportReportToCSV(): void {
		const data = this.workingHoursDB.dataChange.getValue();
		const report = new Angular2Csv(data, `Chronery Report form ${Utility.encodeDate(this.startDate)} to ${Utility.encodeDate(this.endDate)}`, {showLabels: true});
	}

	ngOnDestroy() {
		this.projectsSub.unsubscribe();
	}
}


export class ReportSource extends DataSource<any> {
	hasData = false;

	constructor(private workingHoursDB: WorkingHoursDbService) {
		super();
	}

	connect(): Observable<Work[]> {
		this.workingHoursDB.dataChange.subscribe(data => {
			this.hasData = data.length > 0;
		});
		return this.workingHoursDB.dataChange;
	}

	disconnect() {
	}
}

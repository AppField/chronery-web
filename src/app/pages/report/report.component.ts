import {Component, OnInit, OnDestroy, ChangeDetectorRef, AfterViewInit} from '@angular/core';
import * as moment from 'moment/moment';
import {Project} from '../../models/project';
import {Observable} from 'rxjs/Observable';
import {FormControl} from '@angular/forms';
import {ProjectsDbService} from '../../services/projects-db/projects-db.service';
import {Subscription} from 'rxjs/Subscription';

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

	constructor(private projectsDB: ProjectsDbService, private detector: ChangeDetectorRef) {
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
	}

	ngOnInit() {
	}

	updateReport(project?: Project): void {
		setTimeout(() => {
			console.log('Updating report!');
			if (project) {
				console.log(`From: ${this.startDate}. To: ${this.endDate} and for project ${project.name}`);
			} else {
				console.log(`From: ${this.startDate}. To: ${this.endDate}`);
			}
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
		return project ? project.name + '  |  ' + project.number : project;
	}

	ngOnDestroy() {
		this.projectsSub.unsubscribe();
	}

}

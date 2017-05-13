import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Work} from '../../models/work';
import {FormControl} from '@angular/forms';
import {Project} from '../../models/project';

@Component({
	selector: 'wtc-work-card',
	templateUrl: './work-card.component.html',
	styleUrls: ['./work-card.component.scss']
})


export class WorkCardComponent implements OnInit {
	@Input() work: Work;
	@Output() workDeleted = new EventEmitter();

	projectCtrl: FormControl = new FormControl();
	filteredProjects: any;
	projects = [
		new Project('52342', 'Landing Pages'),
		new Project('1234', 'Maintenance Interface'),
		new Project('6576', 'Mobile Time Tracking app'),
		new Project('52342', 'TYPO3 Website')
	];

	constructor() {
	}

	ngOnInit() {
		this.filteredProjects = this.projectCtrl.valueChanges
			.startWith(null)
			.map(project => project && typeof project === 'object' ? project.name : project)
			.map(name => name ? this.filterProjects(name) : this.projects.slice());
	}

	filterProjects(val: string) {
		// return this.projects.filter(project => new RegExp(`^${val}`, 'gi').test(project.name));
		return this.projects.filter(project => new RegExp(val, 'i').test(project.name));
	}

	//
	// displayFn(project): string {
	// 	console.log(project);
	// 	// return project ? project.name : project;
	// }

	deleteWork(): void {
		this.workDeleted.emit();
	}
}

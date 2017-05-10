import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Work} from '../../models/work';
import {FormControl} from '@angular/forms';

@Component({
	selector: 'wtc-work-card',
	templateUrl: './work-card.component.html',
	styleUrls: ['./work-card.component.scss']
})
export class WorkCardComponent implements OnInit {
	@Input() work: Work;
	@Output() workDeleted = new EventEmitter();

	projectCtrl: FormControl;
	filteredProjects: any;
	projects =
		[
			{
				id: 52342,
				name: 'Landing Pages'
			}
			, {
			id: 1234,
			name: 'Maintenance Interface'
		}
			,
			{
				id: 52342,
				name: 'TYPO3 Website'
			}
		];

	constructor() {
		this.projectCtrl = new FormControl();
	}

	ngOnInit() {
		this.filteredProjects = this.projectCtrl.valueChanges
			.startWith(null)
			.map(project => project && typeof project === 'object' ? project.name : project)
			.map(name => name ? this.filterProjects(name) : this.projects.slice());
	}

	filterProjects(val: string) {
		return this.projects.filter(project => new RegExp(`^${val}`, 'gi').test(project.name));
	}

	displayFn(project): string {
		return project ? project.name : project;
	}


	deleteWork = function (): void {
		this.workDeleted.emit();
	};

}

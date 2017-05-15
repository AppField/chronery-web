import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Work} from '../../models/work';
import {AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Project} from '../../models/project';
import {Observable} from 'rxjs/Observable';

@Component({
	selector: 'wtc-work-card',
	templateUrl: './work-card.component.html',
	styleUrls: ['./work-card.component.scss']
})


export class WorkCardComponent implements OnInit {
	@Input() work: Work;
	@Output() workDeleted = new EventEmitter();

	// projectCtrl: FormControl = new FormControl();
	filteredProjects: Observable<Project[]>;
	projects = [
		new Project('52342', 'Landing Pages'),
		new Project('1234', 'Maintenance Interface'),
		new Project('6576', 'Mobile Time Tracking app'),
		new Project('52342', 'TYPO3 Website')
	];

	workForm: FormGroup;
	from: AbstractControl;
	to: AbstractControl;

	constructor(public fb: FormBuilder) {

	}

	ngOnInit() {
		console.log(this.work);
		this.workForm = this.fb.group({
			project: [this.work.projectName, Validators.required],
			from: [this.work.from, [Validators.required, this.checkIfTime]],
			to: [this.work.to, [Validators.required, this.checkIfTime]],
			comment: this.work.comment
		});

		// Autocomplete functionality
		this.filteredProjects = this.workForm.controls['project'].valueChanges
			.startWith(null)
			.map(project => project && typeof project === 'object' ? project.name : project)
			.map(name => name ? this.filterProjects(name) : this.projects.slice());

		(<FormControl>this.workForm.controls['project']).registerOnChange(() => {
			console.log(this.work.projectName);
		});
		// Assign the controls to value to show validation errors
		this.from = this.workForm.controls['from'];
		this.to = this.workForm.controls['to'];
	}

	filterProjects(val: string) {
		return this.projects.filter(project => new RegExp(val, 'i').test(project.name));
	}

	checkIfTime(control: FormControl): any {
		return new RegExp('^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$').test(control.value) ? null : {invalidTime: true};
	}

	deleteWork(): void {
		this.workDeleted.emit();
	}
}

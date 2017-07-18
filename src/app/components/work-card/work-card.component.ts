import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ElementRef, HostListener} from '@angular/core';
import {Work} from '../../models/work';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Project} from '../../models/project';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';
import {ProjectsDbService} from '../../services/projects-db/projects-db.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
	selector: 'wtc-work-card',
	templateUrl: './work-card.component.html',
	styleUrls: ['./work-card.component.scss']
})


export class WorkCardComponent implements OnInit, OnDestroy {
	@Input() work: Work;
	@Output() saveWork = new EventEmitter();
	@Output() deleteWork = new EventEmitter();

	filteredProjects: Observable<Project[]>;
	projects: Project[] = [];

	workForm: FormGroup;
	toControl: AbstractControl;

	private projectsSub: Subscription;

	static isAfter(control: FormControl): any {
		if (control.parent) {
			const from = control.parent.controls['from'].value.split(':');
			const to = control.value.split(':');
			const fromDate = new Date(0, 0, 0, from[0], from[1], 0);
			const toDate = new Date(0, 0, 0, to[0], to[1], 0);
			return moment(toDate).isAfter(fromDate) ? true : {isNotAfter: true};
		}
		return null;
	}

	@HostListener('document:click', ['$event.target'])
	public onClickOutside(targetElement) {
		const clickedInside = this.elRef.nativeElement.contains(targetElement);
		if (!clickedInside) {
			this.checkValidation();
		}
	}

	constructor(public fb: FormBuilder, private projectsDB: ProjectsDbService, private elRef: ElementRef) {
	}

	ngOnInit() {
		const timeRegex = '^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$';

		let tempProject = null;
		if (this.work.hasOwnProperty('projectId')) {
			tempProject = new Project;
			tempProject._id = this.work.projectId;
			tempProject.number = this.work.projectNumber;
			tempProject.name = this.work.projectName;
		}

		this.workForm = this.fb.group({
			project: [tempProject, Validators.required],
			from: [this.work.from, [Validators.required, Validators.pattern(timeRegex)]],
			to: [this.work.to, [Validators.required, Validators.pattern(timeRegex), WorkCardComponent.isAfter]],
			comment: this.work.comment
		});
		this.workForm.controls['project'].updateValueAndValidity();

		this.projectsSub = this.projectsDB.dataChange.subscribe((data) => {
			this.projects = data;
			// Autocomplete functionality
			this.filteredProjects = this.workForm.controls['project'].valueChanges
				.startWith(null)
				.map(project => project && typeof project === 'object' ? project.name : project)
				.map(name => name ? this.filterProjects(name) : this.projects.slice());

		});

		this.toControl = this.workForm.controls['to'];
		this.workForm.controls['from'].valueChanges.subscribe((value) => {
			this.workForm.controls['to'].updateValueAndValidity();
		});
	}

	filterProjects(val: string) {
		return this.projects.filter(project => new RegExp(val, 'i').test(project.name));
	}

	displayFn(project: Project) {
		return project ? project.name + '  |  ' + project.number : project;
	}

	projectChanged(project: Project): void {
		this.work.projectNumber = project.number;
	}

	timeChanged(): void {
		if (this.workForm.controls['from'].valid && this.workForm.controls['to'].valid) {
			this.setSpent();
		}
	}

	formatTime(value: string, name: string): void {
		value = value.trim();
		if (value.length === 1) {
			if (Number(value)) {
				value = '0' + value + ':00';
			}
		} else if (value.length === 2) {
			if (Number(value)) {
				value = value + ':00';
			}
		} else if (value.length === 3) {
			if (Number(value)) {
				// User typed e.g. '124'
				value = value[0] + value[1] + ':' + value[2] + '0';
			}
		} else if (value.length === 4) {
			if (Number(value) || Number(value) === 0) {
				value = value[0] + value[1] + ':' + value[2] + value[3];
			} else if (value[2] === ':') {
				value = value + '0';
			}
		}
		name === 'from' ? this.workForm.controls['from'].patchValue(value) : this.workForm.controls['to'].patchValue(value);
		this.timeChanged();
	}

	setSpent = function (): void {
		const from = this.workForm.controls['from'].value.split(':');
		const to = this.workForm.controls['to'].value.split(':');
		const fromDate = new Date(0, 0, 0, from[0], from[1], 0);
		const toDate = new Date(0, 0, 0, to[0], to[1], 0);
		const diff = moment.utc(moment(toDate).diff(moment(fromDate)));
		this.work.spent = diff.format('HH:mm');
	};


	checkValidation(): void {
		if (this.workForm.valid) {
			this.work.projectId = this.workForm.controls['project'].value._id;
			this.work.projectNumber = this.workForm.controls['project'].value.number;
			this.work.projectName = this.workForm.controls['project'].value.name;
			this.work.from = this.workForm.controls['from'].value;
			this.work.to = this.workForm.controls['to'].value;
			this.work.comment = this.workForm.controls['comment'].value;

			this.saveWork.emit(this.work);
		}

	}

	removeWork(): void {
		this.deleteWork.emit(this.work);
	}

	ngOnDestroy() {
		this.projectsSub.unsubscribe();
	}

}

import {Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChildren, ElementRef} from '@angular/core';
import {Work} from '../../models/work';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Project} from '../../models/project';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';
import * as moment from 'moment/moment';
import {ProjectsDbService} from '../../services/projects-db/projects-db.service';
import {Subscription} from 'rxjs/Subscription';
import {MdInputContainer} from '@angular/material';

@Component({
	selector: 'wtc-work-card',
	templateUrl: './work-card.component.html',
	styleUrls: ['./work-card.component.scss']
})


export class WorkCardComponent implements OnInit, OnDestroy {
	@Input() work: Work;
	@Output() saveWork = new EventEmitter();
	@Output() deleteWork = new EventEmitter();
	@ViewChildren(MdInputContainer) inputContainers;

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

	constructor(public fb: FormBuilder, private projectsDB: ProjectsDbService, private elRef: ElementRef) {
	}

	ngOnInit() {
		const timeRegex = '^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$';

		this.workForm = this.fb.group({
			project: [this.work.projectName, Validators.required],
			from: [this.work.from, [Validators.required, Validators.pattern(timeRegex)]],
			to: [this.work.to, [Validators.required, Validators.pattern(timeRegex), WorkCardComponent.isAfter]],
			comment: this.work.comment
		});

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

	projectChanged(project: Project): void {
		this.work.projectNumber = project.number;
	}

	timeChanged(): void {
		if (this.workForm.controls['from'].valid && this.workForm.controls['to'].valid) {
			this.work.setSpent();
		}
	}

	formatTime(value: string, name: string): void {
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


	checkValidation(): void {
		if (this.workForm.valid) {
			this.work.projectName = this.workForm.controls['project'].value;
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

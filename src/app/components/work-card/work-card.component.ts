import { Component, ElementRef, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Project } from '../../models/project';
import { Observable, Subject } from 'rxjs';
import { Comment } from '../../models/comment';


import * as moment from 'moment/moment';
import { Utility } from '../../utils/utility';
import { WorkingHours } from '../../models/working-hours';

import { clone } from 'lodash';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'chy-work-card',
  templateUrl: './work-card.component.html',
  styleUrls: ['./work-card.component.scss']
})


export class WorkCardComponent implements OnInit, OnDestroy {
  @Input() projects: Project[];
  @Input() comments: Comment[];
  @Input() work: WorkingHours;
  @Output() saveWork = new EventEmitter<WorkingHours>();
  @Output() deleteWork = new EventEmitter<WorkingHours>();
  @Output() persistNewWork = new EventEmitter<WorkingHours>();
  filteredProjects: Observable<Project[]>;
  filteredComments: Observable<Comment[]>;
  workForm: FormGroup;
  toControl: AbstractControl;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private backupWork: WorkingHours;
  private cardActive: boolean;

  constructor(public fb: FormBuilder, private elRef: ElementRef) {
  }

  static isAfter(control: FormControl): any {
    if (control.parent) {
      const from = control.parent.controls['from'].value.split(':');
      const to = control.value.split(':');
      const fromDate = new Date(0, 0, 0, from[0], from[1], 0);
      const toDate = new Date(0, 0, 0, to[0], to[1], 0);
      return moment(toDate).isAfter(fromDate) ? true : { isNotAfter: true };
    }
    return null;
  }

  @HostListener('document:click', ['$event.target'])
  public onClickOutside(targetElement) {
    const clickedInside = this.elRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      // if (this.cardActive) {
      this.checkValidation();
      this.cardActive = false;
      // }
    } else {
      this.cardActive = true;
    }
  }

  ngOnInit() {
    const timeRegex = '^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$';
    this.backupWork = clone(this.work);

    // let tempProject = null;
    // if (this.work.hasOwnProperty('project')) {
    // 	tempProject: Project = this.work.project
    // 	tempProject.project = {
    // 		id: this.work.project.id,
    // 		number: this.work.project.number,
    // 		name: this.work.project.name
    // 	}
    // }

    this.workForm = this.fb.group({
      // project: [tempProject, Validators.required],
      project: [this.work.project, Validators.required],
      from: [this.work.from, [Validators.required, Validators.pattern(timeRegex)]],
      to: [this.work.to, [Validators.required, Validators.pattern(timeRegex), WorkCardComponent.isAfter]],
      comment: this.work.comment
    });


    // Autocomplete functionality
    this.filteredProjects = this.workForm.controls['project'].valueChanges
      .pipe(
        startWith(null),
        map(project => project && typeof project === 'object' ? project.name : project),
        map(name => name ? this.filterProjects(name) : this.projects ? this.projects.slice() : [])
      );


    this.filteredComments = this.workForm.controls['comment'].valueChanges
      .pipe(
        startWith(null),
        map(comment => comment && typeof comment === 'object' ? comment.comment : comment),
        map(value => value ? this.filterComments(value) : this.comments ? this.comments.slice() : [])
      );

    this.toControl = this.workForm.controls['to'];
    this.workForm.controls['from'].valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.workForm.controls['to'].updateValueAndValidity();
      });

    this.updateExistingProject();
  }

  setSpent(): void {
    const from = this.workForm.controls['from'].value.split(':');
    const to = this.workForm.controls['to'].value.split(':');
    const fromDate = new Date(0, 0, 0, from[0], from[1], 0);
    const toDate = new Date(0, 0, 0, to[0], to[1], 0);
    const diff = moment.utc(moment(toDate).diff(moment(fromDate)));
    this.work.spent = diff.format('HH:mm');
  };

  updateExistingProject(): void {
    if (!this.projects) {
      return;
    }
    if (this.work.hasOwnProperty('project')) {
      const i = this.projects.map((el) => {
        return el.id;
      }).indexOf(this.work.project.id);

      if (i > -1) {
        if (this.projects[i].number !== this.work.project.number || this.projects[i].name !== this.work.project.name) {
          this.workForm.controls['project'].patchValue(this.projects[i]);
          this.checkValidation();
        }
      }
    }
  }

  filterProjects(val: string) {
    return this.projects.filter((project: Project) => new RegExp(val, 'i').test(project.name));
  }

  filterComments(val: string) {
    return this.comments.filter((comment: Comment) => new RegExp(val, 'i').test(comment.comment));
  }

  displayFn(project: Project) {
    return project ? project.name + '  |  ' + project.number : project;
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

  checkValidation(): void {
    this.copyFormDataToWork();
    if (this.workForm.valid) {
      if (!this.checkWorkChanged()) {
        this.saveWork.emit(this.work);
      }
    } else {
      if (!this.work.hasOwnProperty('id')) {
        this.persistNewWork.emit(this.work);
      }
    }
  }

  checkTo(): void {
    if (this.workForm.controls['to'].value === '00:00') {
      this.workForm.controls['to'].setValue(Utility.getCurrentTimeString());
    }
  }

  copyFormDataToWork(): void {
    if (this.workForm.controls['project'].value) {
      this.work.project = {
        id: this.workForm.controls['project'].value.id,
        number: this.workForm.controls['project'].value.number,
        name: this.workForm.controls['project'].value.name
      };
    }
    this.work.from = this.workForm.controls['from'].value;
    this.work.to = this.workForm.controls['to'].value;
    this.work.comment = this.workForm.controls['comment'].value || '';
  }

  checkWorkChanged(): boolean {
    return JSON.stringify(this.backupWork) === JSON.stringify(this.work);
  }

  removeWork(): void {
    this.deleteWork.emit(this.work);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

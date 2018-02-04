import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { Project } from '../../models/project';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { clone } from 'lodash';

@Component({
	selector: 'chy-project-modal',
	templateUrl: './project-dialog.component.html',
	styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
	project: Project;
	projectForm: FormGroup;

	// order matters
	constructor(public fb: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: Project,
				public dialogRef: MatDialogRef<ProjectDialogComponent>) {

		this.project = clone(data);
	}

	ngOnInit() {
		this.projectForm = this.fb.group({
			number: [this.project.number, [Validators.required]],
			name: [this.project.name, [Validators.required]],
			inactive: [this.project.inactive]
		});
	}

	saveProject() {
		if (this.projectForm.valid) {
			this.project.number = this.projectForm.controls['number'].value;
			this.project.name = this.projectForm.controls['name'].value;
			this.project.inactive = this.projectForm.controls['inactive'].value;
			this.dialogRef.close(this.project);
		}
	}
}

import { Component, Inject, OnInit } from '@angular/core';
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material';
import { Project } from '../../models/project';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'chy-project-modal',
	templateUrl: './project-dialog.component.html',
	styleUrls: ['./project-dialog.component.scss']
})
export class ProjectDialogComponent implements OnInit {
	project: Project;
	projectForm: FormGroup;

	// order matters
	constructor(public fb: FormBuilder, @Inject(MD_DIALOG_DATA) public data: Project,
				public dialogRef: MdDialogRef<ProjectDialogComponent>) {

		this.project = Object.assign({}, data);
	}

	ngOnInit() {
		this.projectForm = this.fb.group({
			number: [this.project.number, [Validators.required]],
			name: [this.project.name, [Validators.required]]
		});
	}

	saveProject() {
		if (this.projectForm.valid) {
			this.project.number = this.projectForm.controls['number'].value;
			this.project.name = this.projectForm.controls['name'].value;
			this.dialogRef.close(this.project);
		}
	}
}

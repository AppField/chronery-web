import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WorkingHours } from '../../models/working-hours';

import { clone } from 'lodash';
import * as jspdf from 'jspdf';

@Component({
	selector: 'chy-report-pdf-dialog',
	templateUrl: './report-pdf-dialog.component.html',
	styleUrls: ['./report-pdf-dialog.component.scss']
})
export class ReportPdfDialogComponent implements OnInit {

	report: WorkingHours[];

	// order matters
	constructor(@Inject(MAT_DIALOG_DATA) public data: WorkingHours[],
				public dialogRef: MatDialogRef<ReportPdfDialogComponent>) {

		this.report = clone(data);
	}

	ngOnInit() {
	}

}

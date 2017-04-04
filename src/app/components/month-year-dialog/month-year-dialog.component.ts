import {Component, OnInit} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
	selector: 'wtc-month-year-dialog',
	templateUrl: './month-year-dialog.component.html',
	styleUrls: ['./month-year-dialog.component.scss']
})
export class MonthYearDialogComponent implements OnInit {
	months: Array<{}> = [];
	selectedDate: Date = new Date();

	constructor(public dialogRef: MdDialogRef<MonthYearDialogComponent>) {
		this.selectedDate = dialogRef.config.data;
	}

	ngOnInit() {
	}

	nextMonth(): void {
		this.selectedDate = new Date(this.selectedDate.setMonth(this.selectedDate.getMonth() + 1));
	}

	previousMonth(): void {
		this.selectedDate = new Date(this.selectedDate.setMonth(this.selectedDate.getMonth() - 1));
	}

	nextYear(): void {
		this.selectedDate = new Date(this.selectedDate.setFullYear(this.selectedDate.getFullYear() + 1));
	}

	previousYear(): void {
		this.selectedDate = new Date(this.selectedDate.setFullYear(this.selectedDate.getFullYear() - 1));
	}
}

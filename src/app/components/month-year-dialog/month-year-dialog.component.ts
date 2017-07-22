import {Component, OnInit} from '@angular/core';
import {MdDialogRef} from '@angular/material';

@Component({
	selector: 'chy-month-year-dialog',
	templateUrl: './month-year-dialog.component.html',
	styleUrls: ['./month-year-dialog.component.scss']
})
export class MonthYearDialogComponent implements OnInit {
	selectedDate: Date = new Date();

	constructor(public dialogRef: MdDialogRef<MonthYearDialogComponent>) {
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

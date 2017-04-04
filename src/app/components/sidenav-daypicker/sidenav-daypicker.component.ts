import {Component, OnInit} from '@angular/core';
import {MonthYearDialogComponent} from '../month-year-dialog/month-year-dialog.component';
import {MdDialog} from '@angular/material';

@Component({
	selector: 'wtc-sidenav-daypicker',
	templateUrl: './sidenav-daypicker.component.html',
	styleUrls: ['./sidenav-daypicker.component.scss']
})
export class SidenavDaypickerComponent implements OnInit {
	days: Array<{}> = [];
	monthYear: Date = new Date();

	constructor(public dialog: MdDialog) {
		this.getDays();
	}

	ngOnInit() {
	}

	openMonthYearDialog() {
		const dialogRef = this.dialog.open(MonthYearDialogComponent, {
			data: this.monthYear
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.monthYear = result;
				this.getDays();
			}
		});
	}

	private getDays() {
		this.days = [];
		// get list of days of current month
		const helperDate = new Date(this.monthYear);
		const currentMonth = helperDate.getMonth();
		helperDate.setDate(1);
		do {
			this.days.push({date: new Date(helperDate)});
			helperDate.setDate(helperDate.getDate() + 1);
		} while (helperDate.getMonth() === currentMonth);
	}
}

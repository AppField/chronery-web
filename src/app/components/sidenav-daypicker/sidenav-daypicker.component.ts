import {Component, OnDestroy, ViewChildren, AfterViewInit} from '@angular/core';
import {MonthYearDialogComponent} from '../month-year-dialog/month-year-dialog.component';
import {MdDialog} from '@angular/material';
import {Utility} from '../../utils/utility';
import {Router} from '@angular/router';
import {DateParamService} from '../../services/date-param/date-param.service';

@Component({
	selector: 'wtc-sidenav-daypicker',
	templateUrl: './sidenav-daypicker.component.html',
	styleUrls: ['./sidenav-daypicker.component.scss'],
})
export class SidenavDaypickerComponent implements OnDestroy, AfterViewInit {
	@ViewChildren('dayList') dayList;

	days: Array<{}> = [];
	activeLinkIndex = 0;
	monthYear: Date = new Date();
	private sub: any;

	constructor(private dialog: MdDialog,
				private router: Router,
				private dateParamService: DateParamService) {
		this.getDays();

		this.sub = this.dateParamService.getDateParam().subscribe(dateParam => {
			if (dateParam) {
				this.activeLinkIndex = this.days.map((obj) => {
					return obj['date'].getDate();
				}).indexOf(Utility.decodeDate(dateParam).getDate());
			}
		});
	}

	ngAfterViewInit() {
		// const activeElement = this.dayList.toArray()[this.activeLinkIndex];
	}

	onDaySelect(date: Date) {
		const encodedDate = Utility.encodeDate(date);
		this.router.navigate(['hours-of-work', encodedDate]);
	}

	openMonthYearDialog() {
		const dialogRef = this.dialog.open(MonthYearDialogComponent, {
			data: this.monthYear
		});
		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				this.activeLinkIndex = -1;
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
			this.days.push({
				date: new Date(helperDate)
			});
			helperDate.setDate(helperDate.getDate() + 1);
		} while (helperDate.getMonth() === currentMonth);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}

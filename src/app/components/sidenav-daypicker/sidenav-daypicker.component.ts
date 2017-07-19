import {Component, OnDestroy, ViewChildren, AfterViewInit, Output, EventEmitter} from '@angular/core';
import {MonthYearDialogComponent} from '../month-year-dialog/month-year-dialog.component';
import {MdDialog} from '@angular/material';
import {Utility} from '../../utils/utility';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
	selector: 'wtc-sidenav-daypicker',
	templateUrl: './sidenav-daypicker.component.html',
	styleUrls: ['./sidenav-daypicker.component.scss'],
})
export class SidenavDaypickerComponent implements OnDestroy, AfterViewInit {
	@ViewChildren('dayList') dayList;
	@Output() daySelected = new EventEmitter();

	days: Array<{}> = [];
	activeLinkIndex = 0;
	monthYear: Date = new Date();
	private sub: any;

	constructor(private dialog: MdDialog,
				private router: Router,
				private activeRoute: ActivatedRoute) {
		this.getDays();

		this.sub = this.activeRoute.params.subscribe(params => {
			const dateParam = params['date'];
			if (dateParam) {
				const date = Utility.decodeDate(dateParam);
				if (this.monthYear.getMonth() !== date.getMonth() || this.monthYear.getFullYear() !== date.getFullYear()) {
					this.monthYear.setMonth(date.getMonth());
					this.monthYear.setFullYear(date.getFullYear());
					this.getDays();
				}

				this.activeLinkIndex = this.days.map((obj) => {
					return obj['date'].getDate();
				}).indexOf(date.getDate());
			}
		});
	}

	ngAfterViewInit() {
		// const activeElement = this.dayList.toArray()[this.activeLinkIndex];
	}

	onDaySelect(date: Date) {
		const encodedDate = Utility.encodeDate(date);
		this.router.navigate(['working-hours', encodedDate]);
		this.daySelected.emit();
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

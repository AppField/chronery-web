import { Component, OnDestroy, ViewChildren, Output, EventEmitter, AfterViewInit, AfterContentInit } from '@angular/core';
import { MonthYearDialogComponent } from '../month-year-dialog/month-year-dialog.component';
import { MatDialog } from '@angular/material';
import { Utility } from '../../utils/utility';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment/moment';
import { WorkingHoursService } from '../../services/working-hours/working-hours.service';
import { WorkingHours } from '../../models/working-hours';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';

interface DayMeta {
	date: Date;
	totalTime: string;
	projects: string[];
}

@Component({
	selector: 'chy-sidenav-daypicker',
	templateUrl: './sidenav-daypicker.component.html',
	styleUrls: ['./sidenav-daypicker.component.scss'],
})
export class SidenavDaypickerComponent implements OnDestroy, AfterContentInit {
	@ViewChildren('dayList') dayList;
	@Output() daySelected = new EventEmitter();

	private destroy$: Subject<boolean> = new Subject<boolean>();

	days: DayMeta[] = [];
	activeLinkIndex = 0;
	monthYear: Date = new Date();

	constructor(private dialog: MatDialog,
				private router: Router,
				private activeRoute: ActivatedRoute,
				private workingHoursService: WorkingHoursService) {
	}

	ngAfterContentInit() {
		this.getDays();
		this.getMeta();

		this.activeRoute.params
			.takeUntil(this.destroy$)
			.subscribe(params => {
				const dateParam = params['date'];
				if (dateParam) {
					const date = Utility.decodeDate(dateParam);
					if (this.monthYear.getMonth() !== date.getMonth() || this.monthYear.getFullYear() !== date.getFullYear()) {
						this.monthYear.setMonth(date.getMonth());
						this.monthYear.setFullYear(date.getFullYear());
						this.getDays();
						this.getMeta();
					}

					this.activeLinkIndex = this.days.map((obj) => {
						return obj['date'].getDate();
					}).indexOf(date.getDate());
				}
			});
	}

	onDaySelect(date: Date) {
		const encodedDate = Utility.encodeDate(date);
		this.workingHoursService.dataChange.next([]);
		this.router.navigate(['working-hours', encodedDate]);
		this.daySelected.emit();
	}

	openMonthYearDialog() {
		const dialogRef = this.dialog.open(MonthYearDialogComponent, {
			data: this.monthYear
		});
		dialogRef.afterClosed()
			.takeUntil(this.destroy$)
			.subscribe(result => {
				if (result) {
					this.activeLinkIndex = -1;
					this.monthYear = result;
					this.getDays();
					this.getMeta();
				}
			});
	}

	private getDays(): void {
		this.days = [];
		// get list of days of current month
		const helperDate = new Date(this.monthYear);
		const currentMonth = helperDate.getMonth();
		helperDate.setDate(1);
		do {
			this.days.push({
				date: new Date(helperDate),
				totalTime: '00:00',
				projects: []
			});
			helperDate.setDate(helperDate.getDate() + 1);
		} while (helperDate.getMonth() === currentMonth);
	}

	private getMeta(): void {
		const startDate = moment(this.monthYear).startOf('month').toDate();
		const endDate = moment(this.monthYear).endOf('month').toDate();

		const from = Utility.encodeDate(startDate);
		const to = Utility.encodeDate(endDate);

		this.workingHoursService.onFilterData(from, to, true).then(data => {
			data.map((work: WorkingHours) => {
				const dateIndex = this.days.map((meta: DayMeta) => {
					return Utility.encodeDate(meta.date);
				}).indexOf(work.date);

				const totalTime = Utility.sumTimes([this.days[dateIndex].totalTime, work.spent]);
				this.days[dateIndex].totalTime = totalTime;

				const projectAdded = this.days[dateIndex].projects.indexOf(work.project.id);
				if (projectAdded) {
					this.days[dateIndex].projects.push(work.project.id);
				}

			});
		});
	}

	ngOnDestroy() {
		this.destroy$.next(true);
		this.destroy$.unsubscribe();
	}
}

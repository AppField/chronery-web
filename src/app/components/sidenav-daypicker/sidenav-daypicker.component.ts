import { Component, OnDestroy, ViewChildren, AfterViewInit, Output, EventEmitter } from '@angular/core';
import { MonthYearDialogComponent } from '../month-year-dialog/month-year-dialog.component';
import { MdDialog } from '@angular/material';
import { Utility } from '../../utils/utility';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkingHoursDbService } from '../../services/working-hours-db/working-hours-db.service';
import * as moment from 'moment/moment';
import { WorkingHoursFilter } from '../../models/working-hours-filter';
import { Work } from '../../models/work';

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
export class SidenavDaypickerComponent implements OnDestroy, AfterViewInit {
	@ViewChildren('dayList') dayList;
	@Output() daySelected = new EventEmitter();

	days: DayMeta[] = [];
	activeLinkIndex = 0;
	monthYear: Date = new Date();
	private sub: any;

	constructor(private dialog: MdDialog,
				private router: Router,
				private activeRoute: ActivatedRoute,
				private workingHoursDB: WorkingHoursDbService) {
		this.getDays();
		this.getMeta();

		this.sub = this.activeRoute.params.subscribe(params => {
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

		const filter = new WorkingHoursFilter();
		filter.date = Utility.encodeDate(startDate);
		filter.toDate = Utility.encodeDate(endDate);

		this.workingHoursDB.getWorkingHoursData(filter).then(data => {
			data.map((work: Work) => {
				const dateIndex = this.days.map((meta: DayMeta) => {
					return Utility.encodeDate(meta.date);
				}).indexOf(work.date);

				const totalTime = Utility.sumTimes([this.days[dateIndex].totalTime, work.spent]);
				this.days[dateIndex].totalTime = totalTime;

				const projectAdded = this.days[dateIndex].projects.indexOf(work.projectId);
				if (projectAdded) {
					this.days[dateIndex].projects.push(work.projectId);
				}

			});
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}

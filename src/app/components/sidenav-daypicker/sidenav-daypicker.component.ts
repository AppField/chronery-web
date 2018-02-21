import { AfterContentInit, Component, EventEmitter, OnDestroy, Output, ViewChildren } from '@angular/core';
import { MonthYearDialogComponent } from '../month-year-dialog/month-year-dialog.component';
import { MatDialog } from '@angular/material';
import { Utility } from '../../utils/utility';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment/moment';
import { WorkingHoursService } from '../../services/working-hours/working-hours.service';
import { WorkingHours } from '../../models/working-hours';
import 'rxjs/add/operator/takeUntil';
import { Subject } from 'rxjs/Subject';
import { Moment } from 'moment';

interface DayMeta {
    date: Moment;
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
    days: DayMeta[] = [];
    activeLinkIndex = 0;
    monthYear: Moment = moment();
    private destroy$: Subject<boolean> = new Subject<boolean>();

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
                    if (this.monthYear.month() !== date.month() || this.monthYear.year() !== date.year()) {
                        this.monthYear = moment();
                        this.monthYear.month(date.month());
                        this.monthYear.year(date.year());
                        this.getDays();
                        this.getMeta();
                    }

                    this.activeLinkIndex = this.days.map((obj) => {
                        return obj['date'].date();
                    }).indexOf(date.date());
                }
            });
    }

    onDaySelect(date: Moment) {
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

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.unsubscribe();
    }

    private getDays(): void {
        this.days = [];
        // get list of days of current month
        const helperDate = moment(this.monthYear);
        const currentMonth = helperDate.month();
        helperDate.date(1);
        do {
            this.days.push({
                date: moment(helperDate),
                totalTime: '00:00',
                projects: []
            });
            helperDate.date(helperDate.date() + 1);
        } while (helperDate.month() === currentMonth);
    }

    private getMeta(): void {
        const startDate = moment(this.monthYear).startOf('month');
        const endDate = moment(this.monthYear).endOf('month');

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
}

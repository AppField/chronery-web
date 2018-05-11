import { Component, OnDestroy, OnInit } from '@angular/core';
import { Utility } from '../../utils/utility';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';
import { WorkingHoursService } from '../../services/working-hours/working-hours.service';
import { WorkingHours } from '../../models/working-hours';
import { Subject } from 'rxjs';

import { Moment } from 'moment';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'chy-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  todaysDate: Moment = moment();
  chartMonth: Moment = moment();
  todaysLink: string;
  chartLink: string;
  dataFound = true;
  chartData: WorkingHours[];
  isLoading = false;
  // TODO: remove this workaround. Necessary as the async time causes an error when building the prod package.
  async: any;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private router: Router, private workingHoursService: WorkingHoursService) {
    this.todaysLink = '/working-hours/' + Utility.encodeDate(this.todaysDate);
    this.updateChart();
  }

  ngOnInit() {
    this.workingHoursService.dataIsLoading
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => this.isLoading = isLoading);
  }

  nextMonth(): void {
    this.chartMonth = moment(this.chartMonth).add(1, 'month').date(1);
    this.updateChart();
  }

  previousMonth(): void {
    this.chartMonth = moment(this.chartMonth).subtract(1, 'month').date(1);
    this.updateChart();
  }

  updateChart(): void {
    this.chartLink = '/working-hours/' + Utility.encodeDate(this.chartMonth);

    const startDate = Utility.encodeDate(moment(this.chartMonth).startOf('month'));
    const endDate = Utility.encodeDate(moment(this.chartMonth).endOf('month'));


    const from = startDate;
    const to = endDate;
    this.workingHoursService.onFilterData(from, to).then(data => {
      this.chartData = data;
      (data.length > 0) ? this.dataFound = true : this.dataFound = false;
    });
  }

  navigateToWorkingHours(): void {
    this.router.navigate([this.todaysLink]);
  }

  navigateToChartMonth(): void {
    this.router.navigate([this.chartLink]);
  }

  navigateToProjects(): void {
    this.router.navigate(['/projects']);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

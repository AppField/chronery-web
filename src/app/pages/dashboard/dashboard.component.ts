import { Component, OnInit } from '@angular/core';
import { Utility } from '../../utils/utility';
import { WorkingHoursDbService } from '../../services/working-hours-db/working-hours-db.service';
import { Work } from '../../models/work';
import { WorkingHoursFilter } from '../../models/working-hours-filter';
import * as moment from 'moment/moment';
import { Router } from '@angular/router';

@Component({
	selector: 'chy-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	todaysDate = new Date();
	chartMonth = new Date();
	todaysLink: string;
	chartLink: string;
	dataFound = true;
	chartData: Work[];
	// TODO: remove this workaround. Necessary as the async time causes an error whenn building the prod package.
	async: any;

	constructor(private router: Router, private workingHoursDb: WorkingHoursDbService) {
		this.todaysLink = '/working-hours/' + Utility.encodeDate(this.todaysDate);
		this.updateChart();
	}

	ngOnInit() {
	}

	nextMonth(): void {
		this.chartMonth = moment(this.chartMonth).add(1, 'month').date(1).toDate();
		this.updateChart();
	}

	previousMonth(): void {
		this.chartMonth = moment(this.chartMonth).subtract(1, 'month').date(1).toDate();
		this.updateChart();
	}

	updateChart(): void {
		this.chartLink = '/working-hours/' + Utility.encodeDate(this.chartMonth);

		const startDate = Utility.encodeDate(moment(this.chartMonth).startOf('month').toDate());
		const endDate = Utility.encodeDate(moment(this.chartMonth).endOf('month').toDate());

		const filter = new WorkingHoursFilter();
		filter.date = startDate;
		filter.toDate = endDate;
		this.workingHoursDb.getWorkingHours(filter).then(data => {
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
}

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
	todaysLink: string;
	dataFound = true;
	chartData: Work[];

	constructor(private router: Router, private workingHoursDb: WorkingHoursDbService) {
		this.todaysLink = '/working-hours/' + Utility.encodeDate(this.todaysDate);

		const startDate = Utility.encodeDate(moment().startOf('month').toDate());
		const endDate = Utility.encodeDate(moment().endOf('month').toDate());

		const filter = new WorkingHoursFilter();
		filter.date = startDate;
		filter.toDate = endDate;
		this.workingHoursDb.getWorkingHours(filter).then(data => {
			this.chartData = data;
			(data.length > 0) ? this.dataFound = true : this.dataFound = false;
		});

	}

	ngOnInit() {
	}

	navigateToWorkingHours(): void {
		this.router.navigate([this.todaysLink]);
	}

	navigateToProjects(): void {
		this.router.navigate(['/projects']);
	}
}

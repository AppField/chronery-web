import { Component, OnInit } from '@angular/core';
import { Utility } from '../../utils/utility';
import { WorkingHoursDbService } from '../../services/working-hours-db/working-hours-db.service';
import { Work } from '../../models/work';
import { WorkingHoursFilter } from '../../models/working-hours-filter';
import * as moment from 'moment/moment';

@Component({
	selector: 'chy-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	todaysDate = new Date();
	todaysLink: string;
	chartData: Work[];

	constructor(private workingHoursDb: WorkingHoursDbService) {
		this.todaysLink = '/working-hours/' + Utility.encodeDate(this.todaysDate);

		const startDate = Utility.encodeDate(moment().startOf('month').toDate());
		const endDate = Utility.encodeDate(moment().endOf('month').toDate());

		const filter = new WorkingHoursFilter();
		filter.date = startDate;
		filter.toDate = endDate;
		this.workingHoursDb.getWorkingHours(filter).then(data => {
			this.chartData = data;
		});

	}

	ngOnInit() {
	}

}

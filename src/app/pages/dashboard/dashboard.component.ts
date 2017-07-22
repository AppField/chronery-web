import {Component, OnInit} from '@angular/core';
import {Utility} from '../../utils/utility';

@Component({
	selector: 'chy-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	todaysDate = new Date();
	todaysLink: string;

	constructor() {
		this.todaysLink = '/working-hours/' + Utility.encodeDate(this.todaysDate);
	}

	ngOnInit() {
	}

}

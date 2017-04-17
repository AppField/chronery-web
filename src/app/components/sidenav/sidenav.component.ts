import {Component, OnInit} from '@angular/core';
import {Utility} from '../../utils/utility';
import {Router} from '@angular/router';
import {DateParamService} from '../../services/date-param/date-param.service';


@Component({
	selector: 'wtc-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
	navLinks: [{}];
	selectedDate: string;
	activeLinkIndex: number;
	sub: any;

	constructor(private router: Router,
				private dateParamService: DateParamService) {
		this.navLinks = [
			{path: '/hours-of-work', label: 'Hours Of Work'},
			{path: '/summary', label: 'Month Summary'}
		];

		this.sub = this.dateParamService.getDateParam().subscribe(dateParam => {
			if (dateParam) {
				this.selectedDate = dateParam;
			}
		});
	}

	ngOnInit() {
	}

	isActive(instruction: any[]): boolean {
		return this.router.isActive(this.router.createUrlTree(instruction), true);
	}
}

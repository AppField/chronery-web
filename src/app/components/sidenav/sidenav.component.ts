import {Component, OnInit} from '@angular/core';
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
			{path: '/working-hours', label: 'Hours Of Work'},
			{path: '/report', label: 'Month Report'}
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

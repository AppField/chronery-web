import {Component, OnInit} from '@angular/core';
import {Utility} from '../../utils/utility';
import {Router} from '@angular/router';

interface RouterItem {
	link: string;
	icon: string;
	display: string;
}

@Component({
	selector: 'wtc-navlist',
	templateUrl: './navlist.component.html',
	styleUrls: ['./navlist.component.scss']
})


export class NavlistComponent implements OnInit {
	routerItems: RouterItem[];

	constructor(private router: Router) {
		// ToDo: Working Hours should remain active when another day is selected in subsidenav
		this.routerItems = [
			{
				link: '/dashboard',
				icon: 'dashboard',
				display: 'Dashboard'
			},
			{
				link: '/working-hours/' + Utility.encodeDate(new Date()),
				icon: 'timer',
				display: 'Working Hours'
			},
			{
				link: '/report',
				icon: 'business',
				display: 'Report'
			},
			{
				link: '/projects',
				icon: 'work',
				display: 'Projects'
			},
			{
				link: '/settings',
				icon: 'settings',
				display: 'Settings'
			}
		];
	}

	ngOnInit() {
	}
}

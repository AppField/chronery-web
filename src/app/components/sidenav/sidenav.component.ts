import { Component, OnInit } from '@angular/core';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Utility } from '../../utils/utility';

interface RouterItem {
	link: string;
	icon: string;
	display: string;
}

@Component({
	selector: 'chy-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnInit {
	routerItems: RouterItem[];
	collapsed = false;

	constructor(private media: ObservableMedia) {
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

		this.media.subscribe((mediaChange: MediaChange) => {
			if (mediaChange.mqAlias === 'xs') {
				this.collapsed = true;
			}
		})
	}

	get isMobile(): boolean {
		return this.media.isActive('xs');
	}

	ngOnInit() {
	}

	toggleCollapse(): void {
		this.collapsed = !this.collapsed;
	}
}

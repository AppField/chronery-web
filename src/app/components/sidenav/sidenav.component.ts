import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
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

	constructor(private media: ObservableMedia,
				private detector: ChangeDetectorRef) {
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
		if (this.media.isActive('xs')) {
			this.collapsed = true;
		}
	}

	get isMobile(): boolean {
		return this.media.isActive('xs');
	}


	toggleCollapse(): void {
		this.collapsed = !this.collapsed;
	}

	recollapseNav(): void {
		if (this.isMobile) {
			this.collapsed = true;
			this.detector.detectChanges();
		}
	}
}

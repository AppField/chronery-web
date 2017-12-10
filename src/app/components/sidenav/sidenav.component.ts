import { Component, OnInit, ViewChild } from '@angular/core';
import { ObservableMedia } from '@angular/flex-layout';
import { Utility } from '../../utils/utility';
import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/animations';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { WindowRef } from '../../services/window-ref/window-ref.service';

interface RouterItem {
	link: string;
	icon: string;
	display: string;
}

@Component({
	selector: 'chy-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss'],
	animations: [
		trigger('sidenavState', [
			state('expandedState', style({
				width: '*'
			})),
			state('collapsedState', style({
				width: '56px'
			})),
			transition('expandedState => collapsedState', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
			transition('collapsedState => expandedState', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
		]),
		trigger('labelState', [
			state('expandedState', style({
				opacity: 1
			})),
			state('collapsedState', style({
				opacity: 0
			})),
			transition('expandedState => collapsedState', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)')),
			transition('collapsedState => expandedState', animate('400ms cubic-bezier(0.25, 0.8, 0.25, 1)'))
		])
	]
})
export class SidenavComponent implements OnInit {
	routerItems: RouterItem[];
	state = 'expandedState';

	@ViewChild('sidenavContainer') private sidenav;

	constructor(private media: ObservableMedia,
				private winRef: WindowRef,
				private swUpdate: SwUpdate,
				private snackBar: MatSnackBar) {
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
		this.state = (this.media.isActive('xs')) ? 'collapsedState' : 'expandedState';
		this.media.subscribe(media => {
			this.state = (media.mqAlias === 'xs') ? 'collapsedState' : 'expandedState';
		});


		this.swUpdate.available.subscribe(event => {

			console.log('[App] Update available: current version is', event.current, 'available version is', event.available);
			const snackBarRef = this.snackBar.open('Newer version of the app is available', 'Refresh');

			snackBarRef.onAction().subscribe(() => {
				this.winRef.nativeWindow.location.reload()
			});

		});
	}

	get isMobile(): boolean {
		return this.media.isActive('xs');
	}

	toggleCollapse(): void {
		this.state = (this.state === 'expandedState') ? 'collapsedState' : 'expandedState';
	}

	recollapseNav(): void {
		if (this.isMobile) {
			this.state = 'collapsedState';
		}
	}
}

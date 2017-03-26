import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'wtc-sidenav',
	templateUrl: './sidenav.component.html',
	styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {

	modes = [
		{id: 1, name: 'Day'},
		{id: 2, name: 'Month'},
		{id: 3, name: 'Year'}
	];

	constructor() {
	}

	ngOnInit() {
	}

}

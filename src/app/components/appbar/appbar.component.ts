import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'wtc-appbar',
	templateUrl: './appbar.component.html',
	styleUrls: ['./appbar.component.scss']
})
export class AppbarComponent implements OnInit {
	selectedMode: {};
	modes: [{}];

	constructor() {
		this.modes = [
			{ id: 1, name: 'Day' },
			{ id: 2, name: 'Month' },
			{ id: 3, name: 'Year' }];

		this.selectedMode = this.modes[0];
	}

	ngOnInit() {
	}

}

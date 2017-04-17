import {Component, OnInit} from '@angular/core';
import {Utility} from '../../utils/utility';
import {Router} from '@angular/router';

@Component({
	selector: 'wtc-appbar',
	templateUrl: './appbar.component.html',
	styleUrls: ['./appbar.component.scss']
})
export class AppbarComponent implements OnInit {

	constructor(private router: Router) {
	}

	ngOnInit() {
	}

	SetActiveDateToToday = function (): void {
		const encodedDate = Utility.encodeDate(new Date());
		this.router.navigate(['hours-of-work', encodedDate]);
	};
}

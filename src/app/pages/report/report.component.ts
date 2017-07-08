import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Utility} from '../../utils/utility';

@Component({
	selector: 'wtc-report',
	templateUrl: './report.component.html',
	styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, OnDestroy {
	date: Date;

	private sub: any;

	constructor(private route: ActivatedRoute) {
		this.sub = this.route.params.subscribe(params => {
			this.date = Utility.decodeDate(params['date']);
		});
	}

	ngOnInit() {
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}

}

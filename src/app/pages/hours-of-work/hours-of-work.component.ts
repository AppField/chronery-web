import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Utility} from '../../utils/utility';
import {DateParamService} from '../../services/date-param/date-param.service';

@Component({
	selector: 'wtc-hours-of-work',
	templateUrl: './hours-of-work.component.html',
	styleUrls: ['./hours-of-work.component.scss']
})
export class HoursOfWorkComponent implements OnInit, OnDestroy {
	date: Date;

	private sub: any;

	constructor(private route: ActivatedRoute,
				private dateParamService: DateParamService) {

		this.sub = this.route.params.subscribe(params => {
			this.date = Utility.decodeDate(params['date']);
			this.dateParamService.saveDateParam(params['date']);
		});
	}

	ngOnInit() {
	}


	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}

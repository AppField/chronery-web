import {Component, OnInit, OnDestroy} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Utility} from '../../utils/utility';
import {DateParamService} from '../../services/date-param/date-param.service';
import {Work} from '../../models/work';

@Component({
	selector: 'wtc-hours-of-work',
	templateUrl: './hours-of-work.component.html',
	styleUrls: ['./hours-of-work.component.scss']
})
export class HoursOfWorkComponent implements OnInit, OnDestroy {
	date: Date;
	works: Work[];

	private sub: any;

	constructor(private route: ActivatedRoute,
				private dateParamService: DateParamService) {

		this.sub = this.route.params.subscribe(params => {
			this.date = Utility.decodeDate(params['date']);
			this.dateParamService.saveDateParam(params['date']);
		});

		const work1 = new Work();
		const work2 = new Work();
		const work3 = new Work();
		const work4 = new Work();
		const work5 = new Work();
		this.works = [work1, work2, work3, work4, work5];
	}

	ngOnInit() {
	}

	newWork = function (): void {
		const newWork = new Work();
		this.works.push(newWork);
	};

	removeWork = function (index: string): void {
		this.works.splice(index, 1);
	};

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}

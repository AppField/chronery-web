import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Utility} from '../../utils/utility';
import {Work} from '../../models/work';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {Subscription} from 'rxjs/Subscription';
import {MdSidenav} from '@angular/material';
import {WorkingHoursDbService} from '../../services/working-hours-db/working-hours-db.service';

@Component({
	selector: 'wtc-working-hours',
	templateUrl: './working-hours.component.html',
	styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit, OnDestroy {
	@ViewChild('subsidenav') subsidenav: MdSidenav;

	date: Date;
	works: Work[] = [];
	sidenavMode = 'side';

	private dateSub: Subscription;
	private workingHoursSub: Subscription;
	private mediaSub: Subscription;

	constructor(private router: Router, private route: ActivatedRoute, public media: ObservableMedia,
				private workingHoursDb: WorkingHoursDbService) {
		this.dateSub = this.route.params.subscribe(params => {
			this.date = Utility.decodeDate(params['date']);
		});

		this.workingHoursSub = this.workingHoursDb.dataChange.subscribe(data => {
			this.works = data;
		});
	}

	ngOnInit() {
		this.mediaSub = this.media.subscribe((change: MediaChange) => {
			if (change.mqAlias === 'xs') {
				this.sidenavMode = 'over';
				this.subsidenav.close();
			} else {
				this.sidenavMode = 'side';
				this.subsidenav.open();
			}
		});
		if (this.media.isActive('xs')) {
			this.sidenavMode = 'over';
			this.subsidenav.close();
		} else {
			this.sidenavMode = 'side';
			this.subsidenav.open();
		}
	}

	newWork = function (): void {
		const newWork = new Work(Utility.encodeDate(new Date()));
		this.works.push(newWork);
	};

	saveWork(work: Work): void {
		this.workingHoursDb.createWorkingHour(work);
	}

	deleteWork(work: Work): void {
		this.workingHoursDb.deleteWorkingHour(work);
	};

	SetActiveDateToToday = function (): void {
		const encodedDate = Utility.encodeDate(new Date());
		this.router.navigate(['working-hours', encodedDate]);
	};

	checkSubsidenav(): void {
		if (this.sidenavMode === 'over'
		) {
			this.subsidenav.close();
		}
	}

	ngOnDestroy() {
		this.dateSub.unsubscribe();
		this.workingHoursSub.unsubscribe();
		this.mediaSub.unsubscribe();
	}
}

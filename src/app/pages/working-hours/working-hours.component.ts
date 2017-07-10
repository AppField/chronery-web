import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Utility} from '../../utils/utility';
import {Work} from '../../models/work';
import {MediaChange, ObservableMedia} from '@angular/flex-layout';
import {Subscription} from 'rxjs/Subscription';
import {MdSidenav} from '@angular/material';

@Component({
	selector: 'wtc-working-hours',
	templateUrl: './working-hours.component.html',
	styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit, OnDestroy {
	@ViewChild('subsidenav') subsidenav: MdSidenav;

	date: Date;
	works: Work[];
	sidenavMode = 'side';

	private sub: any;
	private mediaSub: Subscription;

	constructor(private router: Router, private route: ActivatedRoute, private media: ObservableMedia) {
		this.sub = this.route.params.subscribe(params => {
			this.date = Utility.decodeDate(params['date']);
		});

		const work1 = new Work();
		const work2 = new Work();
		const work3 = new Work();
		const work4 = new Work();
		const work5 = new Work();
		this.works = [work1, work2, work3, work4, work5];
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
		const newWork = new Work();
		this.works.push(newWork);
	};

	removeWork = function (index: string): void {
		this.works.splice(index, 1);
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
		this.sub.unsubscribe();
		this.mediaSub.unsubscribe();
	}
}

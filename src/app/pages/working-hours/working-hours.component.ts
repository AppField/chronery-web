import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utility } from '../../utils/utility';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';
import { MdSidenav } from '@angular/material';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { ProjectsService } from '../../services/projects/projects.service';
import { CommentsService } from '../../services/comments/comments.service';
import { WorkingHours } from '../../models/working-hours';
import { WorkingHoursService } from '../../services/working-hours/working-hours.service';

@Component({
	selector: 'chy-working-hours',
	templateUrl: './working-hours.component.html',
	styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit, OnDestroy {
	@ViewChild('subsidenav') subsidenav: MdSidenav;

	date: Date;
	encodedDate: string;
	works: WorkingHours[] = [];
	sidenavMode = 'side';
	newCard: boolean;
	async: any;

	private dateSub: Subscription;
	private mediaSub: Subscription;

	constructor(private route: ActivatedRoute, public media: ObservableMedia,
				private router: Router,
				public projectsService: ProjectsService,
				private workingHoursService: WorkingHoursService,
				public commentsService: CommentsService,
				private localStorage: LocalStorageService) {

		this.workingHoursService.dataChange.subscribe((data) => {
			// const newCard = this.localStorage.getItem(this.encodedDate);
			// if (newCard) {
			// 	this.works = [newCard].concat(data);
			// 	this.newCard = true;
			// } else {
			this.works = data;
			// this.newCard = false;
			// }
		});

		this.dateSub = this.route.params.subscribe(params => {
			this.encodedDate = params['date'];
			this.date = Utility.decodeDate(params['date']);
			this.workingHoursService.onRetrieveData(this.encodedDate);
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

	newWork(): void {
		const newWork = new WorkingHours();
		newWork.from = Utility.getCurrentTimeString();
		this.works.unshift(newWork);
		this.newCard = true;
	};

	saveWork(work: WorkingHours): void {
		// if (work.hasOwnProperty('_id')) {
		// 	this.workingHoursDb.updateWorkingHour(work);
		// } else {
		// 	this.localStorage.deleteItem(work.date);
		// 	this.workingHoursDb.createWorkingHour(work);
		// 	this.newCard = false;
		// }
		this.workingHoursService.onStoreData(work, this.encodedDate);
		this.newCard = false;
	}

	persistNewWork(work: WorkingHours): void {
		this.localStorage.saveItem(this.encodedDate, work);
	}

	deleteWork(work: WorkingHours): void {
		if (work.hasOwnProperty('_id')) {
			// this.workingHoursDb.deleteWorkingHour(work);
		} else {
			// this.localStorage.deleteItem(work.date);
			// this.works.shift();
			this.newCard = false;
		}
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
		this.mediaSub.unsubscribe();
	}
}

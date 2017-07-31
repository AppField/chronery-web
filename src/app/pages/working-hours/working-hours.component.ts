import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utility } from '../../utils/utility';
import { Work } from '../../models/work';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';
import { MdSidenav } from '@angular/material';
import { WorkingHoursDbService } from '../../services/working-hours-db/working-hours-db.service';
import { ProjectsDbService } from '../../services/projects-db/projects-db.service';
import { Project } from '../../models/project';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { WorkingHoursFilter } from '../../models/working-hours-filter';

@Component({
	selector: 'chy-working-hours',
	templateUrl: './working-hours.component.html',
	styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit, OnDestroy {
	@ViewChild('subsidenav') subsidenav: MdSidenav;

	date: Date;
	encodedDate: string;
	works: Work[] = [];
	projects: Project[] = [];
	sidenavMode = 'side';
	newCard: boolean;

	private dateSub: Subscription;
	private projectsSub;
	private workingHoursSub: Subscription;
	private mediaSub: Subscription;

	constructor(private router: Router, private route: ActivatedRoute, public media: ObservableMedia,
				private projectsDB: ProjectsDbService,
				private workingHoursDb: WorkingHoursDbService,
				private localStorage: LocalStorageService) {

		this.projectsSub = this.projectsDB.dataChange.subscribe(data => {
			this.projects = data;
		});

		this.dateSub = this.route.params.subscribe(params => {
			this.encodedDate = params['date'];
			this.date = Utility.decodeDate(params['date']);

			const filter = new WorkingHoursFilter();
			filter.date = this.encodedDate;
			this.workingHoursDb.getWorkingHours(filter).then(() => {
				this.workingHoursSub = this.workingHoursDb.dataChange.subscribe(data => {
					this.works = [];
					const newCard = this.localStorage.getItem(this.encodedDate);
					if (newCard) {
						this.works = [newCard].concat(data);
						this.newCard = true;
					} else {
						this.works = data;
						this.newCard = false;
					}
				});
			});
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
		const newWork = new Work(this.encodedDate);
		newWork.from = Utility.getCurrentTimeString();
		this.works.unshift(newWork);
		this.newCard = true;
	};

	saveWork(work: Work): void {
		if (work.hasOwnProperty('_id')) {
			this.workingHoursDb.updateWorkingHour(work);
		} else {
			this.localStorage.deleteItem(work.date);
			this.workingHoursDb.createWorkingHour(work);
			this.newCard = false;
		}
	}

	persistNewWork(work: Work): void {
		this.localStorage.saveItem(work.date, work);
	}

	deleteWork(work: Work): void {
		if (work.hasOwnProperty('_id')) {
			this.workingHoursDb.deleteWorkingHour(work);
		} else {
			this.localStorage.deleteItem(work.date);
			this.works.shift();
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
		this.projectsSub.unsubscribe();
		this.workingHoursSub.unsubscribe();
		this.mediaSub.unsubscribe();
	}
}

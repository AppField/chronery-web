import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Utility } from '../../utils/utility';
import { Work } from '../../models/work';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription } from 'rxjs/Subscription';
import { MdSidenav } from '@angular/material';
import { WorkingHoursDbService } from '../../services/working-hours-db/working-hours-db.service';
import { Project } from '../../models/project';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { WorkingHoursFilter } from '../../models/working-hours-filter';
import { Comment } from '../../models/comment';
import { ProjectsService } from '../../services/projects/projects.service';
import { CommentsService } from '../../services/comments/comments.service';

@Component({
	selector: 'chy-working-hours',
	templateUrl: './working-hours.component.html',
	styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit, OnDestroy {
	@ViewChild('subsidenav') subsidenav: MdSidenav;

	date: Date;
	encodedDate: string;
	works: Work[];
	projects: Project[] = [];
	comments: Comment[] = [];
	sidenavMode = 'side';
	newCard: boolean;
	async: any;

	private dateSub: Subscription;
	private projectsSub: Subscription;
	private commentsSub: Subscription;
	private mediaSub: Subscription;

	constructor(private route: ActivatedRoute, public media: ObservableMedia,
				private projectsService: ProjectsService,
				private workingHoursDb: WorkingHoursDbService,
				private commentsService: CommentsService,
				private localStorage: LocalStorageService) {

		this.projectsSub = this.projectsService.dataChange.subscribe(data => {
			this.projects = data;
		});

		this.commentsSub = this.commentsService.dataChange.subscribe(data => {
			this.comments = data;
		});

		this.dateSub = this.route.params.subscribe(params => {
			this.encodedDate = params['date'];
			this.date = Utility.decodeDate(params['date']);

			const filter = new WorkingHoursFilter();
			filter.date = this.encodedDate;
			this.workingHoursDb.getWorkingHoursData(filter).then((data) => {
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
		this.commentsSub.unsubscribe();
		this.mediaSub.unsubscribe();
	}
}

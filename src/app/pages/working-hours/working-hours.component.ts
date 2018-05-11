import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Utility } from '../../utils/utility';
import { MediaChange, ObservableMedia } from '@angular/flex-layout';
import { Subscription ,  Subject } from 'rxjs';
import { MatSidenav } from '@angular/material';
import { LocalStorageService } from '../../services/local-storage/local-storage.service';
import { ProjectsService } from '../../services/projects/projects.service';
import { CommentsService } from '../../services/comments/comments.service';
import { WorkingHours } from '../../models/working-hours';
import { WorkingHoursService } from '../../services/working-hours/working-hours.service';

import * as moment from 'moment';
import { Moment } from 'moment';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'chy-working-hours',
  templateUrl: './working-hours.component.html',
  styleUrls: ['./working-hours.component.scss']
})
export class WorkingHoursComponent implements OnInit, OnDestroy {
  @ViewChild('subsidenav') subsidenav: MatSidenav;
  date: Moment;
  encodedDate: string;
  works: WorkingHours[] = [];
  sidenavMode = 'side';
  newCard: boolean;
  async: any;
  isLoading = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  private mediaSub: Subscription;

  constructor(private route: ActivatedRoute, public media: ObservableMedia,
              private router: Router,
              public projectsService: ProjectsService,
              public workingHoursService: WorkingHoursService,
              public commentsService: CommentsService,
              private localStorage: LocalStorageService) {

    // this.workingHoursService.dataIsLoading
    //   .takeUntil(this.destroy$)
    //   .subscribe((isLoading: boolean) => this.isLoading = isLoading);

    this.workingHoursService.dataChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        const newCard = this.localStorage.getItem(this.encodedDate);
        if (newCard) {
          this.works = data ? [newCard].concat(data.slice().reverse()) : [newCard];
          this.newCard = true;
        } else {
          this.works = data ? data.slice().reverse() : [];
          this.newCard = false;
        }
      });

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.encodedDate = params['date'] ? params['date'] : Utility.encodeDate(moment());
        this.date = Utility.decodeDate(params['date']);
        this.workingHoursService.onRetrieveData(this.encodedDate);
      });
  }

  ngOnInit() {
    this.mediaSub = this.media
      .subscribe((change: MediaChange) => {
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
  }

  saveWork(work: WorkingHours): void {
    if (work.hasOwnProperty('id')) {
      this.workingHoursService.onUpdateData(work, this.encodedDate);
    } else {
      this.localStorage.deleteItem(this.encodedDate);
      this.workingHoursService.onStoreData(work, this.encodedDate);
      this.newCard = false;
    }
  }

  persistNewWork(work: WorkingHours): void {
    this.localStorage.saveItem(this.encodedDate, work);
  }

  deleteWork(work: WorkingHours): void {
    if (work.hasOwnProperty('id')) {
      this.workingHoursService.onDeleteData(work, this.encodedDate);
    } else {
      this.localStorage.deleteItem(this.encodedDate);
      this.works.shift();
      this.newCard = false;
    }
  }

  setActiveDateToToday(): void {
    const encodedDate = Utility.encodeDate(moment());
    this.router.navigate(['working-hours', encodedDate]);
  }

  checkSubsidenav(): void {
    if (this.sidenavMode === 'over'
    ) {
      this.subsidenav.close();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.mediaSub.unsubscribe();
  }
}

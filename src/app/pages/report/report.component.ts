import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment/moment';
import { Project } from '../../models/project';
import { Observable } from 'rxjs/Observable';
import { FormControl } from '@angular/forms';
import { Utility } from '../../utils/utility';
import { Angular2Csv } from 'angular2-csv';
import { ObservableMedia } from '@angular/flex-layout';
import { ProjectsService } from '../../services/projects/projects.service';
import { WorkingHoursService } from '../../services/working-hours/working-hours.service';
import { WorkingHours } from '../../models/working-hours';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';
import { ReportPdfDialogComponent } from '../../components/report-pdf-dialog/report-pdf-dialog.component';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Moment } from 'moment';
import { _isNumberValue } from '@angular/cdk/coercion';
import { DecimalPipe } from '@angular/common';


@Component({
  selector: 'chy-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit, AfterViewInit, OnDestroy {
  date: Date;
  startDate: Moment;
  endDate: Moment;
  projects: Project[] = [];
  filteredProjects: Observable<Project[]>;
  selectedProject: Project;
  projectsCtrl: FormControl;
  totalSpent: string = null;
  isLoading = false;
  dataSource = new NestedObjectsDataSource();
  displayedColumns = ['date', 'from', 'to', 'spent', 'project.number', 'project.name', 'comment'];
  decimalFormat = true;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private projectsService: ProjectsService,
              private workingHoursService: WorkingHoursService,
              private media: ObservableMedia,
              public dialog: MatDialog,
              private numberPipe: DecimalPipe) {

    // initialize start and end date for the date pickers
    this.startDate = moment().startOf('month');
    this.endDate = moment().endOf('month');

    this.projectsCtrl = new FormControl();
    const allProjects = new Project(null, null, null, '');
    this.selectedProject = allProjects;
    this.projects = [allProjects];

    this.projectsService.dataChange
      .takeUntil(this.destroy$)
      .subscribe((data: Project[]) => {
        this.projects = data ? this.projects.concat(data) : this.projects;
        this.filteredProjects = this.projectsCtrl.valueChanges
          .startWith(null)
          .map(project => project && typeof project === 'object' ? project.name : project)
          .map(name => name ? this.filterProjects(name) : this.projects.slice());

      });
    this.updateReport();
  }

  get isMobile(): boolean {
    return !this.media.isActive('gt-sm');
  }

  getValueForTimeFormat(time: string): string {
    return this.decimalFormat ? this.numberPipe.transform(Utility.convertTimeToDecimal(time), '2.2') : time;
  }

  ngOnInit() {
    this.workingHoursService.dataIsLoading
      .takeUntil(this.destroy$)
      .subscribe((isLoading: boolean) => this.isLoading = isLoading);

    this.workingHoursService.filterChange
      .takeUntil(this.destroy$)
      .subscribe((reportData: WorkingHours[]) => {
        this.dataSource.data = reportData;

        const times = reportData.map((work: WorkingHours) => {
          return work.spent;
        });
        this.totalSpent = times.length ? Utility.sumTotalTimes(times) : null;
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  updateReport(): void {
    if (!this.startDate && !this.endDate) {
      return;
    }

    const from = Utility.encodeDate(this.startDate);
    const to = Utility.encodeDate(this.endDate);

    this.workingHoursService.onFilterData(from, to);
  }

  updateProjectFilter(): void {
    this.workingHoursService.onFilterDataByProject(this.selectedProject);
  }

  filterProjects(val: string) {
    return this.projects.filter(project => new RegExp(val, 'i').test(project.name));
  }

  displayFn(project: Project) {
    if (project) {
      return project.name ? project.name : '';
    }
  }

  downloadPDF(): void {
    const dialogRef = this.dialog.open(ReportPdfDialogComponent, {
      data: [...this.workingHoursService.filterChange.value],
      closeOnNavigation: true
    });
  }

  exportReportToCSV(): void {
    const data = this.workingHoursService.dataChange.getValue();
    const csvData = data.map((work: WorkingHours) => {
      const csvObject: any = {};
      csvObject.date = work.date;
      csvObject.from = work.from;
      csvObject.to = work.to;
      csvObject.spent = work.spent;
      csvObject.comment = work.comment || '';
      csvObject.projectId = work.project.id;
      csvObject.projectNumber = work.project.number;
      csvObject.projectName = work.project.name;
      return csvObject;
    });
    const report = new Angular2Csv(csvData, `Chronery Report form ${Utility.encodeDate(this.startDate)} to ${Utility.encodeDate(this.endDate)}`, { showLabels: true });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

export class NestedObjectsDataSource extends MatTableDataSource<WorkingHours> {

  sortingDataAccessor: ((data: WorkingHours, sortHeaderId: string) => string | number) =
    (data: WorkingHours, sortHeaderId: string): string | number => {
      let value = null;
      if (sortHeaderId.indexOf('.') !== -1) {
        const ids = sortHeaderId.split('.');
        value = data[ids[0]][ids[1]];
      } else {
        value = data[sortHeaderId];
      }
      return _isNumberValue(value) ? Number(value) : value;
    }

  constructor() {
    super();
  }
}

//
//
// export class ReportSource extends DataSource<any> {
//     totalTime = '00:00';
//     private _filterChange = new BehaviorSubject(new Project);
//
//     constructor(private workingHoursService: WorkingHoursService) {
//         super();
//     }
//
//     get filter(): Project {
//         return this._filterChange.value;
//     }
//
//     set filter(filter: Project) {
//         this._filterChange.next(filter);
//     }
//
//     connect(): Observable<WorkingHours[]> {
//         const displayDataChanges = [
//             this.workingHoursService.dataChange,
//             this._filterChange
//         ];
//
//         return Observable.merge(...displayDataChanges).map(() => {
//             if (this.workingHoursService.data) {
//                 let data = [];
//                 if (this.filter.id) {
//                     data = this.workingHoursService.data.slice().filter((item: WorkingHours) => {
//                         return item.project.id === this.filter.id || !this.filter.id;
//                     });
//                 } else {
//                     data = this.workingHoursService.data;
//                 }
//                 const times = data.map((work: WorkingHours) => {
//                     return work.spent;
//                 });
//                 this.totalTime = times.length ? Utility.sumTotalTimes(times) : '00:00';
//                 return data;
//             } else {
//                 this.totalTime = '00:00';
//                 return [];
//             }
//         });
//     }
//
//     disconnect() {
//     }
// }

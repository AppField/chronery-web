import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Project } from '../../models/project';






import { MatCheckbox, MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ProjectDialogComponent } from '../../components/project-modal/project-dialog.component';
import { ObservableMedia } from '@angular/flex-layout';
import { ProjectsService } from '../../services/projects/projects.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


@Component({
  selector: 'chy-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['number', 'name', 'inactive', 'edit'];
  dataSource = new MatTableDataSource<Project>();
  isLoading = false;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public dialog: MatDialog,
              private projectsService: ProjectsService,
              private media: ObservableMedia) {
  }

  ngOnInit() {
    this.projectsService.dataIsLoading
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading: boolean) => this.isLoading = isLoading);

    this.projectsService.dataChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((projects: Project[]) => {
        this.dataSource.data = projects ? projects : [];
      });
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onInactiveChange(inactive: MatCheckbox): void {
    this.projectsService.onRetrieveData(inactive.checked);
  }

  trackByFn(index, item): string {
    return item.id;
  }

  editProject(project: Project): void {
    this.openProjectDialog(project);
  }


  editMobileProject(project: Project): void {
    if (!this.media.isActive('gt-sm')) {
      this.openProjectDialog(project);
    }
  }

  openProjectDialog(project: Project = new Project()): void {
    const dialogRef = this.dialog.open(ProjectDialogComponent, {
      data: project
    });
    dialogRef.afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        if (result) {
          if (result.userId) {
            this.projectsService.onUpdateData(result);
          } else {
            this.projectsService.onStoreData(result);
          }
        }
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

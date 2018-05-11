import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './user/auth.service';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { WindowRef } from './services/window-ref/window-ref.service';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { TranslatePipe } from './pipes/translate/translate.pipe';


@Component({
  selector: 'chy-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService,
              private winRef: WindowRef,
              private swUpdate: SwUpdate,
              private snackBar: MatSnackBar,
              private translatePipe: TranslatePipe) {
  }

  ngOnInit() {
    // this.authService.initAuth();

    if (environment.production || environment.test) {
      this.swUpdate.available
        .pipe(takeUntil(this.destroy$))
        .subscribe(event => {

          console.log('[App] Update available: current version is', event.current, 'available version is', event.available);
          const snackBarRef = this.snackBar.open(this.translatePipe.transform('updateAvailable'), this.translatePipe.transform('updateRefresh'));

          snackBarRef.onAction().subscribe(() => {
            this.winRef.nativeWindow.location.reload();
          });

        });
      this.swUpdate.checkForUpdate();
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}

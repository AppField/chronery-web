import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './user/auth.service';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { WindowRef } from './services/window-ref/window-ref.service';
import { Subject } from 'rxjs/Subject';
import { environment } from '../environments/environment';

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
              private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    // this.authService.initAuth();

    if (environment.production || environment.test) {
      this.swUpdate.available
        .takeUntil(this.destroy$)
        .subscribe(event => {

          console.log('[App] Update available: current version is', event.current, 'available version is', event.available);
          const snackBarRef = this.snackBar.open('Newer version of the app is available', 'Refresh');

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

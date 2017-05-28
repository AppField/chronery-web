import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import 'hammerjs';

import {AppComponent} from './app.component';
import {SummaryComponent} from './pages/summary/summary.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {HoursOfWorkComponent} from './pages/hours-of-work/hours-of-work.component';
import {DateParamService} from './services/date-param/date-param.service';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

@NgModule({
	declarations: [
		AppComponent,
		// AppbarComponent,
		// SidenavComponent,
		// SidenavDaypickerComponent,
		// MonthYearDialogComponent,
		// SummaryComponent,
		// SettingsComponent,
		// HoursOfWorkComponent,
		// WorkCardComponent,
		DashboardComponent
	],
	entryComponents: [DashboardComponent],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		IonicModule.forRoot(AppComponent)
	],
	providers: [DateParamService, { provide: ErrorHandler, useClass: IonicErrorHandler}],
	bootstrap: [IonicApp]
})
export class AppModule {
}

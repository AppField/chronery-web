///<reference path="../../node_modules/@angular/material/module.d.ts"/>
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule, Routes} from '@angular/router';

import 'hammerjs';

import {AppComponent} from './app.component';
import {AppbarComponent} from './components/appbar/appbar.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {SidenavDaypickerComponent} from './components/sidenav-daypicker/sidenav-daypicker.component';
import {MonthYearDialogComponent} from './components/month-year-dialog/month-year-dialog.component';
import {SummaryComponent} from './pages/summary/summary.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {HoursOfWorkComponent} from './pages/hours-of-work/hours-of-work.component';
import {AppRoutingModule} from './app-routing.module';
import {DateParamService} from './services/date-param/date-param.service';
import { WorkCardComponent } from './components/work-card/work-card.component';

@NgModule({
	declarations: [
		AppComponent,
		AppbarComponent,
		SidenavComponent,
		SidenavDaypickerComponent,
		MonthYearDialogComponent,
		SummaryComponent,
		SettingsComponent,
		HoursOfWorkComponent,
		WorkCardComponent
	],
	entryComponents: [MonthYearDialogComponent],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		BrowserAnimationsModule,
		MaterialModule,
		AppRoutingModule
	],
	providers: [DateParamService],
	bootstrap: [AppComponent]
})
export class AppModule {
}

import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {
	MdButtonModule,
	MdDialogModule,
	MdSidenavModule,
	MdIconModule,
	MdMenuModule,
	MdCardModule,
	MdAutocompleteModule,
	MdInputModule,
	MdTabsModule,
	MdListModule,
	MdToolbarModule
} from '@angular/material';

import 'hammerjs';

import {AppComponent} from './app.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {SidenavDaypickerComponent} from './components/sidenav-daypicker/sidenav-daypicker.component';
import {MonthYearDialogComponent} from './components/month-year-dialog/month-year-dialog.component';
import {ReportComponent} from './pages/report/report.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {WorkingHoursComponent} from './pages/working-hours/working-hours.component';
import {AppRoutingModule} from './app-routing.module';
import {WorkCardComponent} from './components/work-card/work-card.component';
import {NavlistComponent} from './components/navlist/navlist.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';

@NgModule({
	declarations: [
		AppComponent,
		SidenavComponent,
		SidenavDaypickerComponent,
		MonthYearDialogComponent,
		ReportComponent,
		SettingsComponent,
		WorkingHoursComponent,
		WorkCardComponent,
		NavlistComponent,
		DashboardComponent,
		ProjectsComponent
	],
	entryComponents: [MonthYearDialogComponent],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		HttpModule,
		BrowserAnimationsModule,
		MdButtonModule, MdDialogModule, MdSidenavModule, MdIconModule, MdMenuModule, MdCardModule, MdAutocompleteModule, MdInputModule,
		MdTabsModule, MdListModule, MdToolbarModule,
		AppRoutingModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}

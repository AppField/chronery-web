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
import {AppbarComponent} from './components/appbar/appbar.component';
import {SidenavComponent} from './components/sidenav/sidenav.component';
import {SidenavDaypickerComponent} from './components/sidenav-daypicker/sidenav-daypicker.component';
import {MonthYearDialogComponent} from './components/month-year-dialog/month-year-dialog.component';
import {SummaryComponent} from './pages/summary/summary.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {HoursOfWorkComponent} from './pages/hours-of-work/hours-of-work.component';
import {AppRoutingModule} from './app-routing.module';
import {DateParamService} from './services/date-param/date-param.service';
import {WorkCardComponent} from './components/work-card/work-card.component';

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
		ReactiveFormsModule,
		HttpModule,
		BrowserAnimationsModule,
		MdButtonModule, MdDialogModule, MdSidenavModule, MdIconModule, MdMenuModule, MdCardModule, MdAutocompleteModule, MdInputModule,
		MdTabsModule, MdListModule, MdToolbarModule,
		AppRoutingModule
	],
	providers: [DateParamService],
	bootstrap: [AppComponent]
})
export class AppModule {
}

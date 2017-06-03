import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';
import {SideNavPage} from '../pages/side-nav/side-nav';
import { DayPickerPage } from '../pages/day-picker/day-picker';
import { WorkCardComponent } from '../components/work-card/work-card';

@NgModule({
	declarations: [
		MyApp,
		SideNavPage,
		DayPickerPage,
    WorkCardComponent
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp, 
		SideNavPage, 
		DayPickerPage
	],
	providers: [
		{provide: ErrorHandler, useClass: IonicErrorHandler}
	]
})
export class AppModule {
}

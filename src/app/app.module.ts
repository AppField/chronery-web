///<reference path="../../node_modules/@angular/material/module.d.ts"/>
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {MaterialModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import 'hammerjs';

import {AppComponent} from './app.component';
import { AppbarComponent } from './components/appbar/appbar.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SidenavDaypickerComponent } from './components/sidenav-daypicker/sidenav-daypicker.component';

@NgModule({
	declarations: [
		AppComponent,
		AppbarComponent,
		SidenavComponent,
		SidenavDaypickerComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		BrowserAnimationsModule,
		MaterialModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule {
}

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HoursOfWorkComponent} from './pages/hours-of-work/hours-of-work.component';
import {SummaryComponent} from './pages/summary/summary.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';

const routes: Routes = [
	{
		path: 'dashboard',
		component: DashboardComponent
	},
	{
		path: 'working-hours',
		component: HoursOfWorkComponent,
	},
	{
		path: 'summary',
		component: SummaryComponent
	},
	{
		path: 'settings',
		component: SettingsComponent
	},
	{
		path: '**',
		redirectTo: '/dashboard',
		pathMatch: 'full'
	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [
		RouterModule
	]
})
export class AppRoutingModule {
}

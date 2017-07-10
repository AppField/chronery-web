import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {WorkingHoursComponent} from './pages/working-hours/working-hours.component';
import {ReportComponent} from './pages/report/report.component';
import {SettingsComponent} from './pages/settings/settings.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {ProjectsComponent} from './pages/projects/projects.component';

const routes: Routes = [
	{
		path: 'dashboard',
		component: DashboardComponent
	},
	{
		path: 'working-hours',
		component: WorkingHoursComponent,
	},
	{
		path: 'working-hours/:date',
		component: WorkingHoursComponent
	},
	{
		path: 'report',
		component: ReportComponent
	},
	{
		path: 'projects',
		component: ProjectsComponent
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

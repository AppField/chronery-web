import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HoursOfWorkComponent} from './pages/hours-of-work/hours-of-work.component';
import {SummaryComponent} from './pages/summary/summary.component';
import {Utility} from './utils/utility';

const routes: Routes = [
		{
			path: 'hours-of-work',
			redirectTo: 'hours-of-work/' + Utility.encodeDate(new Date()),
		},
		{
			path: 'hours-of-work/:date',
			component: HoursOfWorkComponent,
		},
		{
			path: 'summary/:date',
			component: SummaryComponent
		},
		{
			path: '',
			redirectTo: 'hours-of-work/' + Utility.encodeDate(new Date()),
			pathMatch: 'full'
		},
		{
			path: '**',
			redirectTo: 'hours-of-work/' + Utility.encodeDate(new Date()),
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

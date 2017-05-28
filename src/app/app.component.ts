import {Component} from '@angular/core';
import {DashboardComponent} from './pages/dashboard/dashboard.component';

@Component({
	templateUrl: './app.component.html',
})
export class AppComponent {
	rootPage = DashboardComponent;
}

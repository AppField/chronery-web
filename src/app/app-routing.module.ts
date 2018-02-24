import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkingHoursComponent } from './pages/working-hours/working-hours.component';
import { ReportComponent } from './pages/report/report.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { AuthenticateComponent } from './user/authenticate/authenticate.component';
import { AuthGuard } from './user/auth-guard.service';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ImprintComponent } from './pages/imprint/imprint.component';

const routes: Routes = [
  {
    path: '',
    component: SidenavComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      },
      {
        path: 'working-hours',
        component: WorkingHoursComponent
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
        path: 'imprint',
        component: ImprintComponent
      }
    ]
  },
  {
    path: 'login',
    component: AuthenticateComponent,
  },
  {
    path: '**',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}

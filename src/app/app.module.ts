import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import 'hammerjs';

import { AppComponent } from './app.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SidenavDaypickerComponent } from './components/sidenav-daypicker/sidenav-daypicker.component';
import { MonthYearDialogComponent } from './components/month-year-dialog/month-year-dialog.component';
import { ReportComponent } from './pages/report/report.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { WorkingHoursComponent } from './pages/working-hours/working-hours.component';
import { AppRoutingModule } from './app-routing.module';
import { WorkCardComponent } from './components/work-card/work-card.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { ProjectDialogComponent } from './components/project-modal/project-dialog.component';
import { MaterialActiveDirective } from './directives/material-active/material-active.directive';
import { LocalStorageService } from './services/local-storage/local-storage.service';
import { EncodedDatePipe } from './pipes/encoded-date/encoded-date.pipe';
import { WorkingHoursChartComponent } from './components/working-hours-chart/working-hours-chart.component';
import { LoginComponent } from './user/login/login.component';
import { AuthService } from './user/auth.service';
import { RegisterComponent } from './user/register/register.component';
import { AuthenticateComponent } from './user/authenticate/authenticate.component';
import { ProjectsService } from './services/projects/projects.service';
import { CommentsService } from './services/comments/comments.service';
import { WorkingHoursService } from './services/working-hours/working-hours.service';
import { ConfirmAccountDeletionComponent } from './components/confirm-account-deletion/confirm-account-deletion.component';
import { ForgotPasswordDialogComponent } from './components/forgot-password-dialog/forgot-password-dialog.component';
import { ImprintComponent } from './pages/imprint/imprint.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { WindowRef } from './services/window-ref/window-ref.service';
import { RequestInterceptor } from './utils/request-interceptor';
import { ReportPdfDialogComponent } from './components/report-pdf-dialog/report-pdf-dialog.component';
import { MaterialModule } from './material.module';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from './pipes/translate/translate.pipe';

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
    DashboardComponent,
    ProjectsComponent,
    ProjectDialogComponent,
    MaterialActiveDirective,
    EncodedDatePipe,
    WorkingHoursChartComponent,
    LoginComponent,
    RegisterComponent,
    AuthenticateComponent,
    ConfirmAccountDeletionComponent,
    ForgotPasswordDialogComponent,
    ImprintComponent,
    ReportPdfDialogComponent,
    TranslatePipe
  ],
  entryComponents: [MonthYearDialogComponent, ProjectDialogComponent, ConfirmAccountDeletionComponent,
    ForgotPasswordDialogComponent, ReportPdfDialogComponent],
  imports: [
    BrowserModule,
    ServiceWorkerModule.register(environment.test ? '/chronery-web/ngsw-worker.js' : 'ngsw-worker.js', { enabled: environment.production || environment.test }),
    HttpClientModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule
  ],
  providers: [
    DecimalPipe,
    DatePipe,
    TranslatePipe,
    AuthService,
    WorkingHoursService,
    ProjectsService,
    CommentsService,
    LocalStorageService,
    WindowRef,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}

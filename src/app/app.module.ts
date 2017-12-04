import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
	MatButtonModule,
	MatDialogModule,
	MatSidenavModule,
	MatIconModule,
	MatMenuModule,
	MatCardModule,
	MatAutocompleteModule,
	MatInputModule,
	MatTabsModule,
	MatListModule,
	MatToolbarModule,
	MatTableModule,
	MatTooltipModule,
	MatDatepickerModule,
	MatNativeDateModule,
	MatProgressSpinnerModule,
	MatProgressBarModule,
	MatSnackBarModule,
	MatExpansionModule
} from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';

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
		ImprintComponent
	],
	entryComponents: [MonthYearDialogComponent, ProjectDialogComponent, ConfirmAccountDeletionComponent, ForgotPasswordDialogComponent],
	imports: [
		BrowserModule,
		HttpClientModule,
		FlexLayoutModule,
		FormsModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		MatButtonModule, MatDialogModule, MatSidenavModule, MatIconModule, MatMenuModule, MatCardModule, MatAutocompleteModule, MatInputModule,
		MatTabsModule, MatListModule, MatToolbarModule, MatTableModule, MatTooltipModule, MatDatepickerModule, MatNativeDateModule,
		AppRoutingModule, MatProgressSpinnerModule, MatProgressBarModule, MatSnackBarModule, MatExpansionModule,
		CdkTableModule
	],
	providers: [AuthService, WorkingHoursService, ProjectsService, CommentsService, LocalStorageService],
	bootstrap: [AppComponent]
})
export class AppModule {
}

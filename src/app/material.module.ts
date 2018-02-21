import { NgModule } from '@angular/core';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';
import { MAT_MOMENT_DATE_FORMATS, MomentDateAdapter } from "@angular/material-moment-adapter";

@NgModule({
    imports: [
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
        MatExpansionModule,
        MatCheckboxModule,
        MatSelectModule,
        MatSortModule,
        MatPaginatorModule,
    ],
    exports: [
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
        MatExpansionModule,
        MatCheckboxModule,
        MatSelectModule,
        MatSortModule,
        MatPaginatorModule
    ],
    providers: [
        // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
        // `MatMomentDateModule` in your applications root module. We provide it at the component level
        // here, due to limitations of our example generation script.
        { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
        { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    ],
})

export class MaterialModule {
}

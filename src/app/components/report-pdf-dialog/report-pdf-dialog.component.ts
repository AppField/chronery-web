import {AfterViewInit, Component, ElementRef, Inject, OnInit, QueryList, ViewChildren} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WorkingHours} from '../../models/working-hours';
import * as jspdf from 'jspdf';

// import * as html2canvas from 'html2canvas';

@Component({
    selector: 'chy-report-pdf-dialog',
    templateUrl: './report-pdf-dialog.component.html',
    styleUrls: ['./report-pdf-dialog.component.scss']
})
export class ReportPdfDialogComponent implements OnInit, AfterViewInit {
    pages: WorkingHours[][] = [[]];

    showDate = true;
    showFrom = false;
    showTo = false;
    showSpent = true;
    showProjectNumber = true;
    showProjectName = true;
    showComment = true;
    summarizeProjectsPerDay = false;

    @ViewChildren('reportPage') documents: QueryList<ElementRef>;

// order matters
    constructor(@Inject(MAT_DIALOG_DATA) public data: WorkingHours[],
                public dialogRef: MatDialogRef<ReportPdfDialogComponent>) {

        for (let i = 0; i < 20; i++) {
            this.pages[0] = this.pages[0].concat(data);
        }

// this.report = data;
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.calcPages(0, this.pages[0]);
    }

    calcPages(pageIndex: number, pages: WorkingHours[]): void {
        const doc = this.documents.last.nativeElement;
        const docRectBottom = doc.getBoundingClientRect().bottom;
        const rows = doc.querySelectorAll('tr');

        let index = 0;
        let rowBottom;
        do {
            rowBottom = rows[index].getBoundingClientRect().bottom;
            console.log('Outside: ', rowBottom >= (docRectBottom - 40));
            index++;
        } while (rowBottom <= (docRectBottom - 150));

        const rest = pages.slice(index, pages.length);
        this.pages[pageIndex] = pages.slice(0, index);

        if (rest.length > 0) {
            this.calcPages(++pageIndex, rest);
        }
    }

    downloadPDF(): void {
        const pdf = new jspdf('landscape');

        pdf.save(`Chronery Report`);
    }
}

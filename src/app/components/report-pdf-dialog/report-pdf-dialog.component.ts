import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {WorkingHours} from '../../models/working-hours';
import {AuthService} from '../../user/auth.service';
import {Utility} from '../../utils/utility';

declare var jsPDF: any; // Important

@Component({
    selector: 'chy-report-pdf-dialog',
    templateUrl: './report-pdf-dialog.component.html',
    styleUrls: ['./report-pdf-dialog.component.scss']
})
export class ReportPdfDialogComponent implements OnInit {
    pages: WorkingHours[][] = [[]];
    reportData: WorkingHours[] = [];

    showDate = true;
    showFrom = true;
    showTo = true;
    showSpent = true;
    showProjectNumber = true;
    showProjectName = true;
    showComment = true;
    summarizeProjectsPerDay = true;

// order matters
    constructor(@Inject(MAT_DIALOG_DATA) public data: WorkingHours[],
                public dialogRef: MatDialogRef<ReportPdfDialogComponent>,
                private authService: AuthService) {

        for (let i = 0; i < 20; i++) {
            this.pages[0] = this.pages[0].concat(data);
            this.reportData = this.reportData.concat(data);
        }

// this.report = data;
    }

    ngOnInit() {
    }

    async downloadPDF() {
        try {
            const pdf = await this.generatePDF();

            pdf.save(`Chronery Report`);
        } catch (err) {
            console.error(err);
        }
    }

    async generatePDF() {
        const pdf = new jsPDF('landscape');
        const totalPagesExp = '{total_pages_count_string}';

        const user = await this.authService.getUserAttributes();

        const pageContent = function (data) {
            // Header
            pdf.setFontSize(24);
            pdf.setTextColor(40);
            pdf.setFontStyle('normal');
            pdf.text('Chronery Report', 15, 18);


            // Footer
            let str = 'Page ' + data.pageCount;
            str += ' of ' + totalPagesExp;
            pdf.setFontSize(10);
            pdf.text(str, 20, pdf.internal.pageSize.height - 10);

            // Add User name and print date centered
            const printDate = Utility.getDateString(new Date());
            const footerText = user.family_name + ' ' + user.given_name + ' - ' + 'Printdate: ' + printDate;
            pdf.setFontSize(10);
            const xOffset = (pdf.internal.pageSize.width / 2);
            pdf.text(footerText, xOffset, pdf.internal.pageSize.height - 10, 'center');
        };

        pdf.autoTable(this.getColumns(), this.getData(), {
            addPageContent: pageContent,
            // startY: 28,
            margin: {top: 30},
            headerStyles: {
                fillColor: [0, 150, 136]
            },
            showHeader: 'everyPage'
        });

        pdf.putTotalPages(totalPagesExp);

        return pdf;
    }

    private getColumns() {
        const columns = [];
        if (this.showDate) {
            columns.push({title: 'Date', dataKey: 'date'});
        }
        if (this.showProjectNumber) {
            columns.push({title: 'Project Number', dataKey: 'projectNumber'});
        }
        if (this.showProjectName) {
            columns.push({title: 'Project Name', dataKey: 'projectName'});
        }
        if (this.showComment) {
            columns.push({title: 'Comment', dataKey: 'comment'});
        }
        if (this.showFrom) {
            columns.push({title: 'From', dataKey: 'from'});
        }
        if (this.showTo) {
            columns.push({title: 'To', dataKey: 'to'});
        }
        if (this.showSpent) {
            columns.push({title: 'Hours', dataKey: 'spent'});
        }
        return columns;
    }

    private getData() {
        if (this.summarizeProjectsPerDay) {
            return this.reportData.map((item: WorkingHours) => {
                return {
                    ...item,
                    projectNumber: item.project.number,
                    projectName: item.project.name
                };
            });
        } else {

        }
    }
}

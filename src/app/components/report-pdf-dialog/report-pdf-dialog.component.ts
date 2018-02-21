import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { WorkingHours } from '../../models/working-hours';
import { AuthService } from '../../user/auth.service';
import { Utility } from '../../utils/utility';
import { DecimalPipe } from '@angular/common';

declare var jsPDF: any; // Important

interface ReportData {
    id: string;
    date: string;
    comment: string;
    projectNumber: string;
    projectName: string;
    from: string;
    to: string;
    spent: string;
    project: {
        id: string;
        number: string;
        name: string;
    };
}

@Component({
    selector: 'chy-report-pdf-dialog',
    templateUrl: './report-pdf-dialog.component.html',
    styleUrls: ['./report-pdf-dialog.component.scss']
})
export class ReportPdfDialogComponent implements OnInit {
    pages: WorkingHours[][] = [[]];
    reportData: WorkingHours[] = [];
    totalTime = '00:00';

    showDate = true;
    showProjectNumber = true;
    showProjectName = true;
    showComment = true;
    showFrom = false;
    showTo = false;
    showSpent = true;
    decimalFormat = true;
    // summarizeProjectsPerDay = true;

// order matters
    constructor(@Inject(MAT_DIALOG_DATA) public data: WorkingHours[],
                public dialogRef: MatDialogRef<ReportPdfDialogComponent>,
                private authService: AuthService,
                private numberPipe: DecimalPipe) {
        this.reportData = data;
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
            margin: { top: 30 },
            headerStyles: {
                fillColor: [0, 150, 136]
            },
            showHeader: 'everyPage'
        });

        if (this.totalTime) {
            const tableEndPosY = pdf.autoTableEndPosY() + 7;
            pdf.setFontSize(10);
            pdf.setFontStyle('bold');
            pdf.text(`Total: ${this.totalTime} h`, 265, tableEndPosY, 'right');
        }

        pdf.putTotalPages(totalPagesExp);
        return pdf;
    }

    private getColumns() {
        const columns = [];
        if (this.showDate) {
            columns.push({ title: 'Date', dataKey: 'date' });
        }
        if (this.showProjectNumber) {
            columns.push({ title: 'Project Number', dataKey: 'projectNumber' });
        }
        if (this.showProjectName) {
            columns.push({ title: 'Project Name', dataKey: 'projectName' });
        }
        if (this.showComment) {
            columns.push({ title: 'Comment', dataKey: 'comment' });
        }
        if (this.showFrom) {
            columns.push({ title: 'From', dataKey: 'from' });
        }
        if (this.showTo) {
            columns.push({ title: 'To', dataKey: 'to' });
        }
        if (this.showSpent) {
            columns.push({ title: 'Hours', dataKey: 'spent' });
        }
        return columns;
    }

    private getData(): ReportData[] {
        // if (!this.summarizeProjectsPerDay) {
        const times: string[] = [];
        const data: ReportData[] = this.reportData.map((item: WorkingHours) => {
            times.push(item.spent);
            return {
                ...item,
                projectNumber: item.project.number,
                projectName: item.project.name,
                spent: this.decimalFormat ? this.numberPipe.transform(Utility.convertTimeToDecimal(item.spent), '2.2') + ' h' : item.spent + ' h'
            };
        });
        const totalTime = Utility.sumTotalTimes(times);
        this.totalTime = this.decimalFormat ? this.numberPipe.transform(Utility.convertTimeToDecimal(totalTime), '2.2') : totalTime;
        return data;
        // } else {
        //     const data: ReportData[] = [
        //         {
        //             ...this.reportData[0],
        //             projectNumber: this.reportData[0].project.number,
        //             projectName: this.reportData[0].project.name
        //         }
        //     ];
        //
        //     for (let i = 1; i < this.reportData.length; i++) {
        //         const item = this.reportData[i];
        //         if (item.date === this.reportData[i - 1].date && item.project.id === this.reportData[i - 1].project.id) {
        //             this.reportData[i - 1].spent = Utility.sumTimes([item.spent, this.reportData[i - 1].spent]);
        //         } else {
        //             data.push({
        //                 ...item,
        //                 projectNumber: item.project.number,
        //                 projectName: item.project.name
        //             });
        //         }
        //     }
        //     console.log('Data: ', data);
        //     return data;
        // }
    }
}

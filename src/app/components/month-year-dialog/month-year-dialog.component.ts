import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import * as moment from 'moment';
import { Moment } from 'moment';

@Component({
  selector: 'chy-month-year-dialog',
  templateUrl: './month-year-dialog.component.html',
  styleUrls: ['./month-year-dialog.component.scss']
})
export class MonthYearDialogComponent implements OnInit {
  selectedDate: Moment = moment();

  constructor(public dialogRef: MatDialogRef<MonthYearDialogComponent>) {
  }

  ngOnInit() {
  }

  nextMonth(): void {
    this.selectedDate = moment(this.selectedDate.month(this.selectedDate.month() + 1));
  }

  previousMonth(): void {
    this.selectedDate = moment(this.selectedDate.month(this.selectedDate.month() - 1));
  }

  nextYear(): void {
    this.selectedDate = moment(this.selectedDate.year(this.selectedDate.year() + 1));
  }

  previousYear(): void {
    this.selectedDate = moment(this.selectedDate.year(this.selectedDate.year() - 1));
  }
}

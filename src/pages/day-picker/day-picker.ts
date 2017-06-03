import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-day-picker',
  templateUrl: 'day-picker.html',
})
export class DayPickerPage {

  days: Date[];
  monthYear: Date = new Date();

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.getDays();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DayPickerPage');
  }


  private getDays() {
    this.days = [];
    // get list of days of current month
    const helperDate = new Date(this.monthYear);
    const currentMonth = helperDate.getMonth();
    helperDate.setDate(1);
    do {
      this.days.push(new Date(helperDate));

      helperDate.setDate(helperDate.getDate() + 1);
    } while (helperDate.getMonth() === currentMonth);
  }

}

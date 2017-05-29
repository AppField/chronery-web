import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage({
  name: 'working-hours'
})
@Component({
  selector: 'page-working-hours',
  templateUrl: 'working-hours.html',
})
export class WorkingHoursPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad WorkingHoursPage');
  }

}

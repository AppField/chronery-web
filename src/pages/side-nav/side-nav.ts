import {Component, OnInit} from '@angular/core';
import { NavController, NavParams, Events, IonicPage } from 'ionic-angular';
import { DayPickerPage } from '../day-picker/day-picker';

interface Page {
	icon: string,
	title: string,
	component: string,
	side: any
}

@Component({
	selector: 'page-side-nav',
	templateUrl: 'side-nav.html',
})
export class SideNavPage implements OnInit{

	pages: Page[];

	constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
		this.pages = [
			{icon: 'stats', title: 'Dashboard', component: 'dashboard', side: null},
			{icon: 'time', title: 'Working Hours', component: 'working-hours', side: DayPickerPage},
			{icon: 'paper', title: 'Reports', component: 'reports', side: null},
			{icon: 'settings', title: 'Settings', component: 'settings', side: null}
		];
	}

	ngOnInit()  {
		console.log(this.navCtrl.getActive().name);
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SideNavPage');
	}

	openPage(page: Page) {		
		if (page.side != null) this.navCtrl.push(page.side);;
		this.events.publish('page:navigate', page);
	}
}

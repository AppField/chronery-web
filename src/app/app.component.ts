import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'dashboard';

  pages: Array<{title: string, component: any}>;

  constructor() {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Dashboard', component: 'dashboard' },
      { title: 'Working Hours', component: 'working-hours'},
      { title: 'Reports', component: 'reports'},
      { title: 'Settings', component: 'settings'}
    ];

  }

  initializeApp() {

  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

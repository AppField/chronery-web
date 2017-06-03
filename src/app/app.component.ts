import { Component, ViewChild } from '@angular/core';
import { Nav, Events } from 'ionic-angular';
import { SideNavPage } from '../pages/side-nav/side-nav';


@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild('content') nav: Nav;

	rootPage: string = 'dashboard';
	sideRootPage: Component = SideNavPage;

	constructor(public events: Events) {
		this.initializeApp();

		events.subscribe('page:navigate', (page) => {
			this.nav.setRoot(page.component);
		})
	}

	initializeApp() {
	}
}

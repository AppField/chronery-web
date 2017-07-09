import {Component, OnInit} from '@angular/core';
import {Project} from '../../models/project';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {DataSource} from '@angular/cdk';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
	selector: 'wtc-projects',
	templateUrl: './projects.component.html',
	styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
	displayedColumns = ['id', 'number', 'name'];
	exampleDatabase = new ExampleProjectDatabase();
	dataSource: ExampleProjectSource | null;
	
	constructor() {
	}

	ngOnInit() {
		this.dataSource = new ExampleProjectSource(this.exampleDatabase);
	}

}

export class ExampleProjectDatabase {
	// Stream that emits whenever the data has been modified
	dataChange: BehaviorSubject<Project[]> = new BehaviorSubject<Project[]>([]);

	get data(): Project[] {
		return this.dataChange.value;
	}

	constructor() {
		// Fill up the database
		this.addProject(new Project(1, '52342', 'Landing Pages'));
		this.addProject(new Project(2, '1234', 'Maintenance Interface'),);
		this.addProject(new Project(3, '6576', 'Mobile Time Tracking app'),);
		this.addProject(new Project(4, '52342', 'TYPO3 Website'));
	}

	// Adds new project to the database
	addProject(project: Project) {
		const copiedData = this.data.slice();
		copiedData.push(project);
		this.dataChange.next(copiedData);
	}
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleProjectSource extends DataSource<any> {
	constructor(private _exampleDatabase: ExampleProjectDatabase) {
		super();
	}

	/** Connect function called by the table to retrieve one stream containing the data to render. */
	connect(): Observable<Project[]> {
		return this._exampleDatabase.dataChange;
	}

	disconnect() {
	}
}

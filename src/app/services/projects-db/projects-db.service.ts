import {Injectable} from '@angular/core';
import * as PouchDB from 'pouchdb';
import {Project} from '../../models/project';
import Database = PouchDB.Database;

@Injectable()
export class ProjectsDbService {

	data: any;
	db: Database<Project>;


	constructor() {
		this.db = new PouchDB('wtc-projects');

	}

	getProjects(): Promise<any> {
		if (this.data) {
			return Promise.resolve(this.data);
		}
		return new Promise(resolve => {
			this.db.allDocs({
				include_docs: true
			}).then((result) => {

				this.data = [];
				const docs = result.rows.map((row) => {
					this.data.push(row.doc);
				});
				resolve(this.data);
				this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
					this.handleChange(change);
				});
			}).catch((error) => {
				console.log(error);
			});
		});
	}

	createProject(project: Project): void {
		project._id = 'project' + Date.now();
		console.log(project);
		this.db.post(project).catch((error) => {
			console.log(error);
		});
	}

	updateProject(project: Project): void {
		this.db.put(project).catch((error) => {
			console.log(error);
		});
	}

	deleteProject(project: Project): void {
		this.db.remove(project).catch((error) => {
			console.log(error);
		})
	}

	handleChange(change) {
		let changedDoc = null;
		let changedIndex = null;

		this.data.forEach((doc, index) => {
			if (doc._id === change.id) {
				changedDoc = doc;
				changedIndex = index;
			}
		});
		// A document was deleted
		if (change.deleted) {
			this.data.splice(changedIndex, 1);
		} else {
			// a document was updated
			if (changedDoc) {
				this.data[changedIndex] = change.doc;
			} else {
				// a document was added
				this.data.push(change.doc);
			}
		}
	}

}













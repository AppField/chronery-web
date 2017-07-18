import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Work} from '../../models/work';
import * as PouchDB from 'pouchdb';
import * as PouchFind from 'pouchdb-find';
import Database = PouchDB.Database;
import FindResponse = PouchDB.Find.FindResponse;
PouchDB.plugin(PouchFind);

@Injectable()
export class WorkingHoursDbService {

	dataChange: BehaviorSubject<Work[]> = new BehaviorSubject<Work[]>([]);
	db: Database<Work>;

	constructor() {
		// this.db = new PouchDB('wtc-working-hours');
		// this.db.createIndex({
		// 	index: {fields: ['date', 'projectId']}
		// }).catch(error => {
		// 	console.log(error);
		// });
	}

	getWorkingHours(date: string): Promise<FindResponse<Work>> {
		return this.db.find({
			selector: {
				date: date
			}
		});
	}

	createWorkingHour(work: Work): void {
		work._id = 'workingHour' + Date.now();
		this.db.put(work).catch(error => {
			console.log(error);
		});
	}

	updateWorkingHour(work: Work) {
		this.db.put(work).catch(error => {
			console.log(error);
		});
	}

	deleteWorkingHour(work: Work) {
		this.db.remove(work).catch(error => {
			console.log(error);
		})
	}

	handleChange(change) {
		let changedDoc = null;
		let changedIndex = null;

		this.dataChange.getValue().forEach((doc, index) => {
			if (doc._id === change._id) {
				changedDoc = doc;
				changedIndex = index;
			}
		});
		const data = this.dataChange.getValue();
		// a document was deleted
		if (change.deleted) {
			data.splice(changedIndex, 1);
			this.dataChange.next(data);
		} else {
			// a document was updated
			data.push(change.doc);
			this.dataChange.next(data);
		}
	}

}

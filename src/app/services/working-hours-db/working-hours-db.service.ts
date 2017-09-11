import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Work } from '../../models/work';
import PouchDB from 'pouchdb';
import PouchDBFind from 'pouchdb-find';
import Database = PouchDB.Database;
import FindResponse = PouchDB.Find.FindResponse;
import { WorkingHoursFilter } from '../../models/working-hours-filter';


@Injectable()
export class WorkingHoursDbService {

	dataChange: BehaviorSubject<Work[]> = new BehaviorSubject<Work[]>([]);
	db: Database<Work>;

	get data(): Work[] {
		return this.dataChange.value;
	}

	constructor() {
		PouchDB.plugin(PouchDBFind);
		this.db = new PouchDB('chy-working-hours');
		this.db.createIndex({
			index: {fields: ['date', 'projectId']}
		}).then(() => {
			this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
				this.handleChange(change);
			});
		}).catch(error => {
			console.log(error);
		});
	}

	getWorkingHours(filter: WorkingHoursFilter): Promise<Work[]> {
		return new Promise<Work[]>(resolve => {
			const selectors = this.buildFilter(filter);

			return this.db.find({
				selector: selectors,
				sort: [{date: 'desc'}]
			}).then(data => {
				this.dataChange.next(data.docs);
				resolve(data.docs);
			});
		});
	}

	getWorkingHoursData(filter: WorkingHoursFilter): Promise<Work[]> {
		return new Promise<Work[]>(resolve => {
			const selectors = this.buildFilter(filter);

			return this.db.find({
				selector: selectors,
				sort: [{date: 'desc'}]
			}).then(data => {
				resolve(data.docs);
			});
		})
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
			if (doc._id === change.id) {
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
			if (changedDoc) {
				data[changedIndex] = change.doc;
				this.dataChange.next(data);
			} else {
				// a document was added
				data.unshift(change.doc);
				this.dataChange.next(data);
			}
		}
	}

	private buildFilter(filter) {
		let selectors: any = {};
		if (filter.date) {
			if (filter.toDate) {
				selectors = {
					'date': {
						$gte: filter.date,
						$lte: filter.toDate
					}
				}
			} else {
				selectors.date = filter.date;
			}
		}
		if (filter.project) {
			selectors['projectId'] = filter.project._id;
		}
		return selectors
	}

}

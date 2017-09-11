import { Injectable } from '@angular/core';
import { Comment } from '../../models/comment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import PouchDB from 'pouchdb';
import Database = PouchDB.Database;

@Injectable()
export class CommentsDbService {

	dataChange: BehaviorSubject<Comment[]> = new BehaviorSubject<Comment[]>([]);
	db: Database<Comment>;

	get data(): Comment[] {
		return this.dataChange.value;
	}

	constructor() {
		this.db = new PouchDB('chy-comments');
		this.db.allDocs({
			include_docs: true
		}).then((result) => {

			const data: Comment[] = [];
			result.rows.map((row) => {
				data.push(row.doc);
			});

			this.dataChange.next(data);
			this.db.changes({live: true, since: 'now', include_docs: true}).on('change', (change) => {
				this.handleChange(change);
			});
		}).catch((error) => {
			console.log(error);
		});
	}

	createComment(comment: Comment): void {
		comment._id = 'comment' + Date.now();
		this.db.put(comment).catch((error) => {
			console.log(error);
		});
	}

	updateComment(comment: Comment): void {
		this.db.put(comment).catch((error) => {
			console.log(error);
		});
	}

	deleteComment(comment: Comment): void {
		this.db.remove(comment).catch((error) => {
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
		// A document was deleted
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
				data.push(change.doc);
				this.dataChange.next(data);
			}

		}
	}
}
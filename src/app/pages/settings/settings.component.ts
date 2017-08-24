import { Component, OnInit } from '@angular/core';
import { Comment } from '../../models/comment';

@Component({
	selector: 'chy-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})


export class SettingsComponent implements OnInit {

	comments: Comment[];
	newComment: Comment = new Comment();


	constructor() {
		this.comments = [
			new Comment('1', 'Anfahrt'),
			new Comment('2', 'Abfahrt')
		]
	}

	ngOnInit() {
	}

	updateComments() {
		if (this.comments.length < 5) {
			this.comments.push(this.newComment);

			this.newComment = new Comment();
		}
	}

	removeComment(index: number) {
		this.comments.splice(index, 1);
	}

}

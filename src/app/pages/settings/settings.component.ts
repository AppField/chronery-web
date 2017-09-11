import { Component, OnInit } from '@angular/core';
import { Comment } from '../../models/comment';
import { CommentsDbService } from '../../services/comments-db/comments-db.service';

@Component({
	selector: 'chy-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})


export class SettingsComponent implements OnInit {

	newComment: Comment = new Comment();

	constructor(public commentsDB: CommentsDbService) {
	}

	ngOnInit() {
	}

	createComment(): void {
		this.newComment.value.trim();
		if (this.commentsDB.data.length < 5 && this.newComment.value !== '') {
			this.commentsDB.createComment(this.newComment);

			this.newComment = new Comment();
		}
	}

	updateComment(comment: Comment): void {
		if (comment.value !== '') {
			this.commentsDB.updateComment(comment);
		}
	}

	deleteComment(comment: Comment): void {
		this.commentsDB.deleteComment(comment);
	}

}

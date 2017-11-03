import { Component, OnInit } from '@angular/core';
import { Comment } from '../../models/comment';
import { CommentsService } from '../../services/comments/comments.service';

@Component({
	selector: 'chy-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})


export class SettingsComponent implements OnInit {
	newComment: Comment = new Comment();
	isLoading = false;

	constructor(public commentsService: CommentsService) {
	}

	ngOnInit() {
		this.commentsService.dataIsLoading.subscribe((isLoading: boolean) => this.isLoading = isLoading);
	}

	createComment(): void {
		this.newComment.comment = this.newComment.comment.trim();
		if (this.commentsService.data.length < 5 && this.newComment.comment !== '') {

			this.commentsService.onStoreData(this.newComment, () => {
				// Reset new comment
				this.newComment = new Comment();
			});


		}
	}

	updateComment(comment: Comment): void {
		comment.comment = comment.comment.trim();
		if (comment.comment !== '') {
			this.commentsService.onUpdateData(comment);
		}
	}

	deleteComment(comment: Comment): void {
		this.commentsService.onDeleteData(comment);
	}

}

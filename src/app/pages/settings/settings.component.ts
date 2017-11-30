import { Component, OnInit } from '@angular/core';
import { Comment } from '../../models/comment';
import { CommentsService } from '../../services/comments/comments.service';
import { ConfirmAccountDeletionComponent } from '../../components/confirm-account-deletion/confirm-account-deletion.component';
import { MdDialog } from '@angular/material';
import { AuthService } from '../../user/auth.service';

@Component({
	selector: 'chy-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss']
})


export class SettingsComponent implements OnInit {
	newComment: Comment = new Comment();
	isLoading = false;
	accountDeletFailed = false;

	constructor(public commentsService: CommentsService, public dialog: MdDialog, public authService: AuthService) {
	}

	ngOnInit() {
		this.commentsService.dataIsLoading.subscribe((isLoading: boolean) => this.isLoading = isLoading);

		this.authService.authDidFail.subscribe((didFail: boolean) => this.accountDeletFailed = didFail);
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

	deleteAccount(): void {
		const dialogRef = this.dialog.open(ConfirmAccountDeletionComponent);

		dialogRef.afterClosed().subscribe(result => {
			if (result) {
				// delete account
				this.authService.deleteAccount();
			}
		});
	}

}

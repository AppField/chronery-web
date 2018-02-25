import { Component, Inject, LOCALE_ID, OnDestroy, OnInit } from '@angular/core';
import { Comment } from '../../models/comment';
import { CommentsService } from '../../services/comments/comments.service';
import { ConfirmAccountDeletionComponent } from '../../components/confirm-account-deletion/confirm-account-deletion.component';
import { MatDialog } from '@angular/material';
import { AuthService } from '../../user/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../models/user';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'chy-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})


export class SettingsComponent implements OnInit, OnDestroy {
  newComment: Comment = new Comment();
  isLoading = false;
  accountForm: FormGroup;
  attributes: User;
  lang: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public commentsService: CommentsService,
              public dialog: MatDialog,
              public authService: AuthService,
              private fb: FormBuilder,
              @Inject(LOCALE_ID) locale: string) {
    this.lang = locale;
  }

  ngOnInit() {
    this.commentsService.dataIsLoading
      .takeUntil(this.destroy$)
      .subscribe((isLoading: boolean) => this.isLoading = isLoading);

    // this.authService.authDidFail.subscribe((didFail: boolean) => this.accountDeletFailed = didFail);

    this.accountForm = this.fb.group({
      given_name: ['', [Validators.required]],
      family_name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });

    this.authService.getUserAttributes().then((attributes: User) => {
      if (!attributes) {
        return;
      }
      this.attributes = attributes;
      this.accountForm = this.fb.group({
        given_name: [this.attributes['given_name'], [Validators.required]],
        family_name: [this.attributes['family_name'], [Validators.required]],
        email: [this.attributes['email'], [Validators.required, Validators.email]]
      });
    });
  }

  createComment(): void {
    this.newComment.comment = this.newComment.comment.trim();
    if (this.commentsService.data.length < 5 && this.newComment.comment !== '') {
      this.commentsService.onStoreData(this.newComment, () => this.newComment = new Comment());
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

    dialogRef.afterClosed()
      .takeUntil(this.destroy$)
      .subscribe(result => {
        if (result) {
          // delete account
          this.authService.deleteAccount();
        }
      });
  }

  languageChanged(): void {
    console.log('New lang: ', this.lang);
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

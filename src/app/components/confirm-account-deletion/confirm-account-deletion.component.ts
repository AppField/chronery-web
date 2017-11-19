import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

@Component({
	selector: 'chy-confirm-account-deletion',
	templateUrl: './confirm-account-deletion.component.html',
	styleUrls: ['./confirm-account-deletion.component.css']
})
export class ConfirmAccountDeletionComponent implements OnInit {

	constructor(public dialogRef: MdDialogRef<ConfirmAccountDeletionComponent>) {
	}

	ngOnInit() {
	}

	confirm(): void {
		this.dialogRef.close(true);
	}

}

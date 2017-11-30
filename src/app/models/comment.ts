export class Comment {
	userId: string;
	id: string;
	comment: string;

	constructor(userId?: string, id?: string, comment?: string) {
		if (userId) {
			this.userId = userId;
		}
		this.id = id || 'comment' + Date.now();
		this.comment = comment || '';
	}
}

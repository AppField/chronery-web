export class Comment {
	_id: string;
	_rev: string;
	value: string;

	constructor(value?: string) {
		this.value = value || '';
	}
}

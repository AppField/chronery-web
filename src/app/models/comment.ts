export class Comment {
	id: string;
	value: string;

	constructor(id?: string, value?: string) {
		this.id = id || null;
		this.value = value || '';
	}
}

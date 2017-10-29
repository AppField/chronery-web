export class Project {
	_id: string;
	userId: string;
	id: string;
	number: string;
	name: string;

	constructor(userId?: string, id?: string, number?: string, name?: string) {
		this.userId = userId || null;
		this.id = id || '';
		this.number = number || '';
		this.name = name || '';
	}
}

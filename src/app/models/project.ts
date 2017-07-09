export class Project {
	id: number;
	number: string;
	name: string;

	constructor(id?: number, number?: string, name?: string) {
		this.id = id || 0;
		this.number = number || '';
		this.name = name || '';
	}
}

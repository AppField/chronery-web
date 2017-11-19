export class WorkingHours {
	id: string;
	from: string;
	to: string;
	spent: string;
	comment: string;
	project: {
		id: string;
		number: string;
		name: string;
	};

	constructor() {
		this.from = '00:00';
		this.to = '00:00';
		this.spent = '00:00';
	}
}

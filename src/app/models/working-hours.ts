export class WorkingHours {
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
	}
}

export class Work {
	day: string;
	projectName: string;
	projectId: string;
	from: string;
	to: string;
	pause: string;
	spent: string;
	comment: string;

	constructor() {
		this.projectName = '';
		this.from = '00:00';
		this.to = '00:00';
		this.pause = '00:00';
		this.spent = '00:00';
		this.comment = '';
	}

	setSpent = function (): void {
		const fromHours = parseInt(this.from.substr(0, 2), 10);
		const fromMinutes = parseInt(this.from.substr(3, 5), 10);

		// const toHours = parseInt(this.to.substr(0, 2), 10);
		// const toHours = parseInt(this.to.substr(3, 5), 10);

		const now = new Date();
		const later = new Date();

		console.log('Hours: ' + fromHours);
		console.log('Minutes: ' + fromMinutes);
	};

}

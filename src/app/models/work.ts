import {toArray} from 'rxjs/operator/toArray';
export class Work {
	day: string;
	projectId: string;
	projectName: string;
	from: string;
	to: string;
	pause: string;
	spent: string;
	comment: string;

	constructor() {
		this.projectId = '';
		this.projectName = '';
		this.from = '00:00';
		this.to = '00:00';
		this.pause = '00:00';
		this.spent = '00:00';
		this.comment = '';
	}

	setSpent = function (): void {
		const from = this.from.split(':');
		const to = this.from.split(':');

		const fromDate = new Date(0, 0, 0, from[0], from[1]);
		const toDate = new Date(0, 0, 0, to[0], to[1]);

		const difference = new Date(<any>toDate - <any>fromDate);
		this.spent = difference.getHours() + ':' + difference.getMinutes();

		console.log(this.spent);
	};

}

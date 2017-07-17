import * as moment from 'moment/moment';

export class Work {
	_id: string;
	_rev: string;
	date: string;
	projectId: string;
	projectNumber: string;
	projectName: string;
	from: string;
	to: string;
	pause: string;
	spent: string;
	comment: string;

	constructor(date: string) {
		this.date = date;
		this.from = '00:00';
		this.to = '00:00';
		this.pause = '00:00';
		this.spent = '00:00';
	}

	setSpent = function (): void {
		const from = this.from.split(':');
		const to = this.to.split(':');
		const fromDate = new Date(0, 0, 0, from[0], from[1], 0);
		const toDate = new Date(0, 0, 0, to[0], to[1], 0);
		const diff = moment.utc(moment(toDate).diff(moment(fromDate)));
		this.spent = diff.format('HH:mm');
	};

}

import {Injectable} from '@angular/core';
import * as moment from 'moment/moment';

@Injectable()
export class Utility {
	static encodeDate(date: Date): string {
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		return year + '-' + (month < 10 ? '0' : '') + month + '-' + (day < 10 ? '0' : '') + day;
	}

	static decodeDate(encodedDate: string): Date {
		if (encodedDate) {
			const dateValues = encodedDate.split('-');
			const year = +dateValues[0];
			const month = +dateValues[1];
			const day = +dateValues[2];
			const decodedDate = new Date(year, month - 1, day);
			return new Date(decodedDate);
		} else {
			return null;
		}
	}

	static getCurrentTimeString(): string {
		return moment().format('HH:mm');
	}
}

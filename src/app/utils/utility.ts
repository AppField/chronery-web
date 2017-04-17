import {Injectable} from '@angular/core';

@Injectable()
export class Utility {
	static encodeDate(date: Date): string {
		const day = date.getDate();
		const month = date.getMonth() + 1;
		const year = date.getFullYear();

		return year + (month < 10 ? '0' : '') + month + (day < 10 ? '0' : '') + day;
	}

	static decodeDate(encodedDate: string): Date {
		if (encodedDate) {
			const year = +(encodedDate.slice(0, 4));
			const month = +(encodedDate.slice(4, 6)) - 1;
			const day = +(encodedDate.slice(6, 8));
			const decodedDate = new Date(year, month, day);
			return new Date(decodedDate);
		} else {
			return null;
		}
	}
}

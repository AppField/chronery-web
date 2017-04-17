import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class DateParamService {

	private dateParam: Subject<string>;

	constructor() {
		this.dateParam = <Subject<string>>new Subject();
	}

	saveDateParam(newDateParam: string) {
		this.dateParam.next(newDateParam);
	}

	getDateParam() {
		return this.dateParam.asObservable();
	}
}

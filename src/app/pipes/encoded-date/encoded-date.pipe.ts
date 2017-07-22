import {Pipe, PipeTransform} from '@angular/core';
import * as moment from 'moment/moment';
import {Utility} from '../../utils/utility';

@Pipe({
	name: 'encodedDate'
})
export class EncodedDatePipe implements PipeTransform {

	transform(value: any, args?: any): string {
		const date = Utility.decodeDate(value);
		return moment(date).format('DD.MM.YYYY');
	}

}

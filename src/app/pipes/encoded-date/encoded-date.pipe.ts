import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment/moment';
import { Utility } from '../../utils/utility';
import { Moment } from 'moment';

@Pipe({
  name: 'encodedDate'
})
export class EncodedDatePipe implements PipeTransform {

  transform(value: any, args?: any): Moment {
    const date = Utility.decodeDate(value);
    return moment(date);
  }

}

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

    static getDateString(date: Date): string {
        return moment(date).format('DD.MM.YYYY');
    }

    static timeToDate(timeString: string): Date {
        const date = moment(timeString, ('HH:mm')).toDate();
        date.setMilliseconds(0);
        return date;
    }

    static sumTimes(times: string[]): string {
        const tempDate = moment('00:00', 'HH:mm');
        let totalTime = moment('00:00', 'HH:mm');
        times.map(time => {
            totalTime = totalTime.add(moment.duration(+(moment(time, 'HH:mm')) - +tempDate));
        });

        return totalTime.format('HH:mm');
    }

    static sumTotalTimes(times: string[]): string {
        let hours = 0;
        let minutes = 0;
        times.map(time => {
            const values = time.split(':');
            // add hours
            hours += +values[0];
            // add minutes
            minutes += +values[1];
        });

        const allMinutes = hours * 60 + minutes;
        hours = Math.trunc(allMinutes / 60);
        minutes = allMinutes - hours * 60;

        return hours + ':' + minutes;
    }
}

import qs from 'qs';
import fetch from '../utils/fetch';
import { NHL } from './models/nhl';

const BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

export class Schedule {
    get(date?: string) {
        console.log(`get ${date ? date : ''}`);
        let options;
        if (date) {
            options = { ...options, date: date };
        }
        fetch<NHL>(BASE_URL + `/schedule${options ? "?" + qs.stringify(options) : ""}`).then((result) => {
            console.log(result);
            return result;
        });
    }

    broadcasts() {
        console.log(`broadcasts`);
        fetch<NHL>(BASE_URL + '/schedule?expand=schedule.broadcasts').then((result) => {
            console.log(result);
            return result;
        });
    }
}

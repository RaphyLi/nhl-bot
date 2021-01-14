import { BotMessageEvent } from '@slack/bolt/dist/types/events';
import { resolve } from 'path';
import qs from 'qs';
import fetch from '../utils/fetch';
import { getToday } from '../utils/helpers';
import { NHL } from './models/nhl';

const BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

export class Schedule {
    get(date?: string): Promise<BotMessageEvent> {
        console.log(`get ${date ? date : ''}`);
        let options;
        if (date) {
            options = { ...options, date: date };
        }
        return new Promise(function (resolve, reject) {
            fetch<NHL>(BASE_URL + `/schedule${options ? "?" + qs.stringify(options) : ""}`).then((result) => {
                console.log(result);
                console.log(result.dates);
                const pretext = date ? `The results of yesterday's NHL games` : `NHL Games of the day's` ;
                const title = `${date ? date : getToday()}`;
                const games = [];
                result.dates.forEach(value => {
                    value.games.forEach(game => games.push(`${game.teams.home.team.name} VS ${game.teams.away.team.name}}`));
                });
                resolve({
                    attachments: [
                        {
                            pretext: `${pretext}`,
                            color: '#36a64f',
                            title: `${title}`,
                            text: games.join('\n')
                        }
                    ]
                } as BotMessageEvent);
            });
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

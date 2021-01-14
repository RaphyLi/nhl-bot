import { BotMessageEvent } from '@slack/bolt/dist/types/events';
import qs from 'qs';
import fetch from '../utils/fetch';
import { getToday } from '../utils/helpers';
import { NHL } from './models/nhl';
import { Away, Home } from './models/teams';

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
                const pretext = date ? `The results of yesterday's NHL games` : `NHL Games of the day's`;
                const title = `${date ? date : getToday()}`;
                const games = [];
                result.dates.forEach(value => {
                    value.games.forEach(game => {
                        const home = game.teams.home;
                        const away = game.teams.away;
                        let message: string = '';
                        if (date) {
                            let winTeam: Home | Away;
                            let losseTeam: Home | Away;

                            if (home.leagueRecord.wins === 1) {
                                winTeam = home;
                                losseTeam = away;
                            } else {
                                losseTeam = home;
                                winTeam = away;
                            }

                            message = `${winTeam.team.name} (${winTeam.score}) - ${losseTeam.team.name} (${losseTeam.score}) FINAL${losseTeam.leagueRecord.ot ? '/OT' : ''}`;
                        } else {
                            message = `${game.teams.home.team.name} VS ${game.teams.away.team.name}`;
                        }

                        games.push(message);
                    });
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

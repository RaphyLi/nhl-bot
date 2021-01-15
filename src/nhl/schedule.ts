import { ImageElement, PlainTextElement, MrkdwnElement } from '@slack/bolt';
import { BotMessageEvent } from '@slack/bolt/dist/types/events';
import { ContextBlock } from '@slack/web-api';
import qs from 'qs';
import fetch from '../utils/fetch';
import { getToday } from '../utils/helpers';
import { mappingTeamIdToLogo } from './logo';
import { NHL } from './models/nhl';
import { Away, Home } from './models/teams';

const BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

export class Schedule {
    get(date?: string): Promise<BotMessageEvent> {
        console.log(`get ${date ? date : ''}`);
        let options;
        if (date) {
            options = { ...options, date: date, expand: 'schedule.linescore' };
        }
        return new Promise((resolve, reject) => {
            fetch<NHL>(BASE_URL + `/schedule${options ? "?" + qs.stringify(options) : ""}`).then((result) => {
                console.log(result);
                console.log(result.dates);
                const pretext = date ? `The results of yesterday's NHL games` : `NHL Games of the day's`;
                const title = `${date ? date : getToday()}`;
                const blocks : Array<ContextBlock> = new Array<ContextBlock>();
                
                result.dates.forEach(value => {
                    value.games.forEach(game => {
                        let block: ContextBlock = {
                            type: 'context',
                            elements: []
                        };
                        if (date) {
                            block.elements.push(...this.formatTeam(game.linescore.teams.home, '-', true));
                            block.elements.push(...this.formatTeam(game.linescore.teams.away, null, true));
                            block.elements.push({
                                type: 'mrkdwn',
                                text: `FINAL${game.linescore.currentPeriod > 3 ? '/OT' : ''}`
                            });
                        } else {
                            block.elements.push(...this.formatTeam(game.teams.home, 'VS'));
                            block.elements.push(...this.formatTeam(game.teams.away));
                        }

                        blocks.push(block);
                    });
                });
                resolve({
                    blocks: [
                        {
                            type: "section",
                            text: {
                                type: "mrkdwn",
                                text: `*<https://www.nhl.com/schedule/${date ? date : getToday()}/ET|${title}>*`
                            }
                        },
                    ],
                    attachments: [
                        {
                            color: '#36a64f',
                            blocks: blocks
                        }
                    ]
                } as BotMessageEvent);
            });
        });
    }

    private formatTeam(team: Home | Away, delimeter?: string, withScore: boolean = false): Array<ImageElement | PlainTextElement | MrkdwnElement> {
        return [
            {
                type: 'image',
                image_url: mappingTeamIdToLogo[team.team.id],
                alt_text: team.team.name
            },
            {
                type: "mrkdwn",
                text: `${team.team.name}${withScore ? `(${team.goals})` : ''} ${delimeter ? delimeter : ''}`
            },
        ]
    }

    broadcasts() {
        console.log(`broadcasts`);
        fetch<NHL>(BASE_URL + '/schedule?expand=schedule.broadcasts').then((result) => {
            console.log(result);
            return result;
        });
    }
}

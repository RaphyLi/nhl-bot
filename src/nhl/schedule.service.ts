import { ImageElement, MrkdwnElement, PlainTextElement } from '@slack/bolt';
import { BotMessageEvent } from '@slack/bolt/dist/types/events';
import { ContextBlock } from '@slack/web-api';
import qs from 'qs';
import fetch from '../utils/fetch';
import { getToday } from '../utils/helpers';
import { mappingTeamIdToLogo } from './logo';
import { NHLDate } from './models/dates';
import { Game } from './models/game';
import { NHL } from './models/nhl';
import { Away, Home } from './models/teams';

export class ScheduleService {
    private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

    get(date?: string): Promise<BotMessageEvent> {
        let options = { date: date ? date : getToday(), expand: 'schedule.linescore' };
        return new Promise((resolve, reject) => {
            fetch<NHL>(this.BASE_URL + `/schedule${options ? "?" + qs.stringify(options) : ""}`).then((result) => {
                const title = date ? `The results of yesterday's NHL games` : `NHL Games of the day's`;
                const dateTitle = `${date ? date : getToday()}`;
                const blocks: Array<ContextBlock> = new Array<ContextBlock>();

                result.dates.forEach(value => {
                    value.games.forEach(game => {
                        let block: ContextBlock = {
                            type: 'context',
                            elements: []
                        };
                        if (date) {
                            block.elements.push(...this.formatTeam(game.linescore.teams.home, true));
                            block.elements.push({
                                type: 'mrkdwn',
                                text: '-'
                            });
                            block.elements.push(...this.formatTeam(game.linescore.teams.away, true));
                            block.elements.push({
                                type: 'mrkdwn',
                                text: `FINAL${game.linescore.currentPeriod > 3 ? '/OT' : ''}`
                            });
                        } else {
                            block.elements.push(...this.formatTeam(game.teams.home));
                            block.elements.push({
                                type: 'mrkdwn',
                                text: 'VS'
                            });
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
                                text: `${title} *<https://www.nhl.com/schedule/${date ? date : getToday()}/ET|${dateTitle}>*`
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

    getAll(seasonId: string): Promise<Array<NHLDate>> {
        let options = { season: seasonId, expand: 'schedule.linescore' };
        return new Promise((resolve, reject) => {
            fetch<NHL>(this.BASE_URL + `/schedule${options ? "?" + qs.stringify(options) : ""}`).then((result) => {
                resolve(result.dates);
            });
        });
    }

    private formatTeam(team: Home | Away, withScore: boolean = false): Array<ImageElement | PlainTextElement | MrkdwnElement> {
        return [
            {
                type: 'image',
                image_url: mappingTeamIdToLogo[team.team.id],
                alt_text: team.team.name
            },
            {
                type: "plain_text",
                text: `${team.team.name}${withScore ? `(${team.goals})` : ''}`
            },
        ]
    }

    live() {
        let options = { expand: 'schedule.linescore' };
        fetch<NHL>(this.BASE_URL + `/schedule${options ? "?" + qs.stringify(options) : ""}`).then((result) => {
            const lives: Array<Game> = [];
            result.dates.forEach(date => {
                lives.push(...date.games.filter(x => x.status.abstractGameState === 'Live'));
            });
            return result;
        });
    }
}

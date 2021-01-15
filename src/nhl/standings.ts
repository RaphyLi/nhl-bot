import { Division, Standings } from './models/standings';
import fetch from '../utils/fetch';
import { ContextBlock, KnownBlock } from '@slack/web-api';

export class Standing {
    private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

    get(): Promise<any> {
        return new Promise((resolve, reject) => {
            fetch<Standings>(this.BASE_URL + `/standings`).then((result) => {
                const title = `NHL :star:`;
                const blocks: Array<KnownBlock> = new Array<KnownBlock>();

                result.records.forEach(record => {
                    blocks.push({
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `${record.division.name}`
                        },
                    });
                    blocks.push({
                        type: 'divider'
                    });
                    const div: Array<ContextBlock> = record.teamRecords.map(team => {
                        return {
                            type: 'context',
                            elements: [
                                {
                                    type: 'plain_text',
                                    text: `${team.team.name}`
                                }
                            ]
                        }
                    });
                    blocks.push(...div);
                    blocks.push({
                        type: 'divider'
                    });
                })
                resolve({
                    blocks: [
                        {
                            type: 'section',
                            text: {
                                type: 'mrkdwn',
                                text: `${title} *<https://www.nhl.com/standings/2020/division|standings>*`
                            }
                        },
                        {
                            'type': 'divider'
                        },
                        ...blocks
                    ],
                });
            });
        });
    }

    private formatDivision(division: Division) {
        return {

        }
    }
}
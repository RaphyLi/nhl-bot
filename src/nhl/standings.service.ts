import { SlashCommand } from '@slack/bolt';
import { ContextBlock, KnownBlock } from '@slack/web-api';
import qs from 'qs';
import fetch from '../utils/fetch';
import { Division, Standings, TeamRecord } from './models/standings';

export class StandingService {
    private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';
    private divisions: Array<Division>;
    private matchDivision = {
        'west': 'WST',
        'central': 'CEN',
        'east': 'EST',
        'north': 'NTH'
    }

    constructor() {
    }

    get(command?: SlashCommand): Promise<any> {
        return new Promise((resolve, reject) => {
            let options;
            options = {
                expand: ['standings.division', 'standings.team', 'standings.record']
            };
            fetch<Standings>(this.BASE_URL + `/standings${options ? "?" + qs.stringify(options, { indices: false }) : ""}`).then((result) => {
                const title = `NHL :star:`;
                const blocks: Array<KnownBlock> = new Array<KnownBlock>();
                const byDivision = this.parseDivision(command);
                let records = result.records;
                if (byDivision) {
                    records = records.filter(x => x.division.abbreviation === byDivision);
                }

                records.forEach(record => {
                    blocks.push({
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `\`\`\` ${record.division.name} \n ${this.formatLine(record.teamRecords)} \`\`\``
                        }
                    });
                    record.teamRecords
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
                    ],
                    attachments: [
                        {
                            color: '#36a64f',
                            blocks: blocks
                        }
                    ]
                });
            });
        });
    }

    private parseDivision(command: SlashCommand): string {
        if (command && command.text) {
            const found = command.text.match(/(\bwest\b|\beast\b|\bnorth\b|\bcentral\b)/);
            if (found) {
                return this.matchDivision[found[0]];
            } else {
                return 'Division not matching.'
            }
        }
        return;
    }
    private formatLine(teams: Array<TeamRecord>): string {
        const top = '                  GP  W  L  OT  PTS  GF  GA  DIFF   HOME    AWAY  S/O     L10  STRK\n';
        let message = top;
        const leftPad = ('                ');
        teams.forEach(team => {
            const overallRecordHome = team.records.overallRecords.find(x => x.type === 'home');
            const overallRecordAway = team.records.overallRecords.find(x => x.type === 'away');
            const overallShootOuts = team.records.overallRecords.find(x => x.type === 'shootOuts');
            const overallLastTen = team.records.overallRecords.find(x => x.type === 'lastTen');

            const name = `${team.divisionRank}. ` + team.team.teamName + leftPad.substring(team.team.teamName.length, leftPad.length);
            message += `${name}` +
                `${this.formatNumber(team.gamesPlayed)} ${this.formatNumber(team.leagueRecord.wins)} ${this.formatNumber(team.leagueRecord.losses)}  ${this.formatNumber(team.leagueRecord.ot)}` +
                `  ${this.formatNumber(team.points, true)} ${this.formatNumber(team.goalsScored, true)} ${this.formatNumber(team.goalsAgainst, true)}   ${this.formatNumber(team.goalsScored - team.goalsAgainst)} ` +
                `  ${overallRecordHome.wins}-${overallRecordHome.losses}-${overallRecordHome.ot}   ${overallRecordAway.wins}-${overallRecordAway.losses}-${overallRecordAway.ot} ` +
                ` ${overallShootOuts.wins}-${overallShootOuts.losses}   ${overallLastTen.wins}-${overallLastTen.losses}-${overallLastTen.ot} ` +
                `  ${team.streak?.streakCode}\n`;
        });

        return message
    }

    private formatNumber(number: number, canOverHundred: boolean = false) {
        if (number >= 0) {
            if (canOverHundred) {
                return number >= 100 ? `${number}` : number >= 10 ? ` ${number}` : `  ${number}`;
            } else {
                return number >= 10 ? `${number}` : ` ${number}`;
            }
        } else {
            return number;
        }
    }
}

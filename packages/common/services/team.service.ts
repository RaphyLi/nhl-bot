import { BotMessageEvent, ContextBlock } from '@slack/bolt';
import { fetch } from '../util/fetch';
import { Injectable } from '@nhl/core';
import { DatabaseService } from '../services';
import { Team } from '../models';
import { mappingTeamIdToLogo } from '../logo';

@Injectable()
export class TeamService {
  private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

  constructor(private databaseService: DatabaseService) {}

  sync(): Promise<Array<Team>> {
    return new Promise((resolve, reject) => {
      fetch<{ copyright: string; teams: Array<Team> }>(this.BASE_URL + `/teams`).then((result) => {
        resolve(result.teams);
      });
    });
  }

  get(): Promise<BotMessageEvent> {
    return this.databaseService
      .knex('NHLTeams')
      .innerJoin('NHLFranchises', 'NHLTeams.franchiseId', '=', 'NHLFranchises.franchiseId')
      .orderBy('NHLTeams.franchiseId')
      .options({ nestTables: true })
      .then((rows) => {
        return rows.map(
          (item) =>
            ({
              ...item.NHLTeams,
              franchise: item.NHLFranchises
            } as Team)
        );
      })
      .then((teams) => {
        const blocks: Array<ContextBlock> = new Array<ContextBlock>();
        teams.forEach((team) => {
          let block: ContextBlock = {
            type: 'context',
            elements: [
              {
                type: 'image',
                image_url: mappingTeamIdToLogo[team.id],
                alt_text: team.name
              },
              {
                type: 'plain_text',
                text: `${team.teamName} (${team.abbreviation})`
              }
            ]
          };
          blocks.push(block);
        });
        return {
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: `Team names`
              }
            }
          ],
          attachments: [
            {
              color: '#36a64f',
              blocks: blocks
            }
          ]
        } as BotMessageEvent;
      });
  }
}

import {
  ImageElement,
  MrkdwnElement,
  PlainTextElement,
  SectionBlock,
  SlashCommand
} from '@slack/bolt';
import { BotMessageEvent } from '@slack/bolt/dist/types/events';
import { ContextBlock } from '@slack/web-api';
import { Injectable } from '@nhl/core';
import type { NHL, Game } from '../models';
import moment from 'moment-timezone';
import qs from 'qs';
import type { DatabaseService } from './database.service';
import { fetch } from '../util/fetch';
import { getToday } from '../util/helpers';
import { mappingTeamIdToLogo } from '../logo';

@Injectable()
export class ScheduleService {
  private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

  constructor(private databaseService: DatabaseService) {}

  schedule(command: SlashCommand): Promise<BotMessageEvent> {
    if (command.text && command.text.length === 3) {
      return this.getNextGameByTeam(command.text);
    } else if (command.text && command.text.length === 10) {
      return this.getScheduleByDay(command.text);
    } else {
      return this.getScheduleByDay(getToday());
    }
  }

  getScheduleByDay(date: string): Promise<BotMessageEvent> {
    return this.databaseService
      .knex('NHLGames')
      .leftJoin('NHLLinescores', 'NHLLinescores.gamePk', '=', 'NHLGames.gamePk')
      .innerJoin('NHLTeams', function () {
        this.on('NHLTeams.id', '=', 'NHLGames.awayTeamId').orOn(
          'NHLTeams.id',
          '=',
          'NHLGames.homeTeamId'
        );
      })
      .where('NHLGames.gameDate', '=', date ? date : getToday())
      .orderBy('NHLGames.gameDateTime')
      .select()
      .options({ nestTables: true })
      .then((rows) => {
        const games = Object.values(
          rows.reduce((acc, curr) => {
            let game: Game = acc[curr.NHLGames['gamePk']] || {
              ...curr.NHLGames,
              linescore: curr.NHLLinescores
            };
            if (curr.NHLGames.awayTeamId === curr.NHLTeams.id) {
              game.linescore.teams = {
                ...game.linescore.teams,
                away: curr.NHLTeams
              };
            } else {
              game.linescore.teams = {
                ...game.linescore.teams,
                home: curr.NHLTeams
              };
            }
            acc[curr.NHLGames['gamePk']] = game;
            return acc;
          }, {})
        );
        const dateTitle = `${date ? date : getToday()}`;
        const title = `${
          date ? `The results of yesterday's NHL games` : `NHL Games of the day's`
        } *<https://www.nhl.com/schedule/${dateTitle}/ET|${dateTitle}>*`;
        const blocks: Array<ContextBlock> = new Array<ContextBlock>();
        games.forEach((game: any) => {
          let block: ContextBlock = {
            type: 'context',
            elements: []
          };
          const done = game.linescore.currentPeriod > 0;

          block.elements.push(
            ...this.formatTeam(game.linescore.teams.home, done, game.linescore.homeGoals)
          );
          block.elements.push({
            type: 'mrkdwn',
            text: `${done ? '-' : 'VS'}`
          });
          block.elements.push(
            ...this.formatTeam(game.linescore.teams.away, done, game.linescore.awayGoals)
          );
          if (game.linescore.currentPeriod) {
            block.elements.push({
              type: 'mrkdwn',
              text: `FINAL${game.linescore.currentPeriod > 3 ? '/OT' : ''}`
            });
          }

          blocks.push(block);
        });
        return this.generateBotMessageEvent(title, blocks);
      });
  }

  getNextGameByTeam(team: string): Promise<BotMessageEvent> {
    return this.databaseService.knex
      .transaction((trx) => {
        this.databaseService
          .knex('NHLGames')
          .innerJoin('NHLTeams', function () {
            this.on('NHLTeams.id', '=', 'NHLGames.awayTeamId').orOn(
              'NHLTeams.id',
              '=',
              'NHLGames.homeTeamId'
            );
          })
          .where('NHLGames.gameDate', '>=', getToday())
          .andWhere('NHLTeams.abbreviation', team)
          .orderBy('NHLGames.gameDateTime')
          .limit(10)
          .select()
          .options({ nestTables: true })
          .transacting(trx)
          .then((rows) => {
            const ids = rows.reduce((acc: Array<number>, curr) => {
              acc = acc || [];
              if (!acc.find((x) => x === curr.NHLGames.awayTeamId)) {
                acc.push(curr.NHLGames.awayTeamId);
              }
              if (!acc.find((x) => x === curr.NHLGames.homeTeamId)) {
                acc.push(curr.NHLGames.homeTeamId);
              }
              return acc;
            }, []);
            return this.databaseService
              .knex('NHLTeams')
              .whereIn('id', ids)
              .select()
              .transacting(trx)
              .then((teams) => {
                return {
                  team: teams.find((x) => x.abbreviation === team.toUpperCase()),
                  games: Object.values(
                    rows.reduce((acc, curr) => {
                      let game: Game = acc[curr.NHLGames['gameDate']] || {
                        ...curr.NHLGames,
                        linescore: curr.NHLLinescores || { teams: {} }
                      };
                      game.linescore.teams = {
                        ...game.linescore.teams,
                        away: teams.find((x) => x.id === curr.NHLGames.awayTeamId),
                        home: teams.find((x) => x.id === curr.NHLGames.homeTeamId)
                      };
                      acc[curr.NHLGames['gameDate']] = game;
                      return acc;
                    }, {})
                  )
                };
              });
          })
          .then(trx.commit)
          .catch(trx.rollback);
      })
      .then((result: { team; games: Array<any> }) => {
        const message = result.games.reduce((acc, curr) => {
          const date = moment(curr.gameDateTime).format('LLL');
          acc += `\`${curr.linescore.teams.home.name} vs ${curr.linescore.teams.away.name}\` - ${date}\n`;
          return acc;
        }, '');
        const block: SectionBlock = {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message
          }
        };
        return this.generateBotMessageEvent(
          `${result.games.length}-game schedule for the ${result.team.teamName}`,
          [block]
        );
      });
  }

  private generateBotMessageEvent(
    title: string,
    blocks: Array<ContextBlock | SectionBlock>
  ): BotMessageEvent {
    return {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `${title}`
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
  }

  private formatTeam(
    team: any,
    withScore: boolean = false,
    score: null
  ): Array<ImageElement | PlainTextElement | MrkdwnElement> {
    return [
      {
        type: 'image',
        image_url: mappingTeamIdToLogo[team.id],
        alt_text: team.name
      },
      {
        type: 'plain_text',
        text: `${team.name}${withScore ? `(${score})` : ''}`
      }
    ];
  }

  live() {
    let options = { expand: 'schedule.linescore' };
    fetch<NHL>(this.BASE_URL + `/schedule${options ? '?' + qs.stringify(options) : ''}`).then(
      (result) => {
        const lives: Array<Game> = [];
        result.dates.forEach((date) => {
          lives.push(...date.games.filter((x) => x.status.abstractGameState === 'Live'));
        });
        return result;
      }
    );
  }
}

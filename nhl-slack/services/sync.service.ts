import {
  DatabaseService,
  formatDate,
  FranchiseService,
  ScheduleService,
  SeasonService,
  TeamService,
  Season,
  Franchise,
  NHLDate,
  Team,
  Game
} from '@nhl/common';
import { Injectable } from '@nhl/core';

@Injectable()
export class SyncService {
  constructor(
    private databaseService: DatabaseService,
    private franchise: FranchiseService,
    private seasonService: SeasonService,
    private teamService: TeamService,
    private scheduleService: ScheduleService
  ) {}

  public checkSync() {
    this.databaseService
      .knex('NHLTeams')
      .count({ count: 'id' })
      .then(async (result) => {
        const count = result[0].count;
        if (count === 0) {
          await this.sync();
        }
      });
  }

  public sync() {
    return Promise.all([
      this.franchise.sync(),
      this.teamService.sync(),
      this.seasonService.sync()
    ]).then(([franchises, teams, seasons]) => {
      if (franchises.length) {
        this.createOrUpdateFranchises(franchises);
      }
      if (teams.length) {
        this.createOrUpdateTeams(teams);
      }
      if (seasons.length) {
        this.createOrUpdateSeasons(seasons);
      }
      this.scheduleService.sync(seasons[seasons.length - 1].seasonId).then((games) => {
        this.createOrUpdateGames(games);
      });
    });
  }

  private async createOrUpdateFranchises(franchisesFromAPI: Array<Franchise>) {
    const rows = franchisesFromAPI.map((franchise: Franchise) => ({
      franchiseId: franchise.franchiseId,
      firstSeasonId: franchise.firstSeasonId,
      mostRecentTeamId: franchise.mostRecentTeamId,
      teamName: franchise.teamName,
      locationName: franchise.locationName,
      link: franchise.link,
      updatedAt: this.databaseService.knex.fn.now()
    }));
    await this.databaseService.knex('NHLFranchises').insert(rows).onConflict('franchiseId').merge();
  }

  private async createOrUpdateSeasons(seasonsFromAPI: Array<Season>) {
    const rows = seasonsFromAPI.map((season: Season) => ({
      seasonId: season.seasonId,
      regularSeasonStartDate: season.regularSeasonStartDate,
      regularSeasonEndDate: season.regularSeasonEndDate,
      seasonEndDate: season.seasonEndDate,
      numberOfGames: season.numberOfGames,
      tiesInUse: season.tiesInUse,
      olympicsParticipation: season.olympicsParticipation,
      conferencesInUse: season.conferencesInUse,
      divisionsInUse: season.divisionsInUse,
      wildCardInUse: season.wildCardInUse,
      updatedAt: this.databaseService.knex.fn.now()
    }));
    await this.databaseService.knex('NHLSeasons').insert(rows).onConflict('seasonId').merge();
  }

  private async createOrUpdateTeams(teamsFromAPI: Array<Team>) {
    const rows = teamsFromAPI.map((team: Team) => ({
      id: team.id,
      name: team.name,
      link: team.link,
      abbreviation: team.abbreviation,
      teamName: team.teamName,
      locationName: team.locationName,
      firstYearOfPlay: team.firstYearOfPlay,
      shortName: team.shortName,
      officialSiteUrl: team.officialSiteUrl,
      franchiseId: team.franchiseId,
      active: team.active,
      updatedAt: this.databaseService.knex.fn.now()
    }));
    await this.databaseService.knex('NHLTeams').insert(rows).onConflict('id').merge();
  }

  private async createOrUpdateGames(gamesFromAPI: Array<NHLDate>) {
    const games = [];
    const linescores = [];
    const peridos = [];
    gamesFromAPI.forEach((date: NHLDate) => {
      date.games.forEach((game: Game) => {
        games.push({
          gamePk: game.gamePk,
          link: game.link,
          gameType: game.gameType,
          season: game.season,
          gameDateTime: game.gameDate,
          gameDate: formatDate(new Date(game.gameDate)),
          awayTeamId: game.teams.away.team.id,
          awayScore: game.teams.away.score,
          homeTeamId: game.teams.home.team.id,
          homeScore: game.teams.home.score
        });
        if (game.linescore && game.linescore.periods.length) {
          linescores.push({
            gamePk: game.gamePk,
            currentPeriod: game.linescore.currentPeriod,
            currentPeriodOrdinal: game.linescore.currentPeriodOrdinal,
            currentPeriodTimeRemaining: game.linescore.currentPeriodTimeRemaining,
            homeTeamId: game.linescore.teams.home.team.id,
            homeGoals: game.linescore.teams.home.goals,
            homeShotsOnGoal: game.linescore.teams.home.shotsOnGoal,
            homeGoaliePulled: game.linescore.teams.home.goaliePulled,
            homeNumSkaters: game.linescore.teams.home.numSkaters,
            homePowerPlay: game.linescore.teams.home.powerPlay,
            awayTeamId: game.linescore.teams.away.team.id,
            awayGoals: game.linescore.teams.away.goals,
            awayShotsOnGoal: game.linescore.teams.away.shotsOnGoal,
            awayGoaliePulled: game.linescore.teams.away.goaliePulled,
            awayNumSkaters: game.linescore.teams.away.numSkaters,
            awayPowerPlay: game.linescore.teams.away.powerPlay,
            powerPlayStrength: game.linescore.powerPlayStrength,
            hasShootout: game.linescore.hasShootout
          });
          peridos.push(
            ...game.linescore.periods.map((period) => ({
              gamePk: game.gamePk,
              periodType: period.periodType,
              startTime: period.startTime,
              endTime: period.endTime,
              num: period.num,
              ordinalNum: period.ordinalNum,
              homeGoals: period.home.goals,
              homeShotsOnGoal: period.home.shotsOnGoal,
              homeRinkSide: period.home.rinkSide,
              awayGoals: period.away.goals,
              awayShotsOnGoal: period.away.shotsOnGoal,
              awayRinkSide: period.away.rinkSide
            }))
          );
        }
      });
    });
    await this.databaseService.knex('NHLGames').insert(games).onConflict('gamePk').merge();
    await this.databaseService
      .knex('NHLLinescores')
      .insert(linescores)
      .onConflict('gamePk')
      .merge();
    await this.databaseService.knex('NHLPeriods').insert(peridos).onConflict('startTime').merge();
  }
}

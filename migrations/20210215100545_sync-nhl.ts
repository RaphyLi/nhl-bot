import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('NHLFranchises', franchise => {
        franchise.integer('franchiseId').primary().notNullable();
        franchise.integer('firstSeasonId').notNullable();
        franchise.integer('mostRecentTeamId').notNullable();
        franchise.string('teamName').notNullable();
        franchise.string('locationName').notNullable();
        franchise.string('link').notNullable();
        franchise.dateTime('createdAt').defaultTo(knex.fn.now());
        franchise.dateTime('updatedAt').defaultTo(knex.fn.now());
    }).createTable('NHLTeams', team => {
        team.integer('id').primary().notNullable();
        team.string('name').notNullable();
        team.string('link').notNullable();
        team.string('abbreviation').notNullable();
        team.string('teamName').notNullable();
        team.string('locationName').notNullable();
        team.string('firstYearOfPlay').notNullable();
        team.string('shortName').notNullable();
        team.string('officialSiteUrl').notNullable();
        team.integer('franchiseId').notNullable();
        team.boolean('active').notNullable();
        team.dateTime('createdAt').defaultTo(knex.fn.now());
        team.dateTime('updatedAt').defaultTo(knex.fn.now());
    }).createTable('NHLSeasons', season => {
        season.string('seasonId').primary().notNullable();
        season.date('regularSeasonStartDate').notNullable();
        season.date('regularSeasonEndDate').notNullable();
        season.date('seasonEndDate').notNullable();
        season.integer('numberOfGames').notNullable();
        season.boolean('tiesInUse').notNullable();
        season.boolean('olympicsParticipation').notNullable();
        season.boolean('conferencesInUse').notNullable();
        season.boolean('divisionsInUse').notNullable();
        season.boolean('wildCardInUse').notNullable();
        season.dateTime('createdAt').defaultTo(knex.fn.now());
        season.dateTime('updatedAt').defaultTo(knex.fn.now());
    }).createTable('NHLGames', game => {
        game.bigIncrements('gamePk').primary().notNullable();
        game.string('link').notNullable();
        game.string('gameType').notNullable();
        game.string('season').notNullable();
        game.string('gameDate').notNullable();
        game.integer('awayTeamId').notNullable();
        game.integer('awayScore').notNullable();
        game.integer('homeTeamId').notNullable();
        game.integer('homeScore').notNullable();
        game.dateTime('createdAt').defaultTo(knex.fn.now());
        game.dateTime('updatedAt').defaultTo(knex.fn.now());
    }).createTable('NHLLinescores', linescore => {
        linescore.bigInteger('gamePk').primary().unsigned();
        linescore.integer('currentPeriod').notNullable();
        linescore.string('currentPeriodOrdinal').notNullable();
        linescore.string('currentPeriodTimeRemaining').notNullable();
        linescore.integer('homeTeamId').notNullable();
        linescore.integer('homeGoals');
        linescore.integer('homeShotsOnGoal');
        linescore.boolean('homeGoaliePulled');
        linescore.integer('homeNumSkaters');
        linescore.boolean('homePowerPlay');
        linescore.integer('awayTeamId').notNullable();
        linescore.integer('awayGoals');
        linescore.integer('awayShotsOnGoal');
        linescore.boolean('awayGoaliePulled');
        linescore.integer('awayNumSkaters');
        linescore.boolean('awayPowerPlay');
        linescore.string('powerPlayStrength').notNullable();
        linescore.string('hasShootout').notNullable();
        linescore.dateTime('createdAt').defaultTo(knex.fn.now());
        linescore.dateTime('updatedAt').defaultTo(knex.fn.now());
        linescore.foreign('gamePk').references('gamePk').inTable('NHLGames').onDelete('CASCADE').onUpdate('CASCADE');
    }).createTable('NHLPeriods', period => {
        period.bigInteger('gamePk').unsigned();
        period.string('periodType').notNullable();
        period.string('startTime').unique().primary().notNullable();
        period.string('endTime');
        period.integer('num').notNullable();
        period.string('ordinalNum').notNullable();
        period.integer('homeGoals');
        period.integer('homeShotsOnGoal');
        period.string('homeRinkSide');
        period.integer('awayGoals');
        period.integer('awayShotsOnGoal');
        period.string('awayRinkSide');
        period.dateTime('createdAt').defaultTo(knex.fn.now());
        period.dateTime('updatedAt').defaultTo(knex.fn.now());
        period.foreign('gamePk').references('gamePk').inTable('NHLLinescores').onDelete('CASCADE').onUpdate('CASCADE');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTableIfExists('NHLFranchises')
        .dropTableIfExists('NHLTeams')
        .dropTableIfExists('NHLSeasons')
        .dropTableIfExists('NHLPeriods')
        .dropTableIfExists('NHLLinescores')
        .dropTableIfExists('NHLGames');
}


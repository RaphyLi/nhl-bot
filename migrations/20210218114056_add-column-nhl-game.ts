import * as Knex from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('NHLGames', game => {
        game.renameColumn('gameDate', 'gameDateTime');
    }).alterTable('NHLGames', game => {
        game.string('gameDate').notNullable();
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('NHLGames', game => {
        game.dropColumn('gameDate');
    }).alterTable('NHLGames', game => {
        game.renameColumn('gameDateTime', 'gameDate');
    });
}


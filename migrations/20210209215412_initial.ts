import Knex = require('knex');

export async function up(knex: Knex): Promise<void> {
    let isExist = await knex.schema.hasTable('Workspaces');
    if (!isExist) {
        await knex.schema.createTable('Workspaces', (workspaces) => {
            workspaces.increments('id').primary().notNullable();
            workspaces.string('teamId', 50).notNullable();
            workspaces.string('token', 1000).notNullable();
            workspaces.string('installation', 255).notNullable();
        });
    }
    isExist = await knex.schema.hasTable('ChannelsNotification');
    if (!isExist) {
        await knex.schema.createTable('ChannelsNotification', (channelsNotification) => {
            channelsNotification.increments('id').primary().notNullable();
            channelsNotification.string('channelId', 50).notNullable();
            channelsNotification.string('teamId', 50).notNullable();
        });
    }
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema
        .dropTableIfExists('Workspaces')
        .dropTableIfExists('ChannelsNotification');
}


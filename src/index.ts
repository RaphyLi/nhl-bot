import { App, Installation, LogLevel } from '@slack/bolt';
import * as schedule from 'node-schedule';
import { CommandService } from './command.service';
import { DatabaseService } from './database.service';
import { HelpService } from './helpService';
import { FranchiseService } from './nhl/franchise.service';
import { ScheduleService } from './nhl/schedule.service';
import { SeasonService } from './nhl/season.service';
import { StandingService } from './nhl/standings.service';
import { TeamService } from './nhl/team.service';
import { NotificationService } from './notification.service';
import { SyncService } from './sync.service';
import { getToday, getYesterday } from './utils/helpers';

const databaseService = new DatabaseService();
const scheduleService = new ScheduleService(databaseService);
const standingService = new StandingService();
const franchiseService = new FranchiseService();
const teamService = new TeamService();
const seasonService = new SeasonService();
const syncService = new SyncService(databaseService, franchiseService, seasonService, teamService, scheduleService);
const helpService = new HelpService();
const notificationService = new NotificationService(databaseService);
const commandService = new CommandService(scheduleService, standingService, notificationService, helpService);

databaseService.connect();
notificationService.init();

// scheduleService.getScheduleByDay('2021-02-18');
// scheduleService.getNextGameByTeam('mtl');

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    stateSecret: process.env.SLACK_STATE_SECRET,
    scopes: ['channels:history', 'chat:write', 'commands', 'groups:history', 'users:read', 'im:history', 'im:write', 'mpim:history'],
    logLevel: LogLevel.DEBUG,
    installationStore: {
        storeInstallation: async (installation: Installation) => {
            // change the line below so it saves to your database
            if (installation.isEnterpriseInstall) {
                // support for org wide app installation
                return await databaseService.knex('Workspaces').insert([{ teamId: installation.enterprise.id, token: installation.bot.token, installation: JSON.stringify(installation) }]);
            } else {
                // single team app installation
                return await databaseService.knex('Workspaces').insert([{ teamId: installation.team.id, token: installation.bot.token, installation: JSON.stringify(installation) }]);
            }
            throw new Error('Failed saving installation data to installationStore');
        },
        fetchInstallation: async (installQuery) => {
            // change the line below so it fetches from your database
            if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
                // org wide app installation lookup
                const workspace = await databaseService.knex('Workspaces').where({ teamId: installQuery.enterpriseId }).select('installation').first();
                return JSON.parse(workspace.installation);
            }
            if (installQuery.teamId !== undefined) {
                // single team app installation lookup
                const workspace = await databaseService.knex('Workspaces').where({ teamId: installQuery.teamId }).select('installation').first();
                return JSON.parse(workspace.installation);
            }
            throw new Error('Failed fetching installation');
        },
    },
});

const actions = {
    'schedule': scheduleService.getScheduleByDay(getToday()),
    'scores': () => scheduleService.getScheduleByDay(getYesterday()),
    'live': scheduleService.live,
    'standings': standingService.get,
    'help': helpService.help,
    'on': (event) => notificationService.on(event),
    'off': (event) => notificationService.off(event)
}

app.command('/standings', async ({ command, ack, say }) => {
    await ack();
    await say(await commandService.handleCommand(command));
});

app.command('/schedule', async ({ command, ack, say }) => {
    await ack();
    await say(await commandService.handleCommand(command));
});

app.command('/scores', async ({ command, ack, say }) => {
    await ack();
    await say(await commandService.handleCommand(command));
});

app.command('/on', async ({ command, ack, say }) => {
    await ack();
    await say(await commandService.handleCommand(command));
});

app.command('/off', async ({ command, ack, say }) => {
    await ack();
    await say(await commandService.handleCommand(command));
});

// // Listens to incoming messages that contain "hello"
// app.message(/^(schedule|scores|live|standings|help|on|off).*/, async ({ event, context, say }) => {
//     // RegExp matches are inside of context.matches
//     const greeting = context.matches[0];

//     say(await actions[greeting](event));
// });

app.error(async (error) => {
    // Check the details of the error to handle cases where you should retry sending a message or stop the app
    console.error(error);
});

const everyDayAt9am = '0 9 * * *';
const tz = 'America/Toronto';

const job = {
    rule: everyDayAt9am,
    tz: tz
} as schedule.RecurrenceSpecDateRange;

schedule.scheduleJob(job, (fireDate) => {
    console.log(`Job at: ${fireDate.toString()}`);

    Promise.all([
        scheduleService.getScheduleByDay(getToday()),
        scheduleService.getScheduleByDay(getYesterday())
    ]).then(([matchOfTheDay, scoreYesterday]) => {
        const channels = notificationService.getChannels();
        channels.forEach(async channel => {
            console.log(channel);
            await app.client.chat.postMessage({
                channel: channel.channelId,
                attachments: matchOfTheDay.attachments,
                text: `NHL Games of the day's`,
                token: channel.workspaces.token
            });
            await app.client.chat.postMessage({
                channel: channel.channelId,
                attachments: scoreYesterday.attachments,
                text: `The results of yesterday's NHL games`,
                token: channel.workspaces.token
            });
        });
    });
});

const syncJob = {
    rule: '0 5 * * *',
    tz: tz
};
schedule.scheduleJob(syncJob, async () => {
    console.log('[Sync]: Sync job launch');
    await syncService.sync();
    console.log('[Sync]: Sync job done');
});


(async () => {
    // Start your app
    await app.start(+process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();

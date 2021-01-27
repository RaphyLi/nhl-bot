import { App, LogLevel } from '@slack/bolt';
import * as cron from 'node-cron';
import { CommandService } from './command.service';
import { DatabaseService } from './database.service';
import { HelpService } from './helpService';
import { ScheduleService } from './nhl/schedule.service';
import { StandingService } from './nhl/standings.service';
import { NotificationService } from './notification.service';
import { getYesterday } from './utils/helpers';
import mysql = require('mysql');

const databaseService = new DatabaseService();
const scheduleService = new ScheduleService();
const standingService = new StandingService();
const helpService = new HelpService();
const notificationService = new NotificationService(databaseService);
const commandService = new CommandService(scheduleService, standingService, notificationService, helpService);

databaseService.connection();
notificationService.init();

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    stateSecret: process.env.SLACK_STATE_SECRET,
    scopes: ['channels:history', 'chat:write', 'commands', 'groups:history', 'users:read', 'im:history', 'im:write', 'mpim:history'],
    logLevel: LogLevel.DEBUG,
    installationStore: {
        storeInstallation: async (installation) => {
            // change the line below so it saves to your database
            if (installation.isEnterpriseInstall) {
                // support for org wide app installation
                return await databaseService.query(`INSERT INTO Workspaces (teamId, token, installation) VALUES ('${installation.enterprise.id}', '${installation.bot.token}', '${JSON.stringify(installation)}')`);
            } else {
                // single team app installation
                return await databaseService.query(`INSERT INTO Workspaces (teamId, token, installation) VALUES ('${installation.team.id}', '${installation.bot.token}', '${JSON.stringify(installation)}')`);
            }
            throw new Error('Failed saving installation data to installationStore');
        },
        fetchInstallation: async (installQuery) => {
            // change the line below so it fetches from your database
            if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
                // org wide app installation lookup
                const query = await databaseService.query(`SELECT installation FROM Workspaces WHERE teamId = '${installQuery.enterpriseId}'`);
                return JSON.parse(query[0].installation);
            }
            if (installQuery.teamId !== undefined) {
                // single team app installation lookup
                const query = await databaseService.query(`SELECT installation FROM Workspaces WHERE teamId = '${installQuery.teamId}'`);
                return JSON.parse(query[0].installation);
            }
            throw new Error('Failed fetching installation');
        },
    },
});

const actions = {
    'schedule': scheduleService.get,
    'scores': () => scheduleService.get(getYesterday()),
    'live': scheduleService.live,
    'standings': standingService.get,
    'help': helpService.help,
    'on': (event) => notificationService.on(event),
    'off': (event) => notificationService.off(event)
}
const everyDayAt9am = '0 9 * * *';

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

cron.schedule(everyDayAt9am, () => {
    Promise.all([
        scheduleService.get(),
        scheduleService.get(getYesterday())
    ]).then(([matchOfTheDay, scoreYesterday]) => {
        const channels = notificationService.getChannels();
        channels.forEach(async channel => {
            console.log(channel);
            await app.client.chat.postMessage({
                channel: channel.channelId,
                attachments: matchOfTheDay.attachments,
                text: `NHL Games of the day's`,
                token: channel.token
            });
            await app.client.chat.postMessage({
                channel: channel.channelId,
                attachments: scoreYesterday.attachments,
                text: `The results of yesterday's NHL games`,
                token: channel.token
            });
        });
    });
});


(async () => {
    // Start your app
    await app.start(+process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();

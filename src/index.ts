import { App } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import * as cron from 'node-cron';
import { CommandService } from './command.service';
import { HelpService } from './nhl/helpService';
import { NotificationService } from './nhl/notificationService';
import { ScheduleService } from './nhl/schedule.service';
import { StandingService } from './nhl/standings.service';
import { getYesterday } from './utils/helpers';

let token: string = process.env.SLACK_BOT_TOKEN;
let signingSecret: string = process.env.SLACK_SIGNING_SECRET;
let channelId: string = process.env.SLACK_CHANNEL_ID;

const app = new App({
    token: token,
    signingSecret: signingSecret,
});

const webClient = new WebClient(token);
const scheduleService = new ScheduleService();
const standingService = new StandingService();
const helpService = new HelpService();
const notificationService = new NotificationService();
const commandService = new CommandService(scheduleService, standingService, notificationService, helpService);

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
let first = true;

app.command('/standing', async ({ command, ack, say }) => {
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

// Listens to incoming messages that contain "hello"
app.message(/^(schedule|scores|live|standings|help|on|off).*/, async ({ event, context, say }) => {
    // RegExp matches are inside of context.matches
    const greeting = context.matches[0];

    say(await actions[greeting](event));
});

app.error(async (error) => {
    // Check the details of the error to handle cases where you should retry sending a message or stop the app
    console.error(error);
});

cron.schedule(everyDayAt9am, () => {
    if (first) {
        first = false;
        return;
    }
    Promise.all([
        scheduleService.get(),
        scheduleService.get(getYesterday())
    ]).then(([matchOfTheDay, scoreYesterday]) => {
        const channelIds = notificationService.getChannelIds();
        channelIds.forEach(channelId => {
            webClient.chat.postMessage({
                channel: channelId,
                attachments: matchOfTheDay.attachments,
                text: ''
            });
            webClient.chat.postMessage({
                channel: channelId,
                attachments: scoreYesterday.attachments,
                text: ''
            });
        });
    });
});


(async () => {
    // Start your app
    await app.start(+process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();

import { App } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import * as cron from 'node-cron';
import { CommandService } from './command.service';
import { Help } from './nhl/help';
import { ScheduleService } from './nhl/schedule.service';
import { StandingService } from './nhl/standings.service';
import { getYesterday } from './utils/helpers';

let token: string = process.env.SLACK_BOT_TOKEN;
let signingSecret: string = process.env.SLACK_SIGNING_SECRET;
let channelId: string = process.env.SLACK_CHANNEL_ID;

token = 'xoxb-1620933655654-1620989265094-9DTCLNUhqVJ7Cb75hn1mtxuc';
signingSecret = 'ea2a23e8768e22b747ad558696ca88ae';
channelId = 'C01JF67JV1B';

const app = new App({
    token: token,
    signingSecret: signingSecret,
});
const webClient = new WebClient(token);
const scheduleService = new ScheduleService();
const standingService = new StandingService();
const commandService = new CommandService(scheduleService, standingService);
const help = new Help();

const actions = {
    'schedule': scheduleService.get,
    'scores': () => scheduleService.get(getYesterday()),
    'live': scheduleService.broadcasts,
    'standings': standingService.get,
    'help': help.help
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
// Listens to incoming messages that contain "hello"
// app.message(/^(schedule|scores|live|standings|help).*/, async ({ context, say }) => {
//     // RegExp matches are inside of context.matches
//     const greeting = context.matches[0];

//     say(await actions[greeting]());
// });

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


(async () => {
    // Start your app
    await app.start(+process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();

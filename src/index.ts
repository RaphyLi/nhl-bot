import { App } from '@slack/bolt';
import { WebClient } from '@slack/web-api';
import * as cron from 'node-cron';
import { Help } from './help';
import { Schedule } from './nhl/schedule';
import { getYesterday } from './utils/helpers';

const token: string = process.env.SLACK_BOT_TOKEN;
const signingSecret: string = process.env.SLACK_SIGNING_SECRET;
const channelId: string = process.env.SLACK_CHANNEL_ID;

const app = new App({
    token: token,
    signingSecret: signingSecret,
});
const webClient = new WebClient(token);
const schedule = new Schedule();
const help = new Help();

const actions = {
    'schedule': schedule.get,
    'scores': () => schedule.get(getYesterday()),
    'live': schedule.broadcasts,
    'help': help.help
}
const everyDayAt9am = '0 9 * * *';
let first = true;

// Listens to incoming messages that contain "hello"
app.message(/^(schedule|scores|live|help).*/, async ({ context, say }) => {
    // RegExp matches are inside of context.matches
    const greeting = context.matches[0];

    say(await actions[greeting]());
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
        schedule.get(),
        schedule.get(getYesterday())
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
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();

import { App, LogLevel } from '@slack/bolt';

const app = new App({
    token: 'xoxb-1620933655654-1620989265094-27Ndm71m3rpijS20KGHZJwfW',
    signingSecret: '7e196a6cd2452b62ded9f4b43f95dc51',
    logLevel: LogLevel.DEBUG,
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    if ('user' in message) {
        // console.log((message as GenericMessageEvent).user);
        // say() sends a message to the channel where the event was triggered
        await say(`Hey there <@${message.user}!`);
    }
});

app.error(async (error) => {
    // Check the details of the error to handle cases where you should retry sending a message or stop the app
    console.error(error);
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!');
})();

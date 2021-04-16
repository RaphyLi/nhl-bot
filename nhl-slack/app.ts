import { DatabaseService, getToday, getYesterday, ScheduleService } from '@nhl/common';
import { App, Installation, LogLevel } from '@slack/bolt';
import * as schedule from 'node-schedule';
import { CommandService, NotificationService, SyncService } from './services';

export class SlackApp {
  private app: App;

  constructor(
    private databaseService: DatabaseService,
    private commandService: CommandService,
    private notificationService: NotificationService,
    private syncService: SyncService,
    private scheduleService: ScheduleService
  ) {
    this.app = new App({
      signingSecret: process.env.SLACK_SIGNING_SECRET,
      clientId: process.env.SLACK_CLIENT_ID,
      clientSecret: process.env.SLACK_CLIENT_SECRET,
      stateSecret: process.env.SLACK_STATE_SECRET,
      scopes: [
        'channels:history',
        'chat:write',
        'commands',
        'groups:history',
        'users:read',
        'im:history',
        'im:write',
        'mpim:history'
      ],
      logLevel: LogLevel.DEBUG,
      installationStore: {
        storeInstallation: async (installation: Installation) => {
          // change the line below so it saves to your database
          if (installation.isEnterpriseInstall) {
            // support for org wide app installation
            return await this.databaseService.knex('Workspaces').insert([
              {
                teamId: installation.enterprise.id,
                token: installation.bot.token,
                installation: JSON.stringify(installation)
              }
            ]);
          } else {
            // single team app installation
            return await this.databaseService.knex('Workspaces').insert([
              {
                teamId: installation.team.id,
                token: installation.bot.token,
                installation: JSON.stringify(installation)
              }
            ]);
          }
          throw new Error('Failed saving installation data to installationStore');
        },
        fetchInstallation: async (installQuery) => {
          // change the line below so it fetches from your database
          if (installQuery.isEnterpriseInstall && installQuery.enterpriseId !== undefined) {
            // org wide app installation lookup
            const workspace = await this.databaseService
              .knex('Workspaces')
              .where({ teamId: installQuery.enterpriseId })
              .select('installation')
              .first();
            return JSON.parse(workspace.installation);
          }
          if (installQuery.teamId !== undefined) {
            // single team app installation lookup
            const workspace = await this.databaseService
              .knex('Workspaces')
              .where({ teamId: installQuery.teamId })
              .select('installation')
              .first();
            return JSON.parse(workspace.installation);
          }
          throw new Error('Failed fetching installation');
        }
      }
    });
  }

  start() {
    this.app.command('/standings', async ({ command, ack, say }) => {
      await ack();
      await say(await this.commandService.handleCommand(command));
    });

    this.app.command('/schedule', async ({ command, ack, say }) => {
      await ack();
      await say(await this.commandService.handleCommand(command));
    });

    this.app.command('/scores', async ({ command, ack, say }) => {
      await ack();
      await say(await this.commandService.handleCommand(command));
    });

    this.app.command('/teams', async ({ command, ack, say }) => {
      await ack();
      await say(await this.commandService.handleCommand(command));
    });

    this.app.command('/on', async ({ command, ack, say }) => {
      await ack();
      await say(await this.commandService.handleCommand(command));
    });

    this.app.command('/off', async ({ command, ack, say }) => {
      await ack();
      await say(await this.commandService.handleCommand(command));
    });

    this.app.error(async (error) => {
      // Check the details of the error to handle cases where you should retry sending a message or stop the app
      console.error(error);
    });

    return this.app.start(+process.env.PORT || 3000);
  }

  private job() {
    const everyDayAt9am = '0 9 * * *';
    const tz = 'America/Toronto';

    const job = {
      rule: everyDayAt9am,
      tz: tz
    } as schedule.RecurrenceSpecDateRange;

    schedule.scheduleJob(job, (fireDate) => {
      console.log(`Job at: ${fireDate.toString()}`);

      Promise.all([
        this.scheduleService.getScheduleByDay(getToday()),
        this.scheduleService.getScheduleByDay(getYesterday())
      ]).then(([matchOfTheDay, scoreYesterday]) => {
        const channels = this.notificationService.getChannels();
        channels.forEach(async (channel) => {
          console.log(channel);
          await this.app.client.chat.postMessage({
            channel: channel.channelId,
            attachments: matchOfTheDay.attachments,
            text: `NHL Games of the day's`,
            token: channel.workspaces.token
          });
          await this.app.client.chat.postMessage({
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
      await this.syncService.sync();
      console.log('[Sync]: Sync job done');
    });
  }
}

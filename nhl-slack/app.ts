import { DatabaseService } from '@nhl/common';
import { App, Installation, LogLevel } from '@slack/bolt';
import { Jobs } from './services/jobs.service';

export class SlackApp {
  private app: App;

  constructor(private databaseService: DatabaseService, private jobs: Jobs) {
    // private scheduleService: ScheduleService // // private syncService: SyncService, // private notificationService: NotificationService, // private commandService: CommandService, // private databaseService: DatabaseService,
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
    this.jobs.app = this.app;
  }

  start() {
    //   this.app.command('/standings', async ({ command, ack, say }) => {
    //     await ack();
    //     await say(await this.commandService.handleCommand(command));
    //   });

    //   this.app.command('/schedule', async ({ command, ack, say }) => {
    //     await ack();
    //     await say(await this.commandService.handleCommand(command));
    //   });

    //   this.app.command('/scores', async ({ command, ack, say }) => {
    //     await ack();
    //     await say(await this.commandService.handleCommand(command));
    //   });

    //   this.app.command('/teams', async ({ command, ack, say }) => {
    //     await ack();
    //     await say(await this.commandService.handleCommand(command));
    //   });

    //   this.app.command('/on', async ({ command, ack, say }) => {
    //     await ack();
    //     await say(await this.commandService.handleCommand(command));
    //   });

    //   this.app.command('/off', async ({ command, ack, say }) => {
    //     await ack();
    //     await say(await this.commandService.handleCommand(command));
    //   });

    //   this.app.error(async (error) => {
    //     // Check the details of the error to handle cases where you should retry sending a message or stop the app
    //     console.error(error);
    //   });

    return this.app.start(+process.env.PORT || 3000);
  }
}

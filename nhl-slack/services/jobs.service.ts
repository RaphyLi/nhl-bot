import { Cron, getToday, getYesterday, ScheduleService } from '@nhl/common';
import { Injectable } from '@nhl/core';
import { App } from '@slack/bolt';
import { NotificationService } from './notification.service';

@Injectable()
export class Jobs {
  private _app: App;

  constructor(
    private scheduleService: ScheduleService,
    private notificationService: NotificationService
  ) {}

  set app(app) {
    this._app = app;
  }

  @Cron('Game of the day', '0 9 * * *', { timezone: 'America/Toronto' })
  private getGameOfTheDay() {
    this.scheduleService.getScheduleByDay(getToday()).then((matchOfTheDay) => {
      if (matchOfTheDay) {
        const channels = this.notificationService.getChannels();
        channels.forEach(async (channel) => {
          console.log(channel);
          await this._app.client.chat.postMessage({
            channel: channel.channelId,
            attachments: matchOfTheDay.attachments,
            text: `NHL Games of the day's`,
            token: channel.workspaces.token
          });
        });
      }
    });
  }

  @Cron('Game of last day', '0 9 * * *', { timezone: 'America/Toronto' })
  private getGameOfLastDay() {
    this.scheduleService.getScheduleByDay(getYesterday()).then((scoreYesterday) => {
      if (scoreYesterday) {
        const channels = this.notificationService.getChannels();
        channels.forEach(async (channel) => {
          console.log(channel);
          await this.app.client.chat.postMessage({
            channel: channel.channelId,
            attachments: scoreYesterday.attachments,
            text: `The results of yesterday's NHL games`,
            token: channel.workspaces.token
          });
        });
      }
    });
  }
}

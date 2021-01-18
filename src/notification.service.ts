import { BotMessageEvent } from '@slack/bolt';
import { DatabaseService } from './database.service';

export class NotificationService {
    private channelIds: Array<string>;

    constructor(private databaseService: DatabaseService) {
    }

    public async init() {
        const result = await this.databaseService.query('SELECT channelId FROM SLACK.ChannelsNotification');
        console.log(result);
        this.channelIds = result;
    }

    public on(channelId: string): BotMessageEvent {
        const channelIdIdx = this.channelIds.findIndex(x => x === channelId);
        if (channelIdIdx === -1) {
            this.channelIds.push(channelId);
            this.databaseService.query(`INSERT INTO SLACK.ChannelsNotification (channelId) VALUES ${channelId}`);
            return {
                text: 'notification is turned on this channel'
            } as BotMessageEvent;
        }
    }

    public off(channelId: string): BotMessageEvent {
        const channelIdIdx = this.channelIds.findIndex(x => x === channelId);
        if (channelIdIdx !== -1) {
            this.channelIds.splice(channelIdIdx, 1);
            this.databaseService.query(`DELETE SLACK.ChannelsNotification WHERE channelId = ${channelId}`);
        }
        return {
            text: 'notification is turned off'
        } as BotMessageEvent;
    }

    public getChannelIds() {
        return this.channelIds;
    }
}

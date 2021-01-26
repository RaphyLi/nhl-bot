import { BotMessageEvent } from '@slack/bolt';
import { DatabaseService } from './database.service';

export class NotificationService {
    private channelIds: Array<string>;

    constructor(private databaseService: DatabaseService) {
    }

    public async init() {
        const result = await this.databaseService.query('SELECT channelId FROM ChannelsNotification');
        this.channelIds = result || [];
    }

    public async on(channelId: string): Promise<BotMessageEvent> {
        const channelIdIdx = this.channelIds.findIndex(x => x === channelId);
        if (channelIdIdx === -1) {
            this.channelIds.push(channelId);
            await this.databaseService.query(`INSERT INTO ChannelsNotification (channelId) VALUES ('${channelId}')`);
            return {
                text: 'notification is turned on this channel'
            } as BotMessageEvent;
        }
    }

    public async off(channelId: string): Promise<BotMessageEvent> {
        const channelIdIdx = this.channelIds.findIndex(x => x === channelId);
        if (channelIdIdx !== -1) {
            this.channelIds.splice(channelIdIdx, 1);
            await this.databaseService.query(`DELETE ChannelsNotification WHERE channelId = '${channelId}'`);
        }
        return {
            text: 'notification is turned off'
        } as BotMessageEvent;
    }

    public getChannelIds() {
        return this.channelIds;
    }
}

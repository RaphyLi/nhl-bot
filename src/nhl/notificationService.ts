import { BotMessageEvent } from '@slack/bolt';

export class NotificationService {
    private channelIds: Array<string>;

    constructor() {
        this.channelIds = [];
    }

    on(channelId: string): BotMessageEvent {
        this.channelIds.push(channelId);
        return {
            text: 'notification is turned on this channel'
        } as BotMessageEvent;
    }

    off(channelId: string): BotMessageEvent {
        const channelIdIdx = this.channelIds.findIndex(x => x === channelId);
        if (channelIdIdx !== -1) {
            this.channelIds.splice(channelIdIdx, 1);
        }
        return {
            text: 'notification is turned off'
        } as BotMessageEvent;
    }

    getChannelIds() {
        return this.channelIds;
    }
}

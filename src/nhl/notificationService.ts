
export class NotificationService {
    private channelIds: Array<string>;

    constructor() {
        this.channelIds = [];
    }

    on(channelId: string): boolean {
        this.channelIds.push(channelId);
        return true;
    }

    off(channelId: string): boolean {
        const channelIdIdx = this.channelIds.findIndex(x => x === channelId);
        if (channelIdIdx !== -1) {
            this.channelIds.splice(channelIdIdx, 1);
            return true;
        }
        return false;
    }

    getChannelIds() {
        return this.channelIds;
    }
}

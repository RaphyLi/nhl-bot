import { BotMessageEvent, SlashCommand } from '@slack/bolt';
import { ChannelsNotification } from './channels-notification.model';
import { DatabaseService } from './database.service';

export class NotificationService {
    private channels: Array<ChannelsNotification>;

    constructor(private databaseService: DatabaseService) {
    }

    public async init() {
        const result = await this.databaseService
            .query('SELECT channel.id as id, channel.channelId as channelId, channel.teamId as teamId, wk.token as token ' +
                'FROM ChannelsNotification as channel ' +
                'INNER JOIN Workspaces as wk ' +
                'ON wk.teamId = channel.teamId;');
        this.channels = [];
        if (result && result.length > 0) {
            this.channels = result.map(item => {
                return {
                    id: item.id,
                    channelId: item.channelId,
                    token: item.token,
                    teamId: item.teamId
                }
            });
        }
    }

    public async on(command: SlashCommand): Promise<BotMessageEvent> {
        const channelIdIdx = this.channels.findIndex(x => x.channelId === command.channel_id);
        if (channelIdIdx === -1) {
            const result = await this.databaseService.query(`SELECT token FROM Workspaces WHERE teamId = '${command.team_id}'`);
            const channel = { channelId: command.channel_id, teamId: command.team_id, token: result[0].token } as ChannelsNotification;
            this.channels.push(channel);
            await this.databaseService.query(`INSERT INTO ChannelsNotification (channelId, teamId) VALUES ('${channel.channelId}', '${channel.teamId}')`);
            return {
                text: 'notification is turned on this channel'
            } as BotMessageEvent;
        }
    }

    public async off(command: SlashCommand): Promise<BotMessageEvent> {
        const channelIdIdx = this.channels.findIndex(x => x.channelId === command.channel_id);
        if (channelIdIdx !== -1) {
            this.channels.splice(channelIdIdx, 1);
            await this.databaseService.query(`DELETE ChannelsNotification WHERE channelId = '${command.channel_id}'`);
        }
        return {
            text: 'notification is turned off'
        } as BotMessageEvent;
    }

    public getChannels() {
        return this.channels;
    }
}

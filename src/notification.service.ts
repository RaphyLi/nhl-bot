import { BotMessageEvent, SlashCommand } from '@slack/bolt';
import { DatabaseService } from './database.service';
import { ChannelsNotification } from './models/channels-notification.model';
import { Workspaces } from './models/workspaces.model';

export class NotificationService {
    private channels: Array<ChannelsNotification> = new Array<ChannelsNotification>();

    constructor(private databaseService: DatabaseService) {
    }

    public async init() {
        const result = await this.databaseService.knex('ChannelsNotification',)
            .innerJoin('Workspaces', 'Workspaces.teamId', '=', 'ChannelsNotification.teamId')
            .select()
            .options({ nestTables: true })
            .then(rows =>
                rows.map((item) => (
                    {
                        ...item.ChannelsNotification,
                        workspaces: item.Workspaces
                    } as ChannelsNotification)
                )
            );
        if (result && result.length > 0) {
            this.channels = result;
        }
    }

    public async on(command: SlashCommand): Promise<BotMessageEvent> {
        const channelIdIdx = this.channels.findIndex(x => x.channelId === command.channel_id);
        if (channelIdIdx === -1) {
            const result = await this.databaseService.knex<Workspaces>('Workspaces').where({ teamId: command.team_id }).first();
            const channel = { channelId: command.channel_id, teamId: command.team_id, workspaces: result } as ChannelsNotification;
            await this.databaseService.knex('ChannelsNotification').insert({ channelId: channel.channelId, teamId: channel.teamId });
            this.channels.push(channel);
            return {
                text: 'notification is turned on this channel'
            } as BotMessageEvent;
        }
    }

    public async off(command: SlashCommand): Promise<BotMessageEvent> {
        const channelIdIdx = this.channels.findIndex(x => x.channelId === command.channel_id);
        if (channelIdIdx !== -1) {
            this.channels.splice(channelIdIdx, 1);
            await this.databaseService.knex('ChannelsNotification').where({ channelId: command.channel_id }).delete().then();
        }
        return {
            text: 'notification is turned off'
        } as BotMessageEvent;
    }

    public getChannels() {
        return this.channels;
    }
}

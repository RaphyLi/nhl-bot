import { Workspaces } from './workspaces.model';

export class ChannelsNotification {
    id: number;
    channelId: string;
    teamId: string;

    workspaces: Workspaces;
}

import { SlashCommand } from '@slack/bolt';
import { HelpService } from './helpService';
import { ScheduleService } from './nhl/schedule.service';
import { StandingService } from './nhl/standings.service';
import { NotificationService } from './notification.service';
import { getYesterday } from './utils/helpers';

export class CommandService {
    private commandAction = {
        'standings': async (command: SlashCommand) => await this.standingService.get(command),
        'schedule': async (command: SlashCommand) => await this.scheduleService.get(),
        'scores': async (command: SlashCommand) => await this.scheduleService.get(getYesterday()),
        'live': async (command: SlashCommand) => await this.scheduleService.live(),
        'on': async (command: SlashCommand) => await this.notificationService.on(command),
        'off': async (command: SlashCommand) => await this.notificationService.off(command),
        'help': async (command: SlashCommand) => await this.helpService.help(),
    }
    constructor(
        private scheduleService: ScheduleService,
        private standingService: StandingService,
        private notificationService: NotificationService,
        private helpService: HelpService) {
    }

    public async handleCommand(command: SlashCommand) {
        return await this.commandAction[command.command.substring(1, command.command.length)](command);
    }
}

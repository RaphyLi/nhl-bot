import { SlashCommand } from '@slack/bolt';
import { ScheduleService } from './nhl/schedule.service';
import { StandingService } from './nhl/standings.service';
import { getYesterday } from './utils/helpers';

export class CommandService {
    private commandAction = {
        'standings': async (command: SlashCommand) => await this.standingService.get(command),
        'schedule': async (command: SlashCommand) => await this.scheduleService.get(),
        'scores': async (command: SlashCommand) => await this.scheduleService.get(getYesterday())
    }
    constructor(private scheduleService: ScheduleService, private standingService: StandingService) {
    }

    public async handleCommand(command: SlashCommand) {
        return await this.commandAction[command.command.substring(1, command.command.length)](command);
    }
}

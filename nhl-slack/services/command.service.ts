import { SlashCommand } from '@slack/bolt';
import { Injectable } from '@nhl/core';
import type { ScheduleService, StandingService, TeamService } from '@nhl/common';
import { getYesterday } from '@nhl/common';
import type { NotificationService } from './notification.service';
import type { HelpService } from './help.service';

@Injectable()
export class CommandService {
  private commandAction = {
    standings: async (command: SlashCommand) => await this.standingService.get(command),
    schedule: async (command: SlashCommand) => await this.scheduleService.schedule(command),
    scores: async (command: SlashCommand) =>
      await this.scheduleService.getScheduleByDay(getYesterday()),
    live: async (command: SlashCommand) => await this.scheduleService.live(),
    teams: async (command: SlashCommand) => await this.teamService.get(),
    on: async (command: SlashCommand) => await this.notificationService.on(command),
    off: async (command: SlashCommand) => await this.notificationService.off(command),
    help: async (command: SlashCommand) => await this.helpService.help()
  };

  constructor(
    private scheduleService: ScheduleService,
    private standingService: StandingService,
    private notificationService: NotificationService,
    private teamService: TeamService,
    private helpService: HelpService
  ) {}

  public async handleCommand(command: SlashCommand) {
    return await this.commandAction[command.command.substring(1, command.command.length)](command);
  }
}

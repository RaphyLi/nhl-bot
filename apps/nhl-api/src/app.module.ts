import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FranchiseController } from './franchise/franchise.controller';
import { FranchiseService } from './franchise/franchise.service';
import { ScheduleService } from './schedule/schedule.service';
import { SeasonService } from './season/season.service';
import { TeamService } from './team/team.service';

@Module({
  imports: [HttpModule],
  controllers: [FranchiseController],
  providers: [FranchiseService, ScheduleService, SeasonService, TeamService],
})
export class AppModule {}
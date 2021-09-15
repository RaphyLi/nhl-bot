import { Module } from '@nestjs/common';
import { NhlSlackController } from './nhl-slack.controller';
import { NhlSlackService } from './nhl-slack.service';

@Module({
  imports: [],
  controllers: [NhlSlackController],
  providers: [NhlSlackService],
})
export class NhlSlackModule {}

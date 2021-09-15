import { Controller, Get } from '@nestjs/common';
import { NhlSlackService } from './nhl-slack.service';

@Controller()
export class NhlSlackController {
  constructor(private readonly nhlSlackService: NhlSlackService) {}

  @Get()
  getHello(): string {
    return this.nhlSlackService.getHello();
  }
}

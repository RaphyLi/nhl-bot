import { Controller, Get } from '@nhl/api';
import { ScheduleService } from '@nhl/common';

@Controller('/franchise')
export class FranchiseController {
  constructor(private test: ScheduleService) {}

  @Get()
  public getAll() {}
}

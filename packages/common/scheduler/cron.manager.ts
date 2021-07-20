import * as schedule from 'node-schedule';
import { CronMetadata } from './metadata/cron.metadata';
import { getStorageMetada } from './index';
import { NHLContainer } from '../../core/injector/container';

export interface CronOptions {
  timezone?: string;
  startDate?: Date;
  endDate?: Date;
}

export interface CronJob {
  job: schedule.Job;
  cronMetadata: CronMetadata;
}

export class CronManager {
  private cronJobs: CronJob[] = [];

  constructor(private nhlContainer: NHLContainer) {}

  public registerCrons() {
    const crons = getStorageMetada().crons.map((c) => {
      const instance = this.nhlContainer.get(c.target as any);
      return new CronMetadata(c, instance);
    });
    crons.forEach((cron) => {
      const cronParams: schedule.RecurrenceSpecDateRange = {
        rule: cron.cronTime as string, // TODO regarde pour mettre une Date ou un moment.time
        tz: cron.options.timezone,
        start: cron.options.startDate,
        end: cron.options.endDate
      };
      const cronJob = schedule.scheduleJob(cronParams, cron.instance[cron.method]);
      this.cronJobs.push({
        job: cronJob,
        cronMetadata: null
      });
    });
  }
}

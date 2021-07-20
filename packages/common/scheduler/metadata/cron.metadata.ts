import { Type } from '@nhl/core';
import { CronOptions } from '../cron.manager';
import { CronMetadataArgs } from './storage.metadata';
// importo { container } from '../../../core/injector/container';

export class CronMetadata {
  target: Function;
  method: string;
  name: string;
  cronTime: string | Date | moment.Moment;
  options: CronOptions;
  instance: Type<any>;

  constructor(args: CronMetadataArgs, instance: Type<any>) {
    this.target = args.target;
    this.method = args.method;
    this.name = args.name;
    this.cronTime = args.cronTime;
    this.options = args.options;
    this.instance = instance;
  }
}

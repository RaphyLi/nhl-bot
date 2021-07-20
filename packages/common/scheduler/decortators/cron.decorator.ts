import { CronOptions, getStorageMetada } from '../index';

export function Cron(
  name: string,
  cronTime: string | Date | moment.Moment,
  options: CronOptions = {}
) {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    getStorageMetada().addCronMetadata({
      target: target.constructor,
      name: name,
      method: key as string,
      cronTime: cronTime,
      options: options
    });
  };
}

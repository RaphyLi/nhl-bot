import * as moment from 'moment';
import { CronOptions } from '../cron.manager';

export interface CronMetadataArgs {
  target: Function;
  method: string;
  name: string;
  cronTime: string | Date | moment.Moment;
  options: CronOptions;
}

export class StorageMetada {
  private _crons: CronMetadataArgs[] = [];

  get crons(): CronMetadataArgs[] {
    return this._crons;
  }

  public addCronMetadata(metadata: CronMetadataArgs): void {
    if (this._crons.filter((c) => c.name === metadata.name).length <= 0) {
      this._crons.push(metadata);
    } else {
      console.warn(
        `Cron '${metadata.name}' could not be mounted, a cron job with the same name already exists.`
      );
    }
  }
}

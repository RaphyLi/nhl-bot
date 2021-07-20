import type { DatabaseService } from '@nhl/common';
import { Logger } from '@nhl/common';

export class NHLApplicationStatic {
  private readonly logger = new Logger('NHLApplication');

  public create(): Promise<void> {
    return new Promise((resolve, reject) => {
      // this.databaseService.connect();
      resolve();
    });
  }
}

// export const NHLApplication = new NHLApplicationStatic();

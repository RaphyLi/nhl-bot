import { Injectable } from '@nhl/core';
import { Season } from '../models';
import { fetch } from '../util/fetch';

@Injectable()
export class SeasonService {
  private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

  sync(): Promise<Array<Season>> {
    return new Promise((resolve, reject) => {
      fetch<{ copyright: string; seasons: Array<Season> }>(this.BASE_URL + `/seasons`).then(
        (result) => {
          resolve(result.seasons);
        }
      );
    });
  }
}

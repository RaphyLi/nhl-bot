import { fetch } from '../util/fetch';
import { Franchise } from '../models/franchise';
import { Injectable } from '@nhl/core';

@Injectable()
export class FranchiseService {
  private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

  sync(): Promise<Array<Franchise>> {
    return new Promise((resolve, reject) => {
      fetch<{ copyright: string; franchises: Array<Franchise> }>(
        this.BASE_URL + `/franchises`
      ).then((result) => {
        resolve(result.franchises);
      });
    });
  }
}

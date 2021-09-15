// import { Season } from '@nhl/common';
// import { fetch } from '@nhl/common';
// import { Injectable } from '@nhl/core';

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, Observable } from 'rxjs';
import { Season } from '@nhl/core';

@Injectable()
export class SeasonService {
  private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

  constructor(private httpService: HttpService) {}

  getAll(): Observable<Array<Season>> {
    return this.httpService
      .get(`${this.BASE_URL}/seasons`)
      .pipe(
        map(
          (result) =>
            (result.data as { copyright: string; seasons: Array<Season> })
              .seasons,
        ),
      );
  }
}

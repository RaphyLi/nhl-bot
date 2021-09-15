import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import qs from 'qs';
import { NHL, NHLDate } from '@nhl/core';
import { map, Observable } from 'rxjs';

@Injectable()
export class ScheduleService {
  private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

  constructor(private httpService: HttpService) {}

  getAll(seasonId: string): Observable<Array<NHLDate>> {
    const options = { season: seasonId, expand: 'schedule.linescore' };
    return this.httpService
      .get(
        `${this.BASE_URL}/schedule${
          options ? '?' + qs.stringify(options) : ''
        }`,
      )
      .pipe(map((result) => (result.data as NHL).dates));
  }
}

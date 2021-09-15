import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { map, Observable } from 'rxjs';
import { Team } from '@nhl/core';

@Injectable()
export class TeamService {
  private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

  constructor(private httpService: HttpService) {}

  getAll(): Observable<Array<Team>> {
    return this.httpService
      .get(`${this.BASE_URL}/teams`)
      .pipe(
        map(
          (result) =>
            (result.data as { copyright: string; teams: Array<Team> }).teams,
        ),
      );
  }
}

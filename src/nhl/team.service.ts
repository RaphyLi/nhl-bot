import fetch from '../utils/fetch';
import { Team } from './models/teams';

export class TeamService {
    private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

    getAll(): Promise<Array<Team>> {
        return new Promise((resolve, reject) => {
            fetch<{ copyright: string, teams: Array<Team> }>(this.BASE_URL + `/teams`).then((result) => {
                resolve(result.teams);
            });
        });
    }
}

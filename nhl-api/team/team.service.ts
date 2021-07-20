// import { Season, Team } from '@nhl/common';
// import { fetch } from '@nhl/common';
// import { Injectable } from '@nhl/core';
// import qs from 'qs';

// @Injectable()
// export class TeamService {
//   private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

//   sync(): Promise<Array<Team>> {
//     return new Promise((resolve, reject) => {
//       fetch<{ copyright: string; teams: Array<Team> }>(this.BASE_URL + `/teams`).then((result) => {
//         resolve(result.teams);
//       });
//     });
//   }
// }

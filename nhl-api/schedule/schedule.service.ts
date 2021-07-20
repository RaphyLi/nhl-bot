// import { NHL, NHLDate } from '@nhl/common';
// import { fetch } from '@nhl/common';
// import { Injectable } from '@nhl/core';
// import qs from 'qs';

// @Injectable()
// export class ScheduleService {
//   private BASE_URL = 'https://statsapi.web.nhl.com/api/v1';

//   sync(seasonId: string): Promise<Array<NHLDate>> {
//     let options = { season: seasonId, expand: 'schedule.linescore' };
//     return new Promise((resolve, reject) => {
//       fetch<NHL>(this.BASE_URL + `/schedule${options ? '?' + qs.stringify(options) : ''}`).then(
//         (result) => {
//           resolve(result.dates);
//         }
//       );
//     });
//   }
// }

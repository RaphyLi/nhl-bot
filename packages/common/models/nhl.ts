import { NHLDate } from './dates';

export interface NHL {
    copyright: string;
    totalItems: number;
    totalEvents: number;
    totalGames: number;
    totalMatches: number;
    wait: number;
    dates: Array<NHLDate>;
}

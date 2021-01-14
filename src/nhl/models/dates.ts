import { Games } from './game';

export interface NHLDate {
    date: Date;
    totalItems: number;
    totalEvents: number;
    totalGames: number;
    totalMatches: number;
    games: Array<Games>;
    events: Array<any>;
    matches: Array<any>;
}

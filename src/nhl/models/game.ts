import { Team, Teams } from './teams';

export interface Games {
    gamePk: number,
    link: string,
    gameType: string,
    season: string,
    gameDate: Date,
    status: Status;
    teams: Teams;
    venue: Venue;
    content: Content;
}

export interface Status {
    abstractGameState: string;
    codedGameState: string;
    detailedState: string;
    statusCode: string;
    startTimeTBD: boolean;
}

export interface Venue {
    name: string;
    link: string;
}

export interface Content {
    link: string;
}

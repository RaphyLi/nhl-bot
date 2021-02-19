import { Away, Home, Teams } from './teams';

export interface Game {
    gamePk: number,
    link: string,
    gameType: string,
    season: string,
    gameDate: string,
    status: Status;
    teams: Teams;
    linescore: Linescore;
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

export interface Linescore {
    currentPeriod: number;
    currentPeriodOrdinal: string;
    currentPeriodTimeRemaining: string;
    periods: Period[];
    shootoutInfo: ShootoutInfo;
    teams: Teams;
    powerPlayStrength: string;
    hasShootout: boolean;
    intermissionInfo: IntermissionInfo;
    powerPlayInfo: PowerPlayInfo;
}

export interface Period {
    periodType: string;
    startTime: Date;
    endTime: Date;
    num: number;
    ordinalNum: string;
    home: Home;
    away: Away;
}

export interface ShootoutInfo {
    away: Away;
    home: Home;
}

export interface IntermissionInfo {
    intermissionTimeRemaining: number;
    intermissionTimeElapsed: number;
    inIntermission: boolean;
}

export interface PowerPlayInfo {
    situationTimeRemaining: number;
    situationTimeElapsed: number;
    inSituation: boolean;
}

export interface Venue {
    name: string;
    link: string;
}

export interface Content {
    link: string;
}

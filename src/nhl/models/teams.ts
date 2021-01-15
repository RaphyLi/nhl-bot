export interface LeagueRecord {
    wins: number;
    losses: number;
    ot: number;
    type: string;
}

export interface Team {
    id: number;
    name: string;
    link: string;
}

export interface Away {
    leagueRecord: LeagueRecord;
    score: number;
    team: Team;
    goals : number;
    shotsOnGoal : number;
    goaliePulled : boolean;
    numSkaters : number;
    powerPlay : boolean;
}

export interface Home {
    leagueRecord: LeagueRecord;
    score: number;
    team: Team;
    goals : number;
    shotsOnGoal : number;
    goaliePulled : boolean;
    numSkaters : number;
    powerPlay : boolean;
}

export interface Teams {
    away: Away;
    home: Home
}

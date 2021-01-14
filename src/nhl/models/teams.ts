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
}

export interface Home {
    leagueRecord: LeagueRecord;
    score: number;
    team: Team;
}

export interface Teams {
    away: Away;
    home: Home
}

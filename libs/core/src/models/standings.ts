import { LeagueRecord, Team } from './teams';

export interface Standings {
  copyright: string;
  records: Array<Record>;
}
export interface Record {
  conference: Conference;
  division: Division;
  league: League;
  standingsType: string;
  teamRecords: Array<TeamRecord>;
}

export interface Conference {
  id: number;
  link: string;
  name: string;
}

export interface Division {
  id: number;
  link: string;
  name: string;
  abbreviation: string;
  conference: Conference;
  active: boolean;
}

export interface League {
  id: number;
  link: string;
  name: string;
}

export interface TeamRecord {
  conferenceHomeRank: string;
  conferenceL10Rank: string;
  conferenceRank: string;
  conferenceRoadRank: string;
  divisionHomeRank: string;
  divisionL10Rank: string;
  divisionRank: string;
  divisionRoadRank: string;
  gamesPlayed: number;
  goalsAgainst: number;
  goalsScored: number;
  lastUpdated: Date;
  leagueHomeRank: string;
  leagueL10Rank: string;
  leagueRank: string;
  leagueRecord: LeagueRecord;
  leagueRoadRank: string;
  points: number;
  pointsPercentage: number;
  ppConferenceRank: string;
  ppDivisionRank: string;
  ppLeagueRank: string;
  regulationWins: number;
  row: number;
  streak: Streak;
  team: Team;
  wildCardRank: string;
  records: StandingRecord;
}

export interface StandingRecord {
  overallRecords: Array<OverallRecord>;
}
export interface OverallRecord {
  wins: number;
  losses: number;
  ot: number;
  type: string;
}

export interface Streak {
  streakCode: string;
  streakNumber: number;
  streakType: string;
}

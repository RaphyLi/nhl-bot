import { Franchise } from './franchise';
import { Venue } from './game';
import { Conference, Division } from './standings';

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
  venue: Venue;
  abbreviation: string;
  teamName: string;
  locationName: string;
  firstYearOfPlay: string;
  division: Division;
  conference: Conference;
  franchise: Franchise;
  shortName: string;
  officialSiteUrl: string;
  franchiseId: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Away {
  leagueRecord: LeagueRecord;
  score: number;
  team: Team;
  goals: number;
  shotsOnGoal: number;
  goaliePulled: boolean;
  numSkaters: number;
  powerPlay: boolean;
  rinkSide: string;
}

export interface Home {
  leagueRecord: LeagueRecord;
  score: number;
  team: Team;
  goals: number;
  shotsOnGoal: number;
  goaliePulled: boolean;
  numSkaters: number;
  powerPlay: boolean;
  rinkSide: string;
}

export interface Teams {
  away: Away;
  home: Home;
}

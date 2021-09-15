export interface Season {
  seasonId: string;
  regularSeasonStartDate: Date;
  regularSeasonEndDate: Date;
  seasonEndDate: Date;
  numberOfGames: number;
  tiesInUse: boolean;
  olympicsParticipation: boolean;
  conferencesInUse: boolean;
  divisionsInUse: boolean;
  wildCardInUse: boolean;
  createdAt: Date;
  updatedAt: Date;
}

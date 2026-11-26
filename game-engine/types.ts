export type Position =
  | 'GK'
  | 'CB'
  | 'LB'
  | 'RB'
  | 'CDM'
  | 'CM'
  | 'CAM'
  | 'LM'
  | 'RM'
  | 'LW'
  | 'RW'
  | 'ST';

export type PositionCategory = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface PlayerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  gk: number;
}

export interface Player {
  id: string;
  name: string;
  age: number;
  nationality: string;
  position: Position;
  clubId: string;
  potential: number;
  value: number; // in EUR/GBP
  wage: number; // weekly wage
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  gk: number;
  ovr?: number; // computed
}

export interface Club {
  id: string;
  name: string;
  leagueId: string;
  budget: number;
  reputation?: number; // 1-5 stars
  primaryColor?: string;
  secondaryColor?: string;
}

export interface League {
  id: string;
  name: string;
  country: string;
}

export interface SaveRecord {
  id: string;
  name: string;
  clubId: string;
  money: number;
  week: number;
  season: number;
  weeklyTrainingUsed: number;
  modsOn: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Fixture {
  id: string;
  name: string;
  week: number;
  homeClubId: string;
  awayClubId: string;
  played: boolean;
}

export interface MatchResult {
  id: string;
  name: string;
  fixtureId: string;
  homeGoals: number;
  awayGoals: number;
  events: string; // JSON string or text summary
}

export const LARK_BASE_TOKEN = 'NzpwbpB3eaKoKysbuDjl9kf2gmg';

export const TABLE_IDS = {
  LEAGUES: 'tbls5am25n1zTmoX',
  CLUBS: 'tblvjQKU7muBc7dH',
  PLAYERS: 'tblea9KeklRN5Hl5',
  FIXTURES: 'tbl3Mtp6MeALczSu',
  MATCH_RESULTS: 'tbl1wy9DktzhoGI2',
  SAVES: 'tblCt0ndWW8wfoRw',
} as const;

export const TABLE_NAMES = {
  LEAGUES: 'Leagues',
  CLUBS: 'Clubs',
  PLAYERS: 'Players',
  FIXTURES: 'Fixtures',
  MATCH_RESULTS: 'MatchResults',
  SAVES: 'Saves',
} as const;

/**
 * Lark Base field names matching exactly the schema confirmed in base NzpwbpB3eaKoKysbuDjl9kf2gmg
 */
export const FIELD_NAMES = {
  Leagues: {
    NAME: 'Name',
    COUNTRY: 'Country',
  },
  Clubs: {
    NAME: 'Name',
    LEAGUE_ID: 'LeagueId',
    BUDGET: 'Budget',
  },
  Players: {
    NAME: 'Name',
    AGE: 'Age',
    NATIONALITY: 'Nationality',
    POSITION: 'Position',
    CLUB_ID: 'ClubId',
    POTENTIAL: 'Potential',
    VALUE: 'Value',
    WAGE: 'Wage',
    PACE: 'Pace',
    SHOOTING: 'Shooting',
    PASSING: 'Passing',
    DRIBBLING: 'Dribbling',
    DEFENDING: 'Defending',
    PHYSICAL: 'Physical',
    GK: 'GK',
  },
  Saves: {
    NAME: 'Name',
    CLUB_ID: 'ClubId',
    MONEY: 'Money',
    WEEK: 'Week',
    SEASON: 'Season',
    WEEKLY_TRAINING_USED: 'WeeklyTrainingUsed',
    MODS_ON: 'ModsOn',
  },
  Fixtures: {
    NAME: 'Name',
    WEEK: 'Week',
    HOME_CLUB_ID: 'HomeClubId',
    AWAY_CLUB_ID: 'AwayClubId',
    PLAYED: 'Played',
  },
  MatchResults: {
    NAME: 'Name',
    FIXTURE_ID: 'FixtureId',
    HOME_GOALS: 'HomeGoals',
    AWAY_GOALS: 'AwayGoals',
    EVENTS: 'Events',
  },
} as const;

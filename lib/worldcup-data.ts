// 2026 FIFA World Cup - Real group draw and match schedule
// Source: Official FIFA draw held December 5, 2025

export interface Team {
  name: string;
  code: string;
  flag: string;
}

export interface GroupMatch {
  matchId: string;
  group: string;
  matchNumber: number;
  home: string;
  away: string;
  date: string;
  venue: string;
  city: string;
}

export interface Group {
  id: string;
  name: string;
  teams: string[];
}

// All 48 teams organized into 12 groups of 4
export const GROUPS: Group[] = [
  {
    id: 'A',
    name: 'Group A',
    teams: ['Mexico', 'South Africa', 'South Korea', 'Czechia'],
  },
  {
    id: 'B',
    name: 'Group B',
    teams: ['Canada', 'Switzerland', 'Qatar', 'Bosnia and Herzegovina'],
  },
  {
    id: 'C',
    name: 'Group C',
    teams: ['Brazil', 'Morocco', 'Haiti', 'Scotland'],
  },
  {
    id: 'D',
    name: 'Group D',
    teams: ['United States', 'Paraguay', 'Australia', 'Turkey'],
  },
  {
    id: 'E',
    name: 'Group E',
    teams: ['Germany', 'Curacao', "Cote d'Ivoire", 'Ecuador'],
  },
  {
    id: 'F',
    name: 'Group F',
    teams: ['Netherlands', 'Japan', 'Sweden', 'Tunisia'],
  },
  {
    id: 'G',
    name: 'Group G',
    teams: ['Belgium', 'Egypt', 'Iran', 'New Zealand'],
  },
  {
    id: 'H',
    name: 'Group H',
    teams: ['Spain', 'Cabo Verde', 'Saudi Arabia', 'Uruguay'],
  },
  {
    id: 'I',
    name: 'Group I',
    teams: ['France', 'Senegal', 'Norway', 'Iraq'],
  },
  {
    id: 'J',
    name: 'Group J',
    teams: ['Argentina', 'Algeria', 'Austria', 'Jordan'],
  },
  {
    id: 'K',
    name: 'Group K',
    teams: ['Portugal', 'DR Congo', 'Uzbekistan', 'Colombia'],
  },
  {
    id: 'L',
    name: 'Group L',
    teams: ['England', 'Croatia', 'Ghana', 'Panama'],
  },
];

// All 48 group stage matches
// Each group has 3 matchdays, 2 matches per matchday = 6 matches per group
// Match IDs: A1-A6, B1-B6, ..., L1-L6
export const GROUP_MATCHES: GroupMatch[] = [
  // GROUP A - Mexico, South Africa, South Korea, Czechia
  {
    matchId: 'A1',
    group: 'A',
    matchNumber: 1,
    home: 'Mexico',
    away: 'South Africa',
    date: '2026-06-11',
    venue: 'Estadio Azteca',
    city: 'Mexico City',
  },
  {
    matchId: 'A2',
    group: 'A',
    matchNumber: 2,
    home: 'South Korea',
    away: 'Czechia',
    date: '2026-06-11',
    venue: 'Estadio Akron',
    city: 'Guadalajara',
  },
  {
    matchId: 'A3',
    group: 'A',
    matchNumber: 3,
    home: 'Czechia',
    away: 'South Africa',
    date: '2026-06-18',
    venue: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
  },
  {
    matchId: 'A4',
    group: 'A',
    matchNumber: 4,
    home: 'Mexico',
    away: 'South Korea',
    date: '2026-06-18',
    venue: 'Estadio Akron',
    city: 'Guadalajara',
  },
  {
    matchId: 'A5',
    group: 'A',
    matchNumber: 5,
    home: 'Czechia',
    away: 'Mexico',
    date: '2026-06-24',
    venue: 'Estadio Azteca',
    city: 'Mexico City',
  },
  {
    matchId: 'A6',
    group: 'A',
    matchNumber: 6,
    home: 'South Africa',
    away: 'South Korea',
    date: '2026-06-24',
    venue: 'Estadio BBVA',
    city: 'Monterrey',
  },

  // GROUP B - Canada, Switzerland, Qatar, Bosnia and Herzegovina
  {
    matchId: 'B1',
    group: 'B',
    matchNumber: 1,
    home: 'Canada',
    away: 'Bosnia and Herzegovina',
    date: '2026-06-12',
    venue: 'BMO Field',
    city: 'Toronto',
  },
  {
    matchId: 'B2',
    group: 'B',
    matchNumber: 2,
    home: 'Qatar',
    away: 'Switzerland',
    date: '2026-06-13',
    venue: "Levi's Stadium",
    city: 'Santa Clara',
  },
  {
    matchId: 'B3',
    group: 'B',
    matchNumber: 3,
    home: 'Switzerland',
    away: 'Bosnia and Herzegovina',
    date: '2026-06-18',
    venue: 'SoFi Stadium',
    city: 'Inglewood',
  },
  {
    matchId: 'B4',
    group: 'B',
    matchNumber: 4,
    home: 'Canada',
    away: 'Qatar',
    date: '2026-06-18',
    venue: 'BC Place',
    city: 'Vancouver',
  },
  {
    matchId: 'B5',
    group: 'B',
    matchNumber: 5,
    home: 'Switzerland',
    away: 'Canada',
    date: '2026-06-24',
    venue: 'BC Place',
    city: 'Vancouver',
  },
  {
    matchId: 'B6',
    group: 'B',
    matchNumber: 6,
    home: 'Bosnia and Herzegovina',
    away: 'Qatar',
    date: '2026-06-24',
    venue: 'Lumen Field',
    city: 'Seattle',
  },

  // GROUP C - Brazil, Morocco, Haiti, Scotland
  {
    matchId: 'C1',
    group: 'C',
    matchNumber: 1,
    home: 'Brazil',
    away: 'Morocco',
    date: '2026-06-13',
    venue: 'MetLife Stadium',
    city: 'East Rutherford',
  },
  {
    matchId: 'C2',
    group: 'C',
    matchNumber: 2,
    home: 'Haiti',
    away: 'Scotland',
    date: '2026-06-13',
    venue: 'Gillette Stadium',
    city: 'Foxborough',
  },
  {
    matchId: 'C3',
    group: 'C',
    matchNumber: 3,
    home: 'Scotland',
    away: 'Morocco',
    date: '2026-06-19',
    venue: 'Gillette Stadium',
    city: 'Foxborough',
  },
  {
    matchId: 'C4',
    group: 'C',
    matchNumber: 4,
    home: 'Brazil',
    away: 'Haiti',
    date: '2026-06-19',
    venue: 'Lincoln Financial Field',
    city: 'Philadelphia',
  },
  {
    matchId: 'C5',
    group: 'C',
    matchNumber: 5,
    home: 'Scotland',
    away: 'Brazil',
    date: '2026-06-24',
    venue: 'Hard Rock Stadium',
    city: 'Miami Gardens',
  },
  {
    matchId: 'C6',
    group: 'C',
    matchNumber: 6,
    home: 'Morocco',
    away: 'Haiti',
    date: '2026-06-24',
    venue: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
  },

  // GROUP D - United States, Paraguay, Australia, Turkey
  {
    matchId: 'D1',
    group: 'D',
    matchNumber: 1,
    home: 'United States',
    away: 'Paraguay',
    date: '2026-06-12',
    venue: 'SoFi Stadium',
    city: 'Inglewood',
  },
  {
    matchId: 'D2',
    group: 'D',
    matchNumber: 2,
    home: 'Australia',
    away: 'Turkey',
    date: '2026-06-13',
    venue: 'BC Place',
    city: 'Vancouver',
  },
  {
    matchId: 'D3',
    group: 'D',
    matchNumber: 3,
    home: 'United States',
    away: 'Australia',
    date: '2026-06-19',
    venue: 'Lumen Field',
    city: 'Seattle',
  },
  {
    matchId: 'D4',
    group: 'D',
    matchNumber: 4,
    home: 'Turkey',
    away: 'Paraguay',
    date: '2026-06-19',
    venue: "Levi's Stadium",
    city: 'Santa Clara',
  },
  {
    matchId: 'D5',
    group: 'D',
    matchNumber: 5,
    home: 'United States',
    away: 'Turkey',
    date: '2026-06-25',
    venue: 'SoFi Stadium',
    city: 'Inglewood',
  },
  {
    matchId: 'D6',
    group: 'D',
    matchNumber: 6,
    home: 'Paraguay',
    away: 'Australia',
    date: '2026-06-25',
    venue: "Levi's Stadium",
    city: 'Santa Clara',
  },

  // GROUP E - Germany, Curacao, Cote d'Ivoire, Ecuador
  {
    matchId: 'E1',
    group: 'E',
    matchNumber: 1,
    home: 'Germany',
    away: 'Curacao',
    date: '2026-06-14',
    venue: 'NRG Stadium',
    city: 'Houston',
  },
  {
    matchId: 'E2',
    group: 'E',
    matchNumber: 2,
    home: "Cote d'Ivoire",
    away: 'Ecuador',
    date: '2026-06-14',
    venue: 'Lincoln Financial Field',
    city: 'Philadelphia',
  },
  {
    matchId: 'E3',
    group: 'E',
    matchNumber: 3,
    home: 'Germany',
    away: "Cote d'Ivoire",
    date: '2026-06-20',
    venue: 'BMO Field',
    city: 'Toronto',
  },
  {
    matchId: 'E4',
    group: 'E',
    matchNumber: 4,
    home: 'Ecuador',
    away: 'Curacao',
    date: '2026-06-20',
    venue: 'Arrowhead Stadium',
    city: 'Kansas City',
  },
  {
    matchId: 'E5',
    group: 'E',
    matchNumber: 5,
    home: 'Ecuador',
    away: 'Germany',
    date: '2026-06-25',
    venue: 'MetLife Stadium',
    city: 'East Rutherford',
  },
  {
    matchId: 'E6',
    group: 'E',
    matchNumber: 6,
    home: 'Curacao',
    away: "Cote d'Ivoire",
    date: '2026-06-25',
    venue: 'Lincoln Financial Field',
    city: 'Philadelphia',
  },

  // GROUP F - Netherlands, Japan, Sweden, Tunisia
  {
    matchId: 'F1',
    group: 'F',
    matchNumber: 1,
    home: 'Netherlands',
    away: 'Sweden',
    date: '2026-06-14',
    venue: 'NRG Stadium',
    city: 'Houston',
  },
  {
    matchId: 'F2',
    group: 'F',
    matchNumber: 2,
    home: 'Tunisia',
    away: 'Japan',
    date: '2026-06-15',
    venue: 'Estadio Akron',
    city: 'Guadalajara',
  },
  {
    matchId: 'F3',
    group: 'F',
    matchNumber: 3,
    home: 'Japan',
    away: 'Sweden',
    date: '2026-06-21',
    venue: "AT&T Stadium",
    city: 'Arlington',
  },
  {
    matchId: 'F4',
    group: 'F',
    matchNumber: 4,
    home: 'Tunisia',
    away: 'Netherlands',
    date: '2026-06-21',
    venue: 'Arrowhead Stadium',
    city: 'Kansas City',
  },
  {
    matchId: 'F5',
    group: 'F',
    matchNumber: 5,
    home: 'Japan',
    away: 'Netherlands',
    date: '2026-06-26',
    venue: 'NRG Stadium',
    city: 'Houston',
  },
  {
    matchId: 'F6',
    group: 'F',
    matchNumber: 6,
    home: 'Sweden',
    away: 'Tunisia',
    date: '2026-06-26',
    venue: 'Arrowhead Stadium',
    city: 'Kansas City',
  },

  // GROUP G - Belgium, Egypt, Iran, New Zealand
  {
    matchId: 'G1',
    group: 'G',
    matchNumber: 1,
    home: 'Belgium',
    away: 'Egypt',
    date: '2026-06-15',
    venue: 'Lumen Field',
    city: 'Seattle',
  },
  {
    matchId: 'G2',
    group: 'G',
    matchNumber: 2,
    home: 'Iran',
    away: 'New Zealand',
    date: '2026-06-15',
    venue: 'SoFi Stadium',
    city: 'Inglewood',
  },
  {
    matchId: 'G3',
    group: 'G',
    matchNumber: 3,
    home: 'Belgium',
    away: 'Iran',
    date: '2026-06-21',
    venue: 'Gillette Stadium',
    city: 'Foxborough',
  },
  {
    matchId: 'G4',
    group: 'G',
    matchNumber: 4,
    home: 'New Zealand',
    away: 'Egypt',
    date: '2026-06-21',
    venue: 'MetLife Stadium',
    city: 'East Rutherford',
  },
  {
    matchId: 'G5',
    group: 'G',
    matchNumber: 5,
    home: 'Belgium',
    away: 'New Zealand',
    date: '2026-06-26',
    venue: 'Lumen Field',
    city: 'Seattle',
  },
  {
    matchId: 'G6',
    group: 'G',
    matchNumber: 6,
    home: 'Egypt',
    away: 'Iran',
    date: '2026-06-26',
    venue: "Levi's Stadium",
    city: 'Santa Clara',
  },

  // GROUP H - Spain, Cabo Verde, Saudi Arabia, Uruguay
  {
    matchId: 'H1',
    group: 'H',
    matchNumber: 1,
    home: 'Spain',
    away: 'Cabo Verde',
    date: '2026-06-15',
    venue: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
  },
  {
    matchId: 'H2',
    group: 'H',
    matchNumber: 2,
    home: 'Saudi Arabia',
    away: 'Uruguay',
    date: '2026-06-15',
    venue: 'Hard Rock Stadium',
    city: 'Miami Gardens',
  },
  {
    matchId: 'H3',
    group: 'H',
    matchNumber: 3,
    home: 'Spain',
    away: 'Saudi Arabia',
    date: '2026-06-21',
    venue: "AT&T Stadium",
    city: 'Arlington',
  },
  {
    matchId: 'H4',
    group: 'H',
    matchNumber: 4,
    home: 'Uruguay',
    away: 'Cabo Verde',
    date: '2026-06-21',
    venue: 'Hard Rock Stadium',
    city: 'Miami Gardens',
  },
  {
    matchId: 'H5',
    group: 'H',
    matchNumber: 5,
    home: 'Spain',
    away: 'Uruguay',
    date: '2026-06-26',
    venue: "AT&T Stadium",
    city: 'Arlington',
  },
  {
    matchId: 'H6',
    group: 'H',
    matchNumber: 6,
    home: 'Cabo Verde',
    away: 'Saudi Arabia',
    date: '2026-06-26',
    venue: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
  },

  // GROUP I - France, Senegal, Norway, Iraq
  {
    matchId: 'I1',
    group: 'I',
    matchNumber: 1,
    home: 'France',
    away: 'Senegal',
    date: '2026-06-16',
    venue: 'MetLife Stadium',
    city: 'East Rutherford',
  },
  {
    matchId: 'I2',
    group: 'I',
    matchNumber: 2,
    home: 'Iraq',
    away: 'Norway',
    date: '2026-06-16',
    venue: 'Gillette Stadium',
    city: 'Foxborough',
  },
  {
    matchId: 'I3',
    group: 'I',
    matchNumber: 3,
    home: 'France',
    away: 'Iraq',
    date: '2026-06-22',
    venue: 'Lincoln Financial Field',
    city: 'Philadelphia',
  },
  {
    matchId: 'I4',
    group: 'I',
    matchNumber: 4,
    home: 'Norway',
    away: 'Senegal',
    date: '2026-06-22',
    venue: 'MetLife Stadium',
    city: 'East Rutherford',
  },
  {
    matchId: 'I5',
    group: 'I',
    matchNumber: 5,
    home: 'France',
    away: 'Norway',
    date: '2026-06-26',
    venue: "AT&T Stadium",
    city: 'Arlington',
  },
  {
    matchId: 'I6',
    group: 'I',
    matchNumber: 6,
    home: 'Senegal',
    away: 'Iraq',
    date: '2026-06-26',
    venue: 'Lincoln Financial Field',
    city: 'Philadelphia',
  },

  // GROUP J - Argentina, Algeria, Austria, Jordan
  {
    matchId: 'J1',
    group: 'J',
    matchNumber: 1,
    home: 'Argentina',
    away: 'Algeria',
    date: '2026-06-16',
    venue: 'Arrowhead Stadium',
    city: 'Kansas City',
  },
  {
    matchId: 'J2',
    group: 'J',
    matchNumber: 2,
    home: 'Austria',
    away: 'Jordan',
    date: '2026-06-17',
    venue: "Levi's Stadium",
    city: 'Santa Clara',
  },
  {
    matchId: 'J3',
    group: 'J',
    matchNumber: 3,
    home: 'Argentina',
    away: 'Austria',
    date: '2026-06-22',
    venue: "AT&T Stadium",
    city: 'Arlington',
  },
  {
    matchId: 'J4',
    group: 'J',
    matchNumber: 4,
    home: 'Jordan',
    away: 'Algeria',
    date: '2026-06-22',
    venue: 'Arrowhead Stadium',
    city: 'Kansas City',
  },
  {
    matchId: 'J5',
    group: 'J',
    matchNumber: 5,
    home: 'Algeria',
    away: 'Austria',
    date: '2026-06-27',
    venue: 'Arrowhead Stadium',
    city: 'Kansas City',
  },
  {
    matchId: 'J6',
    group: 'J',
    matchNumber: 6,
    home: 'Jordan',
    away: 'Argentina',
    date: '2026-06-27',
    venue: "AT&T Stadium",
    city: 'Arlington',
  },

  // GROUP K - Portugal, DR Congo, Uzbekistan, Colombia
  {
    matchId: 'K1',
    group: 'K',
    matchNumber: 1,
    home: 'Portugal',
    away: 'DR Congo',
    date: '2026-06-17',
    venue: 'NRG Stadium',
    city: 'Houston',
  },
  {
    matchId: 'K2',
    group: 'K',
    matchNumber: 2,
    home: 'Uzbekistan',
    away: 'Colombia',
    date: '2026-06-17',
    venue: 'Estadio Azteca',
    city: 'Mexico City',
  },
  {
    matchId: 'K3',
    group: 'K',
    matchNumber: 3,
    home: 'Portugal',
    away: 'Uzbekistan',
    date: '2026-06-23',
    venue: 'NRG Stadium',
    city: 'Houston',
  },
  {
    matchId: 'K4',
    group: 'K',
    matchNumber: 4,
    home: 'Colombia',
    away: 'DR Congo',
    date: '2026-06-23',
    venue: 'Estadio Akron',
    city: 'Guadalajara',
  },
  {
    matchId: 'K5',
    group: 'K',
    matchNumber: 5,
    home: 'Colombia',
    away: 'Portugal',
    date: '2026-06-27',
    venue: 'Hard Rock Stadium',
    city: 'Miami Gardens',
  },
  {
    matchId: 'K6',
    group: 'K',
    matchNumber: 6,
    home: 'DR Congo',
    away: 'Uzbekistan',
    date: '2026-06-27',
    venue: 'Mercedes-Benz Stadium',
    city: 'Atlanta',
  },

  // GROUP L - England, Croatia, Ghana, Panama
  {
    matchId: 'L1',
    group: 'L',
    matchNumber: 1,
    home: 'England',
    away: 'Croatia',
    date: '2026-06-17',
    venue: "AT&T Stadium",
    city: 'Arlington',
  },
  {
    matchId: 'L2',
    group: 'L',
    matchNumber: 2,
    home: 'Ghana',
    away: 'Panama',
    date: '2026-06-17',
    venue: 'BMO Field',
    city: 'Toronto',
  },
  {
    matchId: 'L3',
    group: 'L',
    matchNumber: 3,
    home: 'England',
    away: 'Ghana',
    date: '2026-06-23',
    venue: 'Gillette Stadium',
    city: 'Foxborough',
  },
  {
    matchId: 'L4',
    group: 'L',
    matchNumber: 4,
    home: 'Panama',
    away: 'Croatia',
    date: '2026-06-23',
    venue: 'BMO Field',
    city: 'Toronto',
  },
  {
    matchId: 'L5',
    group: 'L',
    matchNumber: 5,
    home: 'Panama',
    away: 'England',
    date: '2026-06-27',
    venue: 'MetLife Stadium',
    city: 'East Rutherford',
  },
  {
    matchId: 'L6',
    group: 'L',
    matchNumber: 6,
    home: 'Croatia',
    away: 'Ghana',
    date: '2026-06-27',
    venue: 'Lincoln Financial Field',
    city: 'Philadelphia',
  },
];

// Get all teams across all groups
export const ALL_TEAMS: string[] = GROUPS.flatMap((g) => g.teams).sort();

// Get matches for a specific group
export function getGroupMatches(groupId: string): GroupMatch[] {
  return GROUP_MATCHES.filter((m) => m.group === groupId);
}

// Get match by ID
export function getMatch(matchId: string): GroupMatch | undefined {
  return GROUP_MATCHES.find((m) => m.matchId === matchId);
}

// Check if a match is locked (started - within 1 hour of match date)
export function isMatchLocked(match: GroupMatch): boolean {
  const matchDate = new Date(match.date + 'T00:00:00');
  const now = new Date();
  // Lock when the match date has arrived
  return now >= matchDate;
}

// Knockout bracket rounds
export const BRACKET_ROUNDS = [
  { id: 'R32', name: 'Round of 32', slots: 32, points: 2 },
  { id: 'R16', name: 'Round of 16', slots: 16, points: 3 },
  { id: 'QF', name: 'Quarter-Finals', slots: 8, points: 5 },
  { id: 'SF', name: 'Semi-Finals', slots: 4, points: 8 },
  { id: 'Final', name: 'Final', slots: 2, points: 13 },
];

export const SCORING = {
  groupCorrect: 3,
  groupRank1: 4,
  groupRank2: 3,
  groupRank3: 2,
  groupRank4: 1,
  r32: 2,
  r16: 3,
  qf: 5,
  sf: 8,
  final: 13,
  champion: 20,
};

// Flag emoji map for all 48 teams
export const TEAM_FLAGS: Record<string, string> = {
  'Mexico': '🇲🇽',
  'South Africa': '🇿🇦',
  'South Korea': '🇰🇷',
  'Czechia': '🇨🇿',
  'Canada': '🇨🇦',
  'Switzerland': '🇨🇭',
  'Qatar': '🇶🇦',
  'Bosnia and Herzegovina': '🇧🇦',
  'Brazil': '🇧🇷',
  'Morocco': '🇲🇦',
  'Haiti': '🇭🇹',
  'Scotland': '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'United States': '🇺🇸',
  'Paraguay': '🇵🇾',
  'Australia': '🇦🇺',
  'Turkey': '🇹🇷',
  'Germany': '🇩🇪',
  'Curacao': '🇨🇼',
  "Cote d'Ivoire": '🇨🇮',
  'Ecuador': '🇪🇨',
  'Netherlands': '🇳🇱',
  'Japan': '🇯🇵',
  'Sweden': '🇸🇪',
  'Tunisia': '🇹🇳',
  'Belgium': '🇧🇪',
  'Egypt': '🇪🇬',
  'Iran': '🇮🇷',
  'New Zealand': '🇳🇿',
  'Spain': '🇪🇸',
  'Cabo Verde': '🇨🇻',
  'Saudi Arabia': '🇸🇦',
  'Uruguay': '🇺🇾',
  'France': '🇫🇷',
  'Senegal': '🇸🇳',
  'Norway': '🇳🇴',
  'Iraq': '🇮🇶',
  'Argentina': '🇦🇷',
  'Algeria': '🇩🇿',
  'Austria': '🇦🇹',
  'Jordan': '🇯🇴',
  'Portugal': '🇵🇹',
  'DR Congo': '🇨🇩',
  'Uzbekistan': '🇺🇿',
  'Colombia': '🇨🇴',
  'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
  'Croatia': '🇭🇷',
  'Ghana': '🇬🇭',
  'Panama': '🇵🇦',
};

// Bracket slot definitions
// Left half: R32 slots 0-7 → R16 slots 0-3 → QF slots 0-1 → SF slot 0 → Final
// Right half: R32 slots 8-15 → R16 slots 4-7 → QF slots 2-3 → SF slot 1 → Final
export const BRACKET_SLOTS: { round: string; slot: number; label: string }[] = [
  // R32 - left half (slots 0-7)
  { round: 'R32', slot: 0, label: '1A vs 2B' },
  { round: 'R32', slot: 1, label: '1C vs 2D' },
  { round: 'R32', slot: 2, label: '1E vs 2F' },
  { round: 'R32', slot: 3, label: '1G vs 2H' },
  { round: 'R32', slot: 4, label: '1I vs 2J' },
  { round: 'R32', slot: 5, label: '1K vs 2L' },
  { round: 'R32', slot: 6, label: '3rd Best (1)' },
  { round: 'R32', slot: 7, label: '3rd Best (2)' },
  // R32 - right half (slots 8-15)
  { round: 'R32', slot: 8,  label: '2A vs 1B' },
  { round: 'R32', slot: 9,  label: '2C vs 1D' },
  { round: 'R32', slot: 10, label: '2E vs 1F' },
  { round: 'R32', slot: 11, label: '2G vs 1H' },
  { round: 'R32', slot: 12, label: '2I vs 1J' },
  { round: 'R32', slot: 13, label: '2K vs 1L' },
  { round: 'R32', slot: 14, label: '3rd Best (3)' },
  { round: 'R32', slot: 15, label: '3rd Best (4)' },
  // R16 - left half (slots 0-3)
  { round: 'R16', slot: 0, label: 'R16 Match 1' },
  { round: 'R16', slot: 1, label: 'R16 Match 2' },
  { round: 'R16', slot: 2, label: 'R16 Match 3' },
  { round: 'R16', slot: 3, label: 'R16 Match 4' },
  // R16 - right half (slots 4-7)
  { round: 'R16', slot: 4, label: 'R16 Match 5' },
  { round: 'R16', slot: 5, label: 'R16 Match 6' },
  { round: 'R16', slot: 6, label: 'R16 Match 7' },
  { round: 'R16', slot: 7, label: 'R16 Match 8' },
  // QF - left half (slots 0-1)
  { round: 'QF', slot: 0, label: 'QF Match 1' },
  { round: 'QF', slot: 1, label: 'QF Match 2' },
  // QF - right half (slots 2-3)
  { round: 'QF', slot: 2, label: 'QF Match 3' },
  { round: 'QF', slot: 3, label: 'QF Match 4' },
  // SF
  { round: 'SF', slot: 0, label: 'Semi-Final 1' },
  { round: 'SF', slot: 1, label: 'Semi-Final 2' },
  // Final
  { round: 'Final', slot: 0, label: 'World Cup Final' },
];

// Given a round and slot that won, compute the parent round and slot
export function getParentSlot(round: string, slot: number): { round: string; slot: number } | null {
  switch (round) {
    case 'R32':
      if (slot < 8) return { round: 'R16', slot: Math.floor(slot / 2) };
      return { round: 'R16', slot: 4 + Math.floor((slot - 8) / 2) };
    case 'R16':
      if (slot < 4) return { round: 'QF', slot: Math.floor(slot / 2) };
      return { round: 'QF', slot: 2 + Math.floor((slot - 4) / 2) };
    case 'QF':
      if (slot < 2) return { round: 'SF', slot: 0 };
      return { round: 'SF', slot: 1 };
    case 'SF':
      return { round: 'Final', slot: 0 };
    default:
      return null;
  }
}

// Given a parent slot, find which two child slots feed into it
export function getChildSlots(round: string, slot: number): { round: string; slots: number[] } | null {
  switch (round) {
    case 'R16':
      if (slot < 4) return { round: 'R32', slots: [slot * 2, slot * 2 + 1] };
      return { round: 'R32', slots: [8 + (slot - 4) * 2, 8 + (slot - 4) * 2 + 1] };
    case 'QF':
      if (slot < 2) return { round: 'R16', slots: [slot * 2, slot * 2 + 1] };
      return { round: 'R16', slots: [4 + (slot - 2) * 2, 4 + (slot - 2) * 2 + 1] };
    case 'SF':
      if (slot === 0) return { round: 'QF', slots: [0, 1] };
      return { round: 'QF', slots: [2, 3] };
    case 'Final':
      return { round: 'SF', slots: [0, 1] };
    default:
      return null;
  }
}

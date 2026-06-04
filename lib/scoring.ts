import { SCORING } from './worldcup-data';

export interface GroupPickResult {
  matchId: string;
  pick: string;
  actual: string | null;
  points: number;
  correct: boolean;
}

export interface BracketPickResult {
  round: string;
  slot: number;
  team: string;
  actualTeam: string | null;
  points: number;
  correct: boolean;
}

export interface ChampionPickResult {
  team: string;
  actualChampion: string | null;
  points: number;
  correct: boolean;
}

// Calculate points for a single group pick
export function calculateGroupPickPoints(
  pick: string,
  actualResult: string | null
): number {
  if (!actualResult) return 0;
  return pick === actualResult ? SCORING.groupCorrect : 0;
}

// Calculate points for a bracket pick
export function calculateBracketPickPoints(
  round: string,
  pickedTeam: string,
  actualTeam: string | null
): number {
  if (!actualTeam) return 0;
  if (pickedTeam !== actualTeam) return 0;

  switch (round) {
    case 'R32':
      return SCORING.r32;
    case 'R16':
      return SCORING.r16;
    case 'QF':
      return SCORING.qf;
    case 'SF':
      return SCORING.sf;
    case 'Final':
      return SCORING.final;
    default:
      return 0;
  }
}

// Calculate points for champion pick
export function calculateChampionPickPoints(
  pickedTeam: string,
  actualChampion: string | null
): number {
  if (!actualChampion) return 0;
  return pickedTeam === actualChampion ? SCORING.champion : 0;
}

// Calculate total score for a user
export function calculateTotalScore(params: {
  groupPicks: Array<{ matchId: string; pick: string }>;
  bracketPicks: Array<{ round: string; slot: number; team: string }>;
  championPick: { team: string } | null;
  matchResults: Map<string, { result: string | null }>;
  bracketResults: Map<string, { round: string; slot: number; team: string }>;
  champion: string | null;
}): number {
  let total = 0;

  // Group picks
  for (const gp of params.groupPicks) {
    const result = params.matchResults.get(gp.matchId);
    total += calculateGroupPickPoints(gp.pick, result?.result ?? null);
  }

  // Bracket picks
  for (const bp of params.bracketPicks) {
    const key = `${bp.round}-${bp.slot}`;
    const result = params.bracketResults.get(key);
    total += calculateBracketPickPoints(bp.round, bp.team, result?.team ?? null);
  }

  // Champion pick
  if (params.championPick) {
    total += calculateChampionPickPoints(params.championPick.team, params.champion);
  }

  return total;
}

export const ROUND_POINTS: Record<string, number> = {
  R32: SCORING.r32,
  R16: SCORING.r16,
  QF: SCORING.qf,
  SF: SCORING.sf,
  Final: SCORING.final,
};

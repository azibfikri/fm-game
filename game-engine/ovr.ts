import { Player, PlayerAttributes, Position, PositionCategory } from './types';

export type AttributeWeights = Partial<Record<keyof PlayerAttributes, number>>;

export const POSITION_WEIGHTS: Record<Position, AttributeWeights> = {
  GK: {
    gk: 0.7,
    physical: 0.12,
    defending: 0.1,
    passing: 0.08,
  },
  CB: {
    defending: 0.4,
    physical: 0.3,
    pace: 0.15,
    passing: 0.1,
    dribbling: 0.05,
  },
  LB: {
    pace: 0.25,
    defending: 0.25,
    passing: 0.2,
    physical: 0.15,
    dribbling: 0.15,
  },
  RB: {
    pace: 0.25,
    defending: 0.25,
    passing: 0.2,
    physical: 0.15,
    dribbling: 0.15,
  },
  CDM: {
    defending: 0.35,
    physical: 0.25,
    passing: 0.2,
    dribbling: 0.1,
    pace: 0.1,
  },
  CM: {
    passing: 0.3,
    dribbling: 0.25,
    defending: 0.15,
    physical: 0.15,
    pace: 0.1,
    shooting: 0.05,
  },
  CAM: {
    passing: 0.3,
    dribbling: 0.3,
    shooting: 0.2,
    pace: 0.15,
    physical: 0.05,
  },
  LM: {
    pace: 0.3,
    dribbling: 0.25,
    passing: 0.2,
    shooting: 0.15,
    physical: 0.1,
  },
  RM: {
    pace: 0.3,
    dribbling: 0.25,
    passing: 0.2,
    shooting: 0.15,
    physical: 0.1,
  },
  LW: {
    pace: 0.35,
    dribbling: 0.3,
    shooting: 0.2,
    passing: 0.1,
    physical: 0.05,
  },
  RW: {
    pace: 0.35,
    dribbling: 0.3,
    shooting: 0.2,
    passing: 0.1,
    physical: 0.05,
  },
  ST: {
    shooting: 0.4,
    pace: 0.2,
    physical: 0.15,
    dribbling: 0.15,
    passing: 0.1,
  },
};

/**
 * Clamp a stat between min and max (default 1 to 99)
 */
export function clampStat(value: number, min = 1, max = 99): number {
  if (Number.isNaN(value) || value === null || value === undefined) return min;
  return Math.min(Math.max(Math.round(value), min), max);
}

/**
 * Calculates position-weighted Overall Rating (OVR) from 1 to 99
 */
export function calculateOVR(attributes: PlayerAttributes, position: Position): number {
  const weights = POSITION_WEIGHTS[position];
  if (!weights) {
    // Fallback: simple average if unrecognized position
    const all = [
      attributes.pace,
      attributes.shooting,
      attributes.passing,
      attributes.dribbling,
      attributes.defending,
      attributes.physical,
    ];
    const avg = all.reduce((a, b) => a + (b || 50), 0) / all.length;
    return clampStat(avg);
  }

  let totalWeight = 0;
  let weightedSum = 0;

  for (const [key, weight] of Object.entries(weights)) {
    const attrKey = key as keyof PlayerAttributes;
    const statVal = clampStat(attributes[attrKey] ?? 1);
    weightedSum += statVal * (weight ?? 0);
    totalWeight += weight ?? 0;
  }

  if (totalWeight === 0) return 50;

  const finalScore = weightedSum / totalWeight;
  return clampStat(finalScore);
}

/**
 * Enriches a player with calculated OVR
 */
export function enrichPlayerWithOVR(player: Player): Player & { ovr: number } {
  const ovr = calculateOVR(
    {
      pace: player.pace,
      shooting: player.shooting,
      passing: player.passing,
      dribbling: player.dribbling,
      defending: player.defending,
      physical: player.physical,
      gk: player.gk,
    },
    player.position
  );
  return {
    ...player,
    ovr,
  };
}

/**
 * Classifies position into category
 */
export function getPositionCategory(position: Position): PositionCategory {
  switch (position) {
    case 'GK':
      return 'GK';
    case 'CB':
    case 'LB':
    case 'RB':
      return 'DEF';
    case 'CDM':
    case 'CM':
    case 'CAM':
    case 'LM':
    case 'RM':
      return 'MID';
    case 'LW':
    case 'RW':
    case 'ST':
      return 'FWD';
    default:
      return 'MID';
  }
}

/**
 * Gets tier for color-coding OVR badge
 */
export function getOvrTier(ovr: number): 'elite' | 'gold' | 'silver' | 'bronze' {
  if (ovr >= 85) return 'elite';
  if (ovr >= 75) return 'gold';
  if (ovr >= 65) return 'silver';
  return 'bronze';
}

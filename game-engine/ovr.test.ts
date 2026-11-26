import { describe, it, expect } from 'vitest';
import {
  calculateOVR,
  enrichPlayerWithOVR,
  clampStat,
  getPositionCategory,
  getOvrTier,
  POSITION_WEIGHTS,
} from './ovr';
import { Player, PlayerAttributes, Position } from './types';

describe('OVR Calculation Engine', () => {
  it('should verify all position weights sum to 1.0', () => {
    const positions = Object.keys(POSITION_WEIGHTS) as Position[];
    for (const pos of positions) {
      const weights = POSITION_WEIGHTS[pos];
      const sum = Object.values(weights).reduce((a, b) => a + (b || 0), 0);
      expect(sum).toBeCloseTo(1.0, 4);
    }
  });

  it('should correctly calculate Goalkeeper (GK) OVR heavily weighting GK stat', () => {
    const gkAttributes: PlayerAttributes = {
      pace: 40,
      shooting: 20,
      passing: 60,
      dribbling: 30,
      defending: 50,
      physical: 75,
      gk: 88,
    };

    // Expected: 88*0.70 (61.6) + 75*0.12 (9.0) + 50*0.10 (5.0) + 60*0.08 (4.8) = 80.4 -> 80
    const ovr = calculateOVR(gkAttributes, 'GK');
    expect(ovr).toBe(80);
  });

  it('should correctly calculate Striker (ST) OVR heavily weighting shooting and pace', () => {
    const strikerAttrs: PlayerAttributes = {
      pace: 88,
      shooting: 92,
      passing: 74,
      dribbling: 84,
      defending: 32,
      physical: 80,
      gk: 15,
    };

    // Expected:
    // shooting: 92 * 0.40 = 36.8
    // pace: 88 * 0.20 = 17.6
    // physical: 80 * 0.15 = 12.0
    // dribbling: 84 * 0.15 = 12.6
    // passing: 74 * 0.10 = 7.4
    // total = 86.4 -> 86
    const ovr = calculateOVR(strikerAttrs, 'ST');
    expect(ovr).toBe(86);
  });

  it('should calculate Central Defender (CB) OVR', () => {
    const cbAttrs: PlayerAttributes = {
      pace: 72,
      shooting: 30,
      passing: 65,
      dribbling: 60,
      defending: 88,
      physical: 85,
      gk: 10,
    };

    // defending: 88 * 0.40 = 35.2
    // physical: 85 * 0.30 = 25.5
    // pace: 72 * 0.15 = 10.8
    // passing: 65 * 0.10 = 6.5
    // dribbling: 60 * 0.05 = 3.0
    // total = 81.0 -> 81
    const ovr = calculateOVR(cbAttrs, 'CB');
    expect(ovr).toBe(81);
  });

  it('should correctly clamp attributes and results between 1 and 99', () => {
    expect(clampStat(-10)).toBe(1);
    expect(clampStat(150)).toBe(99);
    expect(clampStat(NaN)).toBe(1);

    const overpoweredAttrs: PlayerAttributes = {
      pace: 120,
      shooting: 120,
      passing: 120,
      dribbling: 120,
      defending: 120,
      physical: 120,
      gk: 120,
    };
    expect(calculateOVR(overpoweredAttrs, 'ST')).toBe(99);

    const zeroAttrs: PlayerAttributes = {
      pace: 0,
      shooting: 0,
      passing: 0,
      dribbling: 0,
      defending: 0,
      physical: 0,
      gk: 0,
    };
    expect(calculateOVR(zeroAttrs, 'CM')).toBe(1);
  });

  it('should enrich player object with calculated OVR', () => {
    const rawPlayer: Player = {
      id: 'p1',
      name: 'Marcus Vance',
      age: 24,
      nationality: 'England',
      position: 'CAM',
      clubId: 'c1',
      potential: 89,
      value: 35000000,
      wage: 65000,
      pace: 82,
      shooting: 78,
      passing: 86,
      dribbling: 85,
      defending: 45,
      physical: 68,
      gk: 12,
    };

    const enriched = enrichPlayerWithOVR(rawPlayer);
    expect(enriched.ovr).toBeDefined();
    expect(enriched.ovr).toBeGreaterThan(75);
    expect(enriched.ovr).toBeLessThan(90);
  });

  it('should categorize positions correctly', () => {
    expect(getPositionCategory('GK')).toBe('GK');
    expect(getPositionCategory('CB')).toBe('DEF');
    expect(getPositionCategory('LB')).toBe('DEF');
    expect(getPositionCategory('RB')).toBe('DEF');
    expect(getPositionCategory('CDM')).toBe('MID');
    expect(getPositionCategory('CM')).toBe('MID');
    expect(getPositionCategory('CAM')).toBe('MID');
    expect(getPositionCategory('LW')).toBe('FWD');
    expect(getPositionCategory('ST')).toBe('FWD');
  });

  it('should return appropriate OVR tiers for visual styling', () => {
    expect(getOvrTier(90)).toBe('elite');
    expect(getOvrTier(85)).toBe('elite');
    expect(getOvrTier(80)).toBe('gold');
    expect(getOvrTier(75)).toBe('gold');
    expect(getOvrTier(70)).toBe('silver');
    expect(getOvrTier(60)).toBe('bronze');
  });
});

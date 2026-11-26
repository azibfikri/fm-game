import { describe, it, expect } from 'vitest';
import { SQUAD_PRESETS } from './App';
import { calculateOVR, getOvrTier, getPositionCategory } from '@/game-engine';

describe('Dugout Squad & Navigation UX Specs', () => {
  it('has an honest demo squad count of exactly 8 players across all categories', () => {
    expect(SQUAD_PRESETS.length).toBe(8);

    const categories = SQUAD_PRESETS.map((p) => p.category);
    expect(categories).toContain('GK');
    expect(categories).toContain('DEF');
    expect(categories).toContain('MID');
    expect(categories).toContain('FWD');
  });

  it('correctly maps each player to their valid tactical category', () => {
    for (const player of SQUAD_PRESETS) {
      expect(getPositionCategory(player.position)).toBe(player.category);
    }
  });

  it('calculates realistic OVR and valid tier for every squad preset', () => {
    for (const player of SQUAD_PRESETS) {
      const ovr = calculateOVR(player.attributes, player.position);
      expect(ovr).toBeGreaterThanOrEqual(75);
      expect(ovr).toBeLessThanOrEqual(95);

      const tier = getOvrTier(ovr);
      expect(['elite', 'gold', 'silver', 'bronze']).toContain(tier);
    }
  });

  it('verifies goalkeeper Becker has high GK rating and outfielders have valid outfield stats', () => {
    const becker = SQUAD_PRESETS.find((p) => p.position === 'GK');
    expect(becker).toBeDefined();
    expect(becker?.attributes.gk).toBeGreaterThanOrEqual(80);

    const outfielders = SQUAD_PRESETS.filter((p) => p.position !== 'GK');
    for (const p of outfielders) {
      expect(p.attributes.gk).toBeLessThan(20);
      expect(p.attributes.pace).toBeGreaterThan(60);
    }
  });

  it('verifies Vance and Sterling star player benchmarks', () => {
    const vance = SQUAD_PRESETS.find((p) => p.id === 'vance-9');
    expect(vance).toBeDefined();
    expect(calculateOVR(vance!.attributes, vance!.position)).toBe(86);

    const sterling = SQUAD_PRESETS.find((p) => p.id === 'sterling-10');
    expect(sterling).toBeDefined();
    expect(calculateOVR(sterling!.attributes, sterling!.position)).toBe(85);
  });
});

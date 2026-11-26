import React, { useState, useEffect, useId, useMemo } from 'react';
import {
  calculateOVR,
  getOvrTier,
  POSITION_WEIGHTS,
  clampStat,
  Position,
  PlayerAttributes,
} from '@/game-engine';

export type AppView = 'club-confirm' | 'portal' | 'squad' | 'profile';

export interface SquadPlayerPreset {
  id: string;
  name: string;
  number: number;
  age: number;
  nationality: string;
  foot: 'Right' | 'Left' | 'Both';
  value: string;
  wage: string;
  position: Position;
  category: 'GK' | 'DEF' | 'MID' | 'FWD';
  role: string;
  attributes: PlayerAttributes;
}

export const SQUAD_PRESETS: SquadPlayerPreset[] = [
  {
    id: 'vance-9',
    name: 'Marcus Vance',
    number: 9,
    age: 24,
    nationality: 'England',
    foot: 'Right',
    value: '£48.5M',
    wage: '£95k/w',
    position: 'ST',
    category: 'FWD',
    role: 'Advanced Forward',
    attributes: {
      pace: 88,
      shooting: 92,
      passing: 74,
      dribbling: 84,
      defending: 32,
      physical: 80,
      gk: 15,
    },
  },
  {
    id: 'sterling-10',
    name: 'Julian Sterling',
    number: 10,
    age: 27,
    nationality: 'Germany',
    foot: 'Both',
    value: '£55.0M',
    wage: '£120k/w',
    position: 'CAM',
    category: 'MID',
    role: 'Shadow Striker / 10',
    attributes: {
      pace: 78,
      shooting: 82,
      passing: 91,
      dribbling: 89,
      defending: 42,
      physical: 66,
      gk: 12,
    },
  },
  {
    id: 'bennett-7',
    name: 'Cole Bennett',
    number: 7,
    age: 22,
    nationality: 'England',
    foot: 'Left',
    value: '£29.0M',
    wage: '£60k/w',
    position: 'RW',
    category: 'FWD',
    role: 'Inverted Winger',
    attributes: {
      pace: 89,
      shooting: 78,
      passing: 76,
      dribbling: 84,
      defending: 36,
      physical: 70,
      gk: 10,
    },
  },
  {
    id: 'kovac-8',
    name: 'Mateo Kovac',
    number: 8,
    age: 28,
    nationality: 'Croatia',
    foot: 'Right',
    value: '£31.0M',
    wage: '£70k/w',
    position: 'CM',
    category: 'MID',
    role: 'Box-to-Box Midfielder',
    attributes: {
      pace: 74,
      shooting: 72,
      passing: 85,
      dribbling: 81,
      defending: 74,
      physical: 78,
      gk: 10,
    },
  },
  {
    id: 'silva-6',
    name: 'Lucas Silva',
    number: 6,
    age: 25,
    nationality: 'Portugal',
    foot: 'Right',
    value: '£36.0M',
    wage: '£85k/w',
    position: 'CDM',
    category: 'MID',
    role: 'Deep Lying Anchor',
    attributes: {
      pace: 70,
      shooting: 58,
      passing: 82,
      dribbling: 76,
      defending: 84,
      physical: 82,
      gk: 11,
    },
  },
  {
    id: 'ramos-4',
    name: 'David Ramos',
    number: 4,
    age: 29,
    nationality: 'Spain',
    foot: 'Right',
    value: '£34.0M',
    wage: '£75k/w',
    position: 'CB',
    category: 'DEF',
    role: 'Ball-Playing Defender',
    attributes: {
      pace: 72,
      shooting: 30,
      passing: 65,
      dribbling: 60,
      defending: 88,
      physical: 85,
      gk: 10,
    },
  },
  {
    id: 'abbas-3',
    name: 'Tariq Abbas',
    number: 3,
    age: 23,
    nationality: 'France',
    foot: 'Left',
    value: '£26.5M',
    wage: '£55k/w',
    position: 'LB',
    category: 'DEF',
    role: 'Attacking Wing-Back',
    attributes: {
      pace: 86,
      shooting: 52,
      passing: 75,
      dribbling: 78,
      defending: 79,
      physical: 78,
      gk: 12,
    },
  },
  {
    id: 'becker-1',
    name: 'Alen Becker',
    number: 1,
    age: 26,
    nationality: 'Brazil',
    foot: 'Right',
    value: '£38.0M',
    wage: '£80k/w',
    position: 'GK',
    category: 'GK',
    role: 'Sweeper Keeper',
    attributes: {
      pace: 40,
      shooting: 20,
      passing: 60,
      dribbling: 30,
      defending: 50,
      physical: 75,
      gk: 88,
    },
  },
];

const ALL_POSITIONS: Position[] = [
  'GK',
  'CB',
  'LB',
  'RB',
  'CDM',
  'CM',
  'CAM',
  'LM',
  'RM',
  'LW',
  'RW',
  'ST',
];

interface AttributeConfig {
  key: keyof PlayerAttributes;
  code: string;
  name: string;
}

const ATTRIBUTE_CONFIGS: AttributeConfig[] = [
  { key: 'pace', code: 'PAC', name: 'Pace' },
  { key: 'shooting', code: 'SHO', name: 'Shooting' },
  { key: 'passing', code: 'PAS', name: 'Passing' },
  { key: 'dribbling', code: 'DRI', name: 'Dribbling' },
  { key: 'defending', code: 'DEF', name: 'Defending' },
  { key: 'physical', code: 'PHY', name: 'Physical' },
  { key: 'gk', code: 'GK', name: 'Goalkeeping' },
];

const PITCH_COORDINATES: Record<Position, { x: number; y: number }> = {
  GK: { x: 70, y: 165 },
  CB: { x: 70, y: 135 },
  LB: { x: 28, y: 132 },
  RB: { x: 112, y: 132 },
  CDM: { x: 70, y: 112 },
  CM: { x: 70, y: 92 },
  CAM: { x: 70, y: 68 },
  LM: { x: 28, y: 90 },
  RM: { x: 112, y: 90 },
  LW: { x: 30, y: 48 },
  RW: { x: 110, y: 48 },
  ST: { x: 70, y: 35 },
};

export const App: React.FC = () => {
  // Navigation & Spine State
  const [hasConfirmedClub, setHasConfirmedClub] = useState<boolean>(() => {
    try {
      return localStorage.getItem('fm_club_confirmed') === 'true';
    } catch {
      return false;
    }
  });

  const [currentView, setCurrentView] = useState<AppView>(() => {
    try {
      return localStorage.getItem('fm_club_confirmed') === 'true' ? 'portal' : 'club-confirm';
    } catch {
      return 'club-confirm';
    }
  });

  const handleConfirmClub = (nextView: AppView) => {
    setHasConfirmedClub(true);
    try {
      localStorage.setItem('fm_club_confirmed', 'true');
    } catch {
      // Ignore storage errors in restricted contexts
    }
    setCurrentView(nextView);
  };

  // Selected player & tactical tweak state
  const [selectedPlayerId, setSelectedPlayerId] = useState<string>('vance-9');
  const [activePlayer, setActivePlayer] = useState<SquadPlayerPreset>(SQUAD_PRESETS[0]);
  const [attributes, setAttributes] = useState<PlayerAttributes>(SQUAD_PRESETS[0].attributes);
  const [position, setPosition] = useState<Position>(SQUAD_PRESETS[0].position);
  const [coachTweakActive, setCoachTweakActive] = useState<boolean>(false);
  const [squadFilter, setSquadFilter] = useState<'ALL' | 'GK' | 'DEF' | 'MID' | 'FWD'>('ALL');
  const [ovrPulse, setOvrPulse] = useState<boolean>(false);

  const positionSelectId = useId();

  const ovr = calculateOVR(attributes, position);
  const tier = getOvrTier(ovr);

  useEffect(() => {
    setOvrPulse(true);
    const timer = setTimeout(() => setOvrPulse(false), 360);
    return () => clearTimeout(timer);
  }, [ovr]);

  const selectPlayer = (player: SquadPlayerPreset, targetView?: AppView) => {
    setSelectedPlayerId(player.id);
    setActivePlayer(player);
    setPosition(player.position);
    setAttributes(player.attributes);
    if (targetView) {
      setCurrentView(targetView);
    }
  };

  const handleAttrChange = (key: keyof PlayerAttributes, val: number) => {
    if (!coachTweakActive) return;
    const clamped = clampStat(val);
    setAttributes((prev) => ({
      ...prev,
      [key]: clamped,
    }));
  };

  const handleStepAttr = (key: keyof PlayerAttributes, delta: number) => {
    if (!coachTweakActive) return;
    handleAttrChange(key, (attributes[key] ?? 50) + delta);
  };

  const resetPlayerToPreset = () => {
    setAttributes(activePlayer.attributes);
    setPosition(activePlayer.position);
  };

  const getStatStyleClass = (val: number): { text: string; fill: string } => {
    if (val >= 80) return { text: 'stat-elite', fill: 'fill-elite' };
    if (val >= 70) return { text: 'stat-gold', fill: 'fill-gold' };
    if (val >= 55) return { text: 'stat-amber', fill: 'fill-amber' };
    return { text: 'stat-dim', fill: 'fill-dim' };
  };

  const getTierDisplay = (t: string) => {
    switch (t) {
      case 'elite':
        return { label: 'WORLD CLASS', class: 'tier-elite' };
      case 'gold':
        return { label: 'FIRST TEAM KEY', class: 'tier-gold' };
      case 'silver':
        return { label: 'ROTATION', class: 'tier-silver' };
      default:
        return { label: 'DEVELOPMENT', class: 'tier-bronze' };
    }
  };

  const filteredSquad = useMemo(() => {
    if (squadFilter === 'ALL') return SQUAD_PRESETS;
    return SQUAD_PRESETS.filter((p) => p.category === squadFilter);
  }, [squadFilter]);

  const currentMarker = PITCH_COORDINATES[position] || { x: 70, y: 95 };
  const tierInfo = getTierDisplay(tier);
  const weights = POSITION_WEIGHTS[position] || {};

  return (
    <div className="dugout-shell">
      {/* 1. TOP STRIP NAV */}
      <header className="dugout-top-nav">
        <div className="top-nav-bar">
          <div className="brand-section">
            <div className="brand-mark">
              <span>DUGOUT</span>
              <div className="accent-dot" />
            </div>
            <div className="brand-divider" />
            <button
              type="button"
              className="club-identity-btn"
              onClick={() => setCurrentView('club-confirm')}
              title="Click to view Club Appointment Details"
            >
              <div className="club-crest">SB</div>
              <div className="club-identity-text">
                <span className="club-name">South Bridge FC</span>
                <span className="club-sub">
                  {hasConfirmedClub ? 'Division 1 · 2nd Place' : 'Pending Confirmation'}
                </span>
              </div>
            </button>
          </div>

          <div className="nav-match-context">
            <span className="match-tag">MATCHWEEK 14</span>
            <span>VS KINGSFORD ATHLETIC (H)</span>
          </div>

          <div className="top-nav-status">
            <div className="status-metric">
              <span className="label">CALENDAR</span>
              <span className="value">SAT 17 OCT</span>
            </div>
            <div className="status-metric">
              <span className="label">MANAGER</span>
              <span className="value">AZIB</span>
            </div>
          </div>
        </div>
        {/* Club colour stripe */}
        <div className="club-colour-stripe" />
      </header>

      {/* 2. DUGOUT WORKSPACE BODY: LEFT RAIL + MAIN STAGE */}
      <div className="dugout-body">
        {/* LEFT RAIL (HONEST NAV) */}
        <aside className="dugout-rail">
          <div className="rail-section">
            <div className="rail-section-label">Club Hub</div>
            <ul className="rail-nav">
              <li>
                <button
                  type="button"
                  className={`rail-item ${currentView === 'portal' ? 'active' : ''}`}
                  onClick={() => setCurrentView('portal')}
                >
                  <span className="rail-icon">⬡</span>
                  <span>Portal</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`rail-item ${currentView === 'squad' ? 'active' : ''}`}
                  onClick={() => setCurrentView('squad')}
                >
                  <span className="rail-icon">▥</span>
                  <span>Squad</span>
                  <span className="rail-pill">{SQUAD_PRESETS.length}</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`rail-item ${currentView === 'profile' ? 'active' : ''}`}
                  onClick={() => setCurrentView('profile')}
                >
                  <span className="rail-icon">◈</span>
                  <span>Player Profile</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`rail-item ${currentView === 'club-confirm' ? 'active' : ''}`}
                  onClick={() => setCurrentView('club-confirm')}
                >
                  <span className="rail-icon">🛡</span>
                  <span>Club Details</span>
                  {!hasConfirmedClub && <span className="rail-pill locked">NEW</span>}
                </button>
              </li>
            </ul>

            <div className="rail-section-label" style={{ marginTop: '0.75rem' }}>
              Operations
            </div>
            <ul className="rail-nav">
              <li>
                <div className="rail-item disabled" title="Tactics board coming soon">
                  <span className="rail-icon">▤</span>
                  <span>Tactics</span>
                  <span className="rail-pill locked">LOCKED</span>
                </div>
              </li>
              <li>
                <div className="rail-item disabled" title="Attribute mini-games arriving in M2">
                  <span className="rail-icon">▲</span>
                  <span>Training</span>
                  <span className="rail-pill roadmap">M2</span>
                </div>
              </li>
              <li>
                <div className="rail-item disabled" title="Season fixtures arriving in M3">
                  <span className="rail-icon">◫</span>
                  <span>Fixtures</span>
                  <span className="rail-pill roadmap">M3</span>
                </div>
              </li>
              <li>
                <div className="rail-item disabled" title="Transfers & budget arriving in M4">
                  <span className="rail-icon">⇌</span>
                  <span>Transfers</span>
                  <span className="rail-pill roadmap">M4</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="rail-footer">
            <div className="rail-status-pill">
              <span className="status-dot" />
              <span>Matchweek 14</span>
            </div>
          </div>
        </aside>

        {/* 3. MAIN STAGE */}
        <main className="dugout-stage">
          {/* VIEW A: CLUB CONFIRM (M1 SPINE STEP 1) */}
          {currentView === 'club-confirm' && (
            <section className="club-confirm-stage">
              <div className="confirm-hero-card">
                <div className="confirm-header">
                  <div className="confirm-crest-wrap">
                    <div className="confirm-crest">SB</div>
                  </div>
                  <div className="confirm-hero-text">
                    <span className="confirm-tag">OFFICIAL APPOINTMENT · DIVISION 1</span>
                    <h1 className="confirm-title">South Bridge Football Club</h1>
                    <p className="confirm-lead">
                      Manager Azib, your contract as First Team Manager is active. Review board objectives and meet the registered squad.
                    </p>
                  </div>
                </div>

                <div className="confirm-specs-grid">
                  <div className="confirm-spec-card">
                    <span className="spec-label">STADIUM</span>
                    <span className="spec-val">South Bridge Road</span>
                    <span className="spec-sub">34,200 Capacity · Natural Grass</span>
                  </div>
                  <div className="confirm-spec-card">
                    <span className="spec-label">LEAGUE STATUS</span>
                    <span className="spec-val">Division 1 (2nd)</span>
                    <span className="spec-sub">28 Pts · Matchweek 14</span>
                  </div>
                  <div className="confirm-spec-card">
                    <span className="spec-label">TRANSFER BUDGET</span>
                    <span className="spec-val">£12,500,000</span>
                    <span className="spec-sub">Wage Kitty: £185k/w</span>
                  </div>
                  <div className="confirm-spec-card">
                    <span className="spec-label">BOARD TARGET</span>
                    <span className="spec-val">Continental Spot</span>
                    <span className="spec-sub">Top 4 League Finish</span>
                  </div>
                </div>

                <div className="confirm-actions-bar">
                  <button
                    type="button"
                    className="dugout-cta-btn primary"
                    onClick={() => handleConfirmClub('squad')}
                  >
                    <span>Meet Registered Squad ({SQUAD_PRESETS.length})</span>
                    <span className="btn-arrow">→</span>
                  </button>

                  <button
                    type="button"
                    className="dugout-cta-btn secondary"
                    onClick={() => handleConfirmClub('portal')}
                  >
                    <span>Enter Matchday Portal</span>
                    <span className="btn-arrow">→</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          {/* VIEW B: PORTAL HUB STUB (MATCHDAY TUNNEL & SQUAD PREVIEW) */}
          {currentView === 'portal' && (
            <section className="portal-stage">
              {/* MATCHDAY TUNNEL CARD */}
              <div className="matchday-tunnel-card">
                <div className="tunnel-ambience-strip">
                  <div className="tunnel-status-indicator">
                    <span className="tunnel-pulse-dot" />
                    <span>MATCHDAY TUNNEL · KICKOFF READY</span>
                  </div>
                  <div className="tunnel-kickoff-meta">SATURDAY 17:30 · FLOODLIT NIGHT FIXTURE</div>
                </div>

                <div className="tunnel-fixture-hero">
                  <div className="fixture-team home">
                    <div className="fixture-crest">SB</div>
                    <div className="fixture-team-meta">
                      <span className="fixture-team-name">South Bridge FC</span>
                      <span className="fixture-pos">2nd · 28 pts (Form: W-W-D-W-W)</span>
                    </div>
                  </div>

                  <div className="fixture-vs-block">
                    <span className="fixture-vs-tag">VS</span>
                    <span className="fixture-venue-text">South Bridge Road</span>
                    <span className="fixture-matchweek-pill">Matchweek 14</span>
                  </div>

                  <div className="fixture-team away">
                    <div className="fixture-team-meta align-right">
                      <span className="fixture-team-name">Kingsford Athletic</span>
                      <span className="fixture-pos">5th · 24 pts (Form: W-L-D-W-L)</span>
                    </div>
                    <div className="fixture-crest away-crest">KA</div>
                  </div>
                </div>

                <div className="tunnel-cta-row">
                  <div className="tunnel-match-note">
                    Opponent plays a compact 4-3-3. Marcus Vance (#9) and Julian Sterling (#10) are in full training condition.
                  </div>
                  <div className="tunnel-actions">
                    <button
                      type="button"
                      className="dugout-cta-btn primary"
                      onClick={() => setCurrentView('squad')}
                    >
                      <span>Go to Squad ({SQUAD_PRESETS.length})</span>
                      <span className="btn-arrow">→</span>
                    </button>
                    <button
                      type="button"
                      className="dugout-cta-btn secondary"
                      onClick={() => selectPlayer(SQUAD_PRESETS[0], 'profile')}
                    >
                      <span>Inspect Marcus Vance (86 OVR)</span>
                      <span className="btn-arrow">→</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* SQUAD TILES GRID */}
              <div className="portal-squad-section">
                <div className="portal-section-header">
                  <div>
                    <h2 className="portal-section-title">First Team Selection Pool</h2>
                    <p className="portal-section-sub">
                      {SQUAD_PRESETS.length} senior players available for selection · Click any player to open profile
                    </p>
                  </div>
                  <button
                    type="button"
                    className="portal-view-all-btn"
                    onClick={() => setCurrentView('squad')}
                  >
                    Open Squad Table →
                  </button>
                </div>

                <div className="portal-squad-grid">
                  {SQUAD_PRESETS.map((p) => {
                    const playerOvr = calculateOVR(p.attributes, p.position);
                    const playerTier = getOvrTier(playerOvr);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        className="portal-player-tile"
                        onClick={() => selectPlayer(p, 'profile')}
                      >
                        <div className="tile-top-line">
                          <span className="tile-pos-badge">{p.position}</span>
                          <span className="tile-squad-no">#{p.number}</span>
                          <span className="tile-fit-pill">100% FIT</span>
                        </div>
                        <div className="tile-player-name">{p.name}</div>
                        <div className="tile-player-role">{p.role}</div>
                        <div className="tile-bottom-line">
                          <span className="tile-meta">
                            {p.age} yrs · {p.nationality}
                          </span>
                          <div className="tile-ovr-box">
                            <span className="tile-ovr-val">{playerOvr}</span>
                            <span className={`tile-tier-dot ${playerTier}`} />
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* VIEW C: FULL SQUAD TABLE (M1 SPINE STEP 2) */}
          {currentView === 'squad' && (
            <section className="squad-view-stage">
              <div className="squad-header-bar">
                <div>
                  <h1 className="squad-view-title">First Team Squad</h1>
                  <p className="squad-view-sub">
                    {SQUAD_PRESETS.length} Senior Players Registered · Click any row to inspect tactical profile
                  </p>
                </div>

                {/* Filter Pills */}
                <div className="squad-filter-tabs">
                  {(['ALL', 'GK', 'DEF', 'MID', 'FWD'] as const).map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`filter-tab ${squadFilter === cat ? 'active' : ''}`}
                      onClick={() => setSquadFilter(cat)}
                    >
                      {cat === 'ALL' ? `All (${SQUAD_PRESETS.length})` : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* TACTICAL SQUAD TABLE */}
              <div className="squad-table-container">
                <table className="squad-table">
                  <thead>
                    <tr>
                      <th style={{ width: '48px' }}>#</th>
                      <th>Player &amp; Role</th>
                      <th>POS</th>
                      <th>Age</th>
                      <th>Nat</th>
                      <th>Foot</th>
                      <th style={{ textAlign: 'center' }}>OVR</th>
                      <th>PAC</th>
                      <th>SHO</th>
                      <th>PAS</th>
                      <th>DRI</th>
                      <th>DEF</th>
                      <th>PHY</th>
                      <th>GK</th>
                      <th>Value</th>
                      <th>Wage</th>
                      <th style={{ textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSquad.map((player) => {
                      const pOvr = calculateOVR(player.attributes, player.position);
                      const isSelected = player.id === selectedPlayerId;
                      return (
                        <tr
                          key={player.id}
                          className={`squad-row ${isSelected ? 'selected' : ''}`}
                          onClick={() => selectPlayer(player, 'profile')}
                        >
                          <td className="col-no">#{player.number}</td>
                          <td className="col-name">
                            <div className="table-player-name">{player.name}</div>
                            <div className="table-player-role">{player.role}</div>
                          </td>
                          <td>
                            <span className="pos-tag-sm">{player.position}</span>
                          </td>
                          <td className="col-muted">{player.age}</td>
                          <td className="col-muted">{player.nationality}</td>
                          <td className="col-muted">{player.foot}</td>
                          <td style={{ textAlign: 'center' }}>
                            <span className="table-ovr-badge">{pOvr}</span>
                          </td>
                          <td className="col-stat">{player.attributes.pace}</td>
                          <td className="col-stat">{player.attributes.shooting}</td>
                          <td className="col-stat">{player.attributes.passing}</td>
                          <td className="col-stat">{player.attributes.dribbling}</td>
                          <td className="col-stat">{player.attributes.defending}</td>
                          <td className="col-stat">{player.attributes.physical}</td>
                          <td className={`col-stat ${player.position !== 'GK' ? 'stat-dimmed-cell' : 'stat-highlight-cell'}`}>
                            {player.attributes.gk}
                          </td>
                          <td className="col-muted">{player.value}</td>
                          <td className="col-muted">{player.wage}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="inspect-btn"
                              onClick={(e) => {
                                e.stopPropagation();
                                selectPlayer(player, 'profile');
                              }}
                            >
                              Inspect →
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* VIEW D: PLAYER PROFILE FRAME (M1 SPINE STEP 3) */}
          {currentView === 'profile' && (
            <div className="profile-view-wrap">
              {/* SQUAD QUICK-PICKS */}
              <section className="squad-picks-bar">
                <div className="picks-header">
                  <span className="picks-title">First Team Squad · Quick Selection</span>
                  <div className="picks-nav-actions">
                    <button
                      type="button"
                      className="back-to-squad-btn"
                      onClick={() => setCurrentView('squad')}
                    >
                      ← Back to Squad List
                    </button>
                  </div>
                </div>
                <div className="picks-grid">
                  {SQUAD_PRESETS.map((preset) => {
                    const isActive = preset.id === selectedPlayerId;
                    const presetOvr = calculateOVR(preset.attributes, preset.position);
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        className={`quick-pick-btn ${isActive ? 'active' : ''}`}
                        onClick={() => selectPlayer(preset)}
                      >
                        <div className="pick-player-info">
                          <div className="pick-pos-line">
                            <span className="pos-tag-sm">{preset.position}</span>
                            <span>#{preset.number}</span>
                          </div>
                          <span className="pick-name">{preset.name}</span>
                        </div>
                        <div className="pick-ovr-pill">
                          <span>{presetOvr}</span>
                          <span className="pick-ovr-label">OVR</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* PLAYER PROFILE STAGE */}
              <section className="profile-frame">
                {/* LEFT COLUMN: TACTICAL IDENTITY & MINI PITCH */}
                <div className="tactical-identity-panel">
                  <div className="squad-number-hero">
                    <div>
                      <div className="squad-no-label">Squad Number</div>
                      <div className="squad-no">#{activePlayer.number}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="squad-no-label">Nationality</div>
                      <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700 }}>
                        {activePlayer.nationality}
                      </div>
                    </div>
                  </div>

                  {/* TACTICAL POSITION SELECTOR */}
                  <div className="position-selector-wrap">
                    <label htmlFor={positionSelectId} className="control-label">Tactical Position</label>
                    <select
                      id={positionSelectId}
                      className="tactical-select"
                      value={position}
                      onChange={(e) => setPosition(e.target.value as Position)}
                    >
                      {ALL_POSITIONS.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos} · Tactical Role
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* MINI PITCH SVG DIAGRAM */}
                  <div className="mini-pitch-card">
                    <svg
                      className="mini-pitch-svg"
                      viewBox="0 0 140 190"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Pitch grass fill */}
                      <rect x="6" y="6" width="128" height="178" rx="4" fill="#0d2617" />

                      {/* Pitch outer boundary */}
                      <rect
                        x="12"
                        y="12"
                        width="116"
                        height="166"
                        rx="2"
                        stroke="var(--pitch-line)"
                        strokeWidth="1.2"
                      />

                      {/* Halfway line */}
                      <line
                        x1="12"
                        y1="95"
                        x2="128"
                        y2="95"
                        stroke="var(--pitch-line)"
                        strokeWidth="1.2"
                      />

                      {/* Center circle */}
                      <circle
                        cx="70"
                        cy="95"
                        r="18"
                        stroke="var(--pitch-line)"
                        strokeWidth="1.2"
                      />
                      <circle cx="70" cy="95" r="1.5" fill="var(--pitch-line)" />

                      {/* Top penalty box (opponent) */}
                      <rect
                        x="34"
                        y="12"
                        width="72"
                        height="32"
                        stroke="var(--pitch-line)"
                        strokeWidth="1.2"
                      />
                      <rect
                        x="48"
                        y="12"
                        width="44"
                        height="12"
                        stroke="var(--pitch-line)"
                        strokeWidth="1"
                      />
                      <circle cx="70" cy="34" r="1.5" fill="var(--pitch-line)" />
                      <path
                        d="M 58 44 A 12 12 0 0 0 82 44"
                        stroke="var(--pitch-line)"
                        strokeWidth="1"
                      />
                      <rect
                        x="56"
                        y="8"
                        width="28"
                        height="4"
                        stroke="var(--pitch-line)"
                        strokeWidth="1"
                      />

                      {/* Bottom penalty box (own) */}
                      <rect
                        x="34"
                        y="146"
                        width="72"
                        height="32"
                        stroke="var(--pitch-line)"
                        strokeWidth="1.2"
                      />
                      <rect
                        x="48"
                        y="166"
                        width="44"
                        height="12"
                        stroke="var(--pitch-line)"
                        strokeWidth="1"
                      />
                      <circle cx="70" cy="156" r="1.5" fill="var(--pitch-line)" />
                      <path
                        d="M 58 146 A 12 12 0 0 1 82 146"
                        stroke="var(--pitch-line)"
                        strokeWidth="1"
                      />
                      <rect
                        x="56"
                        y="178"
                        width="28"
                        height="4"
                        stroke="var(--pitch-line)"
                        strokeWidth="1"
                      />

                      {/* Faint ghosts of all positions */}
                      {ALL_POSITIONS.map((posKey) => {
                        const coords = PITCH_COORDINATES[posKey];
                        if (!coords) return null;
                        return (
                          <circle
                            key={posKey}
                            cx={coords.x}
                            cy={coords.y}
                            r="2.5"
                            fill="rgba(232, 245, 233, 0.15)"
                          />
                        );
                      })}

                      {/* Active Player Position Marker with animated pulse ring */}
                      <circle
                        cx={currentMarker.x}
                        cy={currentMarker.y}
                        r="8"
                        className="pitch-marker-pulse"
                        stroke="var(--accent)"
                        fill="none"
                      />
                      <circle
                        cx={currentMarker.x}
                        cy={currentMarker.y}
                        r="4.5"
                        fill="var(--accent)"
                      />
                      <text
                        x={currentMarker.x}
                        y={currentMarker.y > 100 ? currentMarker.y - 8 : currentMarker.y + 14}
                        fill="var(--accent)"
                        fontSize="8.5"
                        fontWeight="800"
                        textAnchor="middle"
                        fontFamily="var(--font-display)"
                        letterSpacing="0.05em"
                      >
                        {position}
                      </text>
                    </svg>
                    <div className="pitch-legend">Tactical Pitch Spot · {position}</div>
                  </div>

                  {/* BIO TABLE */}
                  <div className="player-bio-table">
                    <div className="bio-item">
                      <span className="bio-label">Age</span>
                      <span className="bio-val">{activePlayer.age} yrs</span>
                    </div>
                    <div className="bio-item">
                      <span className="bio-label">Preferred Foot</span>
                      <span className="bio-val">{activePlayer.foot}</span>
                    </div>
                    <div className="bio-item">
                      <span className="bio-label">Est. Value</span>
                      <span className="bio-val">{activePlayer.value}</span>
                    </div>
                    <div className="bio-item">
                      <span className="bio-label">Current Wage</span>
                      <span className="bio-val">{activePlayer.wage}</span>
                    </div>
                  </div>
                </div>

                {/* RIGHT COLUMN: HERO PROFILE & ATTRIBUTE BARS */}
                <div className="profile-engine-panel">
                  {/* HERO HEADER & HUGE OVR */}
                  <div className="player-hero-header">
                    <div className="hero-text-wrap">
                      <div className="hero-role-badge">
                        <span>{position}</span>
                        <span>•</span>
                        <span>{activePlayer.role}</span>
                      </div>
                      <h1 className="hero-name">{activePlayer.name}</h1>
                      <p className="hero-details">
                        Senior First Team · Contracted to 2029 · Full Match Fitness
                      </p>
                    </div>

                    {/* HUGE OVR TILE */}
                    <div className="hero-ovr-tile">
                      <div className={`ovr-num-huge ${ovrPulse ? 'pulse' : ''}`}>{ovr}</div>
                      <div className="ovr-meta-wrap">
                        <span className="ovr-label-text">Overall</span>
                        <span className={`ovr-tier-tag ${tierInfo.class}`}>{tierInfo.label}</span>
                      </div>
                    </div>
                  </div>

                  {/* ATTRIBUTES SECTION (UNSLOP COPY & DEFAULT LOCKED) */}
                  <div className="attributes-section">
                    <div className="attributes-header">
                      <div>
                        <span className="attributes-title">Attributes</span>
                        <span className="attributes-hint">
                          {coachTweakActive
                            ? 'Coach Tweak Active · Live adjustment sandbox'
                            : 'Official Club Ratings · Locked'}
                        </span>
                      </div>

                      {/* Coach Tweak Toggle */}
                      <div className="coach-tweak-controls">
                        {coachTweakActive && (
                          <button
                            type="button"
                            className="coach-reset-btn"
                            onClick={resetPlayerToPreset}
                            title="Reset attributes to official ratings"
                          >
                            Reset
                          </button>
                        )}
                        <button
                          type="button"
                          className={`coach-tweak-btn ${coachTweakActive ? 'active' : ''}`}
                          onClick={() => setCoachTweakActive(!coachTweakActive)}
                        >
                          <span className="tweak-icon">{coachTweakActive ? '⚡' : '🔒'}</span>
                          <span>Coach Tweak: {coachTweakActive ? 'Active' : 'Locked'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="attribute-rows-container">
                      {ATTRIBUTE_CONFIGS.map((cfg) => {
                        const val = attributes[cfg.key] ?? 50;
                        const style = getStatStyleClass(val);
                        const isGkStat = cfg.key === 'gk';
                        const isOutfield = position !== 'GK';
                        const shouldDim = isGkStat && isOutfield;

                        return (
                          <div
                            key={cfg.key}
                            className={`attr-row ${shouldDim ? 'attr-dimmed' : ''}`}
                          >
                            <div className="attr-info">
                              <span className="attr-code">{cfg.code}</span>
                              <span className="attr-full-name">
                                {cfg.name}
                                {shouldDim && <span className="dim-tag"> (Outfield)</span>}
                              </span>
                            </div>

                            {/* Horizontal Bar */}
                            <div className="attr-bar-cell">
                              <div className="attr-bar-track">
                                <div
                                  className={`attr-bar-fill ${style.fill}`}
                                  style={{ width: `${Math.max(2, Math.min(100, val))}%` }}
                                />
                              </div>
                              {/* Range input only interactive when coach tweak is unlocked */}
                              {coachTweakActive && (
                                <input
                                  type="range"
                                  min={1}
                                  max={99}
                                  value={val}
                                  aria-label={`${cfg.name} (${cfg.code})`}
                                  className="attr-slider-overlay"
                                  onChange={(e) =>
                                    handleAttrChange(cfg.key, parseInt(e.target.value, 10))
                                  }
                                />
                              )}
                            </div>

                            {/* Value & Steppers (steppers only when unlocked) */}
                            <div className="attr-controls">
                              {coachTweakActive ? (
                                <>
                                  <button
                                    type="button"
                                    className="attr-step-btn"
                                    aria-label={`Decrease ${cfg.name}`}
                                    onClick={() => handleStepAttr(cfg.key, -1)}
                                  >
                                    -
                                  </button>
                                  <span className={`attr-val-display ${style.text}`}>{val}</span>
                                  <button
                                    type="button"
                                    className="attr-step-btn"
                                    aria-label={`Increase ${cfg.name}`}
                                    onClick={() => handleStepAttr(cfg.key, 1)}
                                  >
                                    +
                                  </button>
                                </>
                              ) : (
                                <span className={`attr-val-display ${style.text}`}>{val}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* ROLE WEIGHT SUMMARY BAR (HIDDEN BY DEFAULT, SHOWN IN COACH TOOLS) */}
                    {coachTweakActive && (
                      <div className="role-weights-bar">
                        <span className="weights-label">{position} Formula Weights</span>
                        <div className="weights-pills">
                          {Object.entries(weights).map(([k, weight]) => {
                            const pct = Math.round((weight ?? 0) * 100);
                            const isHigh = pct >= 25;
                            return (
                              <span key={k} className={`weight-pill ${isHigh ? 'primary' : ''}`}>
                                {k.toUpperCase()} {pct}%
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* 4. FOOTER (TINY WITH GITHUB LINK ONLY - NO ENGINE BUILD SLOP) */}
          <footer className="dugout-footer">
            <a
              href="https://github.com/azibfikri/fm-game"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub: azibfikri/fm-game
            </a>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;

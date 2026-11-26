import React, { useState, useEffect, useId } from 'react';
import {
  calculateOVR,
  getOvrTier,
  POSITION_WEIGHTS,
  clampStat,
  Position,
  PlayerAttributes,
} from '@/game-engine';

interface SquadPlayerPreset {
  id: string;
  name: string;
  number: number;
  age: number;
  nationality: string;
  foot: 'Right' | 'Left' | 'Both';
  value: string;
  wage: string;
  position: Position;
  role: string;
  attributes: PlayerAttributes;
}

const SQUAD_PRESETS: SquadPlayerPreset[] = [
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
    id: 'ramos-4',
    name: 'David Ramos',
    number: 4,
    age: 29,
    nationality: 'Spain',
    foot: 'Right',
    value: '£34.0M',
    wage: '£75k/w',
    position: 'CB',
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
    id: 'becker-1',
    name: 'Alen Becker',
    number: 1,
    age: 26,
    nationality: 'Brazil',
    foot: 'Right',
    value: '£38.0M',
    wage: '£80k/w',
    position: 'GK',
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

// Tactical pitch positions (x: 12-128, y: 12-178 in 140x190 canvas)
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
  const [selectedPresetId, setSelectedPresetId] = useState<string>('vance-9');
  const [activePlayer, setActivePlayer] = useState<SquadPlayerPreset>(SQUAD_PRESETS[0]);
  const [attributes, setAttributes] = useState<PlayerAttributes>(SQUAD_PRESETS[0].attributes);
  const [position, setPosition] = useState<Position>(SQUAD_PRESETS[0].position);
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [ovrPulse, setOvrPulse] = useState<boolean>(false);
  const positionSelectId = useId();

  const ovr = calculateOVR(attributes, position);
  const tier = getOvrTier(ovr);

  // Trigger brief pulse animation on OVR change
  useEffect(() => {
    setOvrPulse(true);
    const timer = setTimeout(() => setOvrPulse(false), 360);
    return () => clearTimeout(timer);
  }, [ovr]);

  const selectSquadPlayer = (preset: SquadPlayerPreset) => {
    setSelectedPresetId(preset.id);
    setActivePlayer(preset);
    setPosition(preset.position);
    setAttributes(preset.attributes);
  };

  const handleAttrChange = (key: keyof PlayerAttributes, val: number) => {
    const clamped = clampStat(val);
    setAttributes((prev) => ({
      ...prev,
      [key]: clamped,
    }));
  };

  const handleStepAttr = (key: keyof PlayerAttributes, delta: number) => {
    handleAttrChange(key, (attributes[key] ?? 50) + delta);
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
            <div className="club-identity">
              <div className="club-crest">SB</div>
              <span className="club-name">South Bridge FC</span>
            </div>
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

      {/* 2. DUGOUT WORKSPACE BODY: LEFT RAIL + STAGE */}
      <div className="dugout-body">
        {/* LEFT RAIL */}
        <aside className="dugout-rail">
          <div className="rail-section">
            <div className="rail-section-label">Club Hub</div>
            <ul className="rail-nav">
              <li>
                <button
                  type="button"
                  className={`rail-item ${activeTab === 'portal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('portal')}
                >
                  <span className="rail-icon">⬡</span>
                  <span>Portal</span>
                  <span className="rail-pill">LIVE</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`rail-item ${activeTab === 'squad' ? 'active' : ''}`}
                  onClick={() => setActiveTab('squad')}
                >
                  <span className="rail-icon">▥</span>
                  <span>Squad</span>
                  <span className="rail-pill">24</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className={`rail-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <span className="rail-icon">◈</span>
                  <span>Player Profile</span>
                </button>
              </li>
            </ul>

            <div className="rail-section-label" style={{ marginTop: '0.75rem' }}>
              Operations
            </div>
            <ul className="rail-nav">
              <li>
                <div className="rail-item disabled">
                  <span className="rail-icon">▤</span>
                  <span>Tactics</span>
                  <span className="rail-pill">SOON</span>
                </div>
              </li>
              <li>
                <div className="rail-item disabled">
                  <span className="rail-icon">▲</span>
                  <span>Training</span>
                  <span className="rail-pill">M2</span>
                </div>
              </li>
              <li>
                <div className="rail-item disabled">
                  <span className="rail-icon">◫</span>
                  <span>Fixtures</span>
                  <span className="rail-pill">M3</span>
                </div>
              </li>
              <li>
                <div className="rail-item disabled">
                  <span className="rail-icon">⇌</span>
                  <span>Transfers</span>
                  <span className="rail-pill">M4</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="rail-footer">
            <div className="rail-status-pill">
              <span className="status-dot" />
              <span>Dugout Ready</span>
            </div>
          </div>
        </aside>

        {/* 3. MAIN STAGE: PLAYER PROFILE FRAME */}
        <main className="dugout-stage">
          {/* SQUAD QUICK-PICKS */}
          <section className="squad-picks-bar">
            <div className="picks-header">
              <span className="picks-title">First Team Squad · Quick Selection</span>
              <span className="attributes-hint">Click player to inspect profile</span>
            </div>
            <div className="picks-grid">
              {SQUAD_PRESETS.map((preset) => {
                const isActive = preset.id === selectedPresetId;
                const presetOvr = calculateOVR(preset.attributes, preset.position);
                return (
                  <button
                    key={preset.id}
                    type="button"
                    className={`quick-pick-btn ${isActive ? 'active' : ''}`}
                    onClick={() => selectSquadPlayer(preset)}
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

              {/* ATTRIBUTES LIST WITH HORIZONTAL BARS */}
              <div className="attributes-section">
                <div className="attributes-header">
                  <span className="attributes-title">Attributes &amp; Metric Weights</span>
                  <span className="attributes-hint">Drag bar or tap +/- to calibrate</span>
                </div>

                <div className="attribute-rows-container">
                  {ATTRIBUTE_CONFIGS.map((cfg) => {
                    const val = attributes[cfg.key] ?? 50;
                    const style = getStatStyleClass(val);
                    return (
                      <div key={cfg.key} className="attr-row">
                        <div className="attr-info">
                          <span className="attr-code">{cfg.code}</span>
                          <span className="attr-full-name">{cfg.name}</span>
                        </div>

                        {/* Interactive Horizontal Bar */}
                        <div className="attr-bar-cell">
                          <div className="attr-bar-track">
                            <div
                              className={`attr-bar-fill ${style.fill}`}
                              style={{ width: `${Math.max(2, Math.min(100, val))}%` }}
                            />
                          </div>
                          {/* Invisible overlay range for scrub interaction */}
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
                        </div>

                        {/* Value & Steppers */}
                        <div className="attr-controls">
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
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ROLE WEIGHT SUMMARY BAR */}
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
              </div>
            </div>
          </section>

          {/* 4. FOOTER (TINY WITH GITHUB LINK ONLY) */}
          <footer className="dugout-footer">
            <span>DUGOUT FIRST TEAM SQUAD ENGINE · BUILD 2026.11</span>
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

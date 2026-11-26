import React, { useState } from 'react';
import { Trophy, Activity, CheckCircle2, ExternalLink } from 'lucide-react';
import {
  calculateOVR,
  getOvrTier,
  Position,
  PlayerAttributes,
} from '@/game-engine';

interface Preset {
  label: string;
  position: Position;
  attributes: PlayerAttributes;
  name: string;
}

const PRESETS: Preset[] = [
  {
    label: 'Elite Striker',
    position: 'ST',
    name: 'Marcus Vance',
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
    label: 'Playmaker',
    position: 'CAM',
    name: 'Julian Sterling',
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
    label: 'Solid CB',
    position: 'CB',
    name: 'David Ramos',
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
    label: 'Shot Stopper',
    position: 'GK',
    name: 'Alen Becker',
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

const POSITIONS: Position[] = [
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

export const App: React.FC = () => {
  const [position, setPosition] = useState<Position>('ST');
  const [playerName, setPlayerName] = useState<string>('Marcus Vance');
  const [attributes, setAttributes] = useState<PlayerAttributes>({
    pace: 88,
    shooting: 92,
    passing: 74,
    dribbling: 84,
    defending: 32,
    physical: 80,
    gk: 15,
  });

  const ovr = calculateOVR(attributes, position);
  const tier = getOvrTier(ovr);

  const handleAttrChange = (key: keyof PlayerAttributes, val: number) => {
    setAttributes((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const applyPreset = (preset: Preset) => {
    setPosition(preset.position);
    setPlayerName(preset.name);
    setAttributes(preset.attributes);
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-group">
          <div className="logo-icon">
            <Trophy size={24} />
          </div>
          <div className="title-wrap">
            <h1>Football Manager</h1>
            <p>Web Browser Edition • Personal Project</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-info">Web URL</span>
          <span className="badge badge-success">GitHub Pages CI/CD</span>
        </div>
      </header>

      {/* Milestone status note */}
      <section className="status-banner">
        <Activity size={24} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div className="banner-content">
          <h3>Milestone 1 (M1) In Progress</h3>
          <p>
            Welcome to Football Manager Web! We are currently building Milestone 1: connecting
            the personal Lark Base data tables (Leagues, Clubs, Players, Fixtures, MatchResults, Saves)
            to power club selection, squad management, and real-time attribute views in the browser.
          </p>
        </div>
      </section>

      {/* Main Grid: OVR Engine Test & Roadmap */}
      <div className="grid-layout">
        {/* Left Card: Live OVR Engine */}
        <section className="card">
          <div className="card-title">
            <span>OVR Calculation Engine</span>
            <span className="badge badge-info">Live Pure TS Engine</span>
          </div>
          <p className="card-subtitle">
            Our pure TypeScript game engine weights attributes dynamically depending on position to calculate realistic Overall Ratings (1–99).
          </p>

          <div className="preset-buttons">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', alignSelf: 'center', marginRight: '0.25rem' }}>Presets:</span>
            {PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className="btn-preset"
                onClick={() => applyPreset(p)}
              >
                {p.label}
              </button>
            ))}
          </div>

          <label style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>
            Position:
          </label>
          <select
            className="select-control"
            value={position}
            onChange={(e) => setPosition(e.target.value as Position)}
          >
            {POSITIONS.map((pos) => (
              <option key={pos} value={pos}>
                {pos}
              </option>
            ))}
          </select>

          {/* Sliders */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
            {(Object.keys(attributes) as Array<keyof PlayerAttributes>).map((attrKey) => (
              <div key={attrKey} className="slider-group">
                <div className="slider-header">
                  <span style={{ textTransform: 'capitalize' }}>{attrKey}</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                    {attributes[attrKey]}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={99}
                  value={attributes[attrKey]}
                  className="slider-input"
                  onChange={(e) => handleAttrChange(attrKey, parseInt(e.target.value, 10))}
                />
              </div>
            ))}
          </div>

          {/* Resulting Player Card Preview */}
          <div className="player-card">
            <div className="player-header">
              <div className="player-main-info">
                <h4>{playerName}</h4>
                <div className="player-meta">
                  Position: <strong>{position}</strong> • Tier: <strong style={{ textTransform: 'capitalize' }}>{tier}</strong>
                </div>
              </div>
              <div className={`ovr-pill ovr-${tier}`}>
                <span className="val">{ovr}</span>
                <span className="label">OVR</span>
              </div>
            </div>

            <div className="attribute-grid">
              <div className="attribute-box">
                <div className="attr-label">PAC</div>
                <div className="attr-val">{attributes.pace}</div>
              </div>
              <div className="attribute-box">
                <div className="attr-label">SHO</div>
                <div className="attr-val">{attributes.shooting}</div>
              </div>
              <div className="attribute-box">
                <div className="attr-label">PAS</div>
                <div className="attr-val">{attributes.passing}</div>
              </div>
              <div className="attribute-box">
                <div className="attr-label">DRI</div>
                <div className="attr-val">{attributes.dribbling}</div>
              </div>
              <div className="attribute-box">
                <div className="attr-label">DEF</div>
                <div className="attr-val">{attributes.defending}</div>
              </div>
              <div className="attribute-box">
                <div className="attr-label">PHY</div>
                <div className="attr-val">{attributes.physical}</div>
              </div>
              <div className="attribute-box">
                <div className="attr-label">GK</div>
                <div className="attr-val">{attributes.gk}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Right Card: Roadmap & Architecture */}
        <section className="card">
          <div className="card-title">
            <span>Project Roadmap</span>
          </div>
          <p className="card-subtitle">
            Progressing milestone by milestone toward a full web football manager.
          </p>

          <ul className="roadmap-list">
            <li className="roadmap-item active">
              <span className="roadmap-badge active-badge">M1 • WIP</span>
              <div className="roadmap-text">
                <h5>Lark Base + Squad Viewer</h5>
                <p>Club setup, squad roster, and player stats in web UI.</p>
              </div>
            </li>
            <li className="roadmap-item">
              <span className="roadmap-badge pending-badge">M2</span>
              <div className="roadmap-text">
                <h5>PixiJS Training Mini-Game</h5>
                <p>30-60s skill games yielding A/B/C grades and attribute XP.</p>
              </div>
            </li>
            <li className="roadmap-item">
              <span className="roadmap-badge pending-badge">M3</span>
              <div className="roadmap-text">
                <h5>Season Fixtures & Match Sim</h5>
                <p>Fast simulation, match events, scores, and league standings.</p>
              </div>
            </li>
            <li className="roadmap-item">
              <span className="roadmap-badge pending-badge">M4</span>
              <div className="roadmap-text">
                <h5>Transfers & Mods Menu</h5>
                <p>Player contracts, transfers, and mods (instant training, money).</p>
              </div>
            </li>
            <li className="roadmap-item">
              <span className="roadmap-badge pending-badge">M5</span>
              <div className="roadmap-text">
                <h5>Import & Public Web Release</h5>
                <p>Custom JSON/CSV DB import, UI polish, and live GitHub Pages URL.</p>
              </div>
            </li>
          </ul>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-subtle)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={16} color="#059669" />
              <strong style={{ fontSize: '0.8125rem' }}>Engine Unit Tests Verified</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Position weight sums, clamp boundaries, and role-specific OVR calculations tested via Vitest.
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div>
          <span>Football Manager Web &copy; 2026. Built with React, TypeScript &amp; Vite.</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a
            href="https://github.com/azibfikri/fm-game"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
          >
            GitHub Repo <ExternalLink size={12} />
          </a>
          <a
            href="https://g-asiapac.sg.larksuite.com/base/NzpwbpB3eaKoKysbuDjl9kf2gmg"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
          >
            Lark Base DB <ExternalLink size={12} />
          </a>
        </div>
      </footer>
    </div>
  );
};

export default App;

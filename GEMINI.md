# Football Manager desktop game (personal)

## Owner
- Azib, personal project only
- Path: `/Users/azibfikri/Personal/fm-game`
- Never touch work folders (OpenBot work bots, APN, SKVE, work Gmail, work Cursor projects)
- Exception: personal Lark Base only as game DB (Azib OK 2026-11-26); never work Bases

## Coding tool
- **Gemini CLI only** for all coding
- Sign-in: personal Google `azibfikri14@gmail.com` (not work)
- Do **not** use Cursor or Cursor cloud agents to write this project’s code
- Run Gemini CLI from this folder so it loads this file

## Product
Desktop football manager (macOS first, Windows later). Not a web page.

### Stack
- Tauri 2 (Rust) + React + TypeScript + Vite
- PixiJS for training mini-games
- Lark Base (personal) for saves / leagues / clubs / players
- Zustand for live game state in the app
- Light theme (dark text on light backgrounds)

### Data
- Made-up leagues/clubs/players shipped (no real names/logos/faces)
- Import Database: JSON/CSV for user’s own data
- Player: name, age, nationality, position, club, OVR 1–99, potential, value, wage
- Attributes: pace, shooting, passing, dribbling, defending, physical + GK
- OVR from attributes, weighted by position

### Core loop
- Pick club → squad → transfers → budget → season fixtures
- Matches: quick text/2D sim (score + key events)
- League table, top scorers, season end (growth + aging)

### Training mini-games
- One short mini-game per attribute (30–60s)
- Grade A/B/C → XP → attributes → OVR
- Session limits per week; potential caps growth

### Mods
- Unlimited money, max stats, instant training (auto A), edit player/club
- “Mods on” badge on save

### Structure
- `/game-engine` (pure TS), `/ui`, `/minigames`, `/data`, `/src-tauri`
- Unit tests: OVR, XP/level-up, match sim, transfers

## Workflow
1. Plan first (screens, data model, milestones). Wait for Azib OK.
2. Build one milestone at a time; short demo/screenshots after each.
3. Git with small commits. Personal GitHub (`azibfikri`) OK. No work GitHub/GitLab.
4. Ask before anything that costs money.

### Milestones
- M1: Lark Base wired; create club, view squad, player stats + OVR
- M2: one training mini-game with A/B/C + level-up
- M3: season fixtures + simulated matches
- M4: transfers, money, Mods menu
- M5: import database, polish, macOS installer

## Done means
- App installs and runs on Mac
- Start save → train in mini-game → see grade → OVR goes up
- Mods menu works; tests pass

## Progress
- Status: M1 in progress via Gemini CLI (GEMINI_API_KEY auth)
- Base URL: https://g-asiapac.sg.larksuite.com/base/NzpwbpB3eaKoKysbuDjl9kf2gmg
- Last update: 2026-11-26

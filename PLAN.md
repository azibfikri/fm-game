# FM Game — Build plan (awaiting Azib OK)

Status: **plan OK · Base created · waiting Gemini personal sign-in before M1 code**  
Path: `/Users/azibfikri/Personal/fm-game`  
Coding later: Gemini CLI only · personal Google `azibfikri14@gmail.com` · never Cursor for code

**DB (Azib OK 2026-11-26):** **Lark Base** replaces SQLite.  
Base: [FM Game](https://g-asiapac.sg.larksuite.com/base/NzpwbpB3eaKoKysbuDjl9kf2gmg)  
Token: `NzpwbpB3eaKoKysbuDjl9kf2gmg`  
Tables: Leagues · Clubs · Players · Fixtures · MatchResults · Saves  
Still no APN/SKVE folders or work bots. Game code stays in this personal folder.

---

## Screens

| Screen | Purpose |
|--------|---------|
| Main menu | New game / Load / Import Database / Mods |
| New game | Pick league + club |
| Hub | Budget, next fixture, shortcuts |
| Squad | Roster → open player |
| Player | Attributes, OVR, potential, value, wage |
| Training | Pick attribute → mini-game → grade A/B/C |
| Fixtures | Season calendar |
| Match | Quick text/2D sim + key events |
| League table | Standings |
| Top scorers | Season scorers |
| Transfer market | Buy/sell, wages |
| Mods | Unlimited money, max stats, instant train, edit |
| Import | JSON/CSV load into Lark Base tables |

---

## Data model (Lark Base tables)

**Tables:** Leagues · Clubs · Players · Fixtures · MatchResults · Saves

**Player fields:** name, age, nationality, position, clubId, potential, value, wage  
**Attributes (1–99):** pace, shooting, passing, dribbling, defending, physical, GK  
**OVR:** weighted from attributes by position (1–99)

**Save row:** money, week, season, weeklyTrainingUsed, modsOn badge

**Runtime:** Lark Base over API · Zustand in memory (live UI)  
**Needs:** internet + Lark sign-in (current CLI user: Azib Fikri)

**Analogy:** Lark Base is the shared notebook in the cloud; the app reads/writes pages; Zustand is the sticky notes on your desk while you play.

---

## Folder layout

```
fm-game/
  game-engine/   # pure TS: OVR, XP, match sim, transfers
  ui/            # React screens
  minigames/     # PixiJS training games
  data/          # seed JSON to push into Lark Base
  src-tauri/     # Tauri 2 shell
  PLAN.md
  BRIEF.md
  GEMINI.md
```

Unit tests target: OVR, XP/level-up, match sim, transfers (logic still local; Base is storage).

---

## Milestones

| Milestone | Delivers |
|-----------|----------|
| **M1** | Lark Base wired; create club; view squad; player stats + OVR |
| **M2** | One training mini-game → A/B/C → XP → attribute/OVR up (write back to Base) |
| **M3** | Season fixtures + simulated matches |
| **M4** | Transfers, money, Mods menu (+ Mods-on badge) |
| **M5** | Import JSON/CSV into Base, polish, macOS installer |

**Ship check:** Mac install → train once → see grade → OVR rises in Base → Mods work → tests pass

**Stack:** Tauri 2 + React + TypeScript + Vite · PixiJS · **Lark Base** · Zustand · light theme · made-up names only

---

## Hard rules (kept / updated)

- Code only in this folder; no APN / SKVE / work Cursor projects
- **Exception:** personal Lark Base as game DB only (not work Bases)
- Local git only; no work remotes
- Ask before any spend
- After each milestone: short demo + Done block

---

## Next

1. Confirm this Lark Base is the intended personal tenant (not a work-only Base you want avoided)
2. Confirm Gemini CLI signed in as `azibfikri14@gmail.com` (local `google_accounts.json` has no active account yet)
3. Then M1 coding via Gemini CLI only

# FM Game — Build plan

Status: **plan OK · web URL ship · CI/CD · M1 still in progress**  
Path: `/Users/azibfikri/Personal/fm-game`  
Coding: Gemini CLI only · `GEMINI_API_KEY` · never Cursor for project code  
Repo: https://github.com/azibfikri/fm-game  
Public URL (target): https://azibfikri.github.io/fm-game/

**DB:** Lark Base [FM Game](https://g-asiapac.sg.larksuite.com/base/NzpwbpB3eaKoKysbuDjl9kf2gmg)  
Token: `NzpwbpB3eaKoKysbuDjl9kf2gmg`  
Tables: Leagues · Clubs · Players · Fixtures · MatchResults · Saves

**Publish (Azib 2026-11-26):** **Web URL only** — revert desktop/Tauri installer ship. CI+CD deploys the Vite site to GitHub Pages.

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
**Player + attributes + OVR** as before · **Save** row for money/week/season/mods  
**Runtime:** Lark Base API · Zustand in memory

---

## Folder layout

```
fm-game/
  game-engine/
  ui/
  minigames/
  data/
  .github/workflows/   # CI + Pages CD
  PLAN.md BRIEF.md GEMINI.md
```

(`src-tauri/` leftover — not used for publish)

---

## Milestones

| Milestone | Delivers |
|-----------|----------|
| **M1** | Create club; view squad; player stats + OVR (web UI) |
| **M2** | One training mini-game → A/B/C → XP → OVR up |
| **M3** | Season fixtures + simulated matches |
| **M4** | Transfers, money, Mods menu |
| **M5** | Import JSON/CSV, polish, stable public URL |

**Ship check:** Open public URL → train once → grade → OVR up → Mods work → CI green

**Stack:** React + TypeScript + Vite · PixiJS · Lark Base · Zustand · light theme · GitHub Pages CI/CD

---

## CI/CD

- **CI:** on push/PR — `npm ci`, `npm test`, `npm run build`
- **CD:** on `main` — deploy `dist/` to GitHub Pages (`/fm-game/` base path)

---

## Hard rules

- Code only in this folder; no APN / SKVE / work Cursor projects
- Personal Lark Base only; personal GitHub `azibfikri`
- Ask before any spend
- Gemini CLI for project code

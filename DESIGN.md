# Dugout UI — own visual language (not a CRM, not FM clone)

Research basis (Sports Interactive / Football Manager patterns we *learn from*, then invent our own):
- Portal hub + top nav (efficiency / familiarity)
- Dense info first: overview tiles → deeper panels
- Charcoal panels, pitch-green atmosphere, club colour stripe
- Attribute numbers + bars, tabular stats, not SaaS forms
- Skins community: fewer boxes, denser tables, grass/pitch feel

## Our identity: **Dugout**
Working brand mark in the chrome: **DUGOUT** (subtitle can stay Football Manager Web).
Feel like sitting in a cold night dugout overlooking floodlit grass — not a B2B admin console.

## Hard bans (anti AI-slop / anti-CRM)
- No Inter / Roboto / system UI stacks as the hero font
- No purple gradients, glow, glassmorphism stacks, rounded-full pill clusters
- No “status banner” / “roadmap card” / Lucide-icon feature marketing blocks
- No centered max-width SaaS page with white cards on `#f8fafc`
- No soft blue info chips (“Web URL”, “CI/CD”) in the hero
- No generic shadow card grid that could be a CRM dashboard after removing the title

## Palette (CSS variables)
- `--pitch-deep`: #0c1f14 — near-black green field night
- `--pitch`: #1a3d2b — grass mid
- `--pitch-line`: rgba(232, 245, 233, 0.12) — faint pitch lines
- `--panel`: #141a17 — charcoal dugout panel
- `--panel-2`: #1c2420
- `--ink`: #e8f0ea — primary text
- `--ink-dim`: #8fa396
- `--accent`: #c4f542 — acid pitch marker (our accent, not SI purple)
- `--warn`: #f0a35a — amber for alerts / low condition
- `--club`: #e11d48 — example club stripe (swapable later)

## Type
- Display: **"Barlow Condensed"** or **"Oswald"** (Google Fonts) — tight, sports-board energy
- Body / tables: **"IBM Plex Sans"** — readable, not Inter
- Numbers: tabular-nums; OVR huge and condensed

## Layout (one composition, full-bleed)
1. **Top strip (nav):** DUGOUT wordmark · fictional club name · season week · thin club colour bar under
2. **Left rail (narrow):** Portal · Squad · Player · Training · (disabled later items greyed)
3. **Main stage:** Player Profile frame (current OVR demo reframed as a *game* profile, not a calculator)
   - Left: silhouette block / position on mini pitch diagram (CSS/SVG, no stock photos)
   - Center: name, age placeholder, position, huge OVR tile
   - Right/bottom: attribute rows with horizontal bars + 1–99 numbers (PAC SHO PAS DRI DEF PHY GK)
4. Presets become **squad quick-picks** (list of 4 players), not pill buttons labeled “Elite Striker”
5. Remove project roadmap / milestone marketing UI from the game chrome entirely

## Motion (2–3 intentional)
- Nav underline / rail selection slide
- Attribute bars fill on preset change
- OVR number tick/fade when value changes

## Copy tone in UI
Game words only: club, squad, attributes, overall. Zero “Milestone”, “engine verified”, “Lark Base”, “GitHub Pages” in the main view (footer tiny link OK).

## Files to rewrite
- `ui/App.tsx`, `ui/index.css`, `ui/main.tsx` if needed
- Keep game-engine OVR logic
- Keep `base: '/fm-game/'` in vite
- Light theme rule in GEMINI.md is **overridden** for this dugout look (Azib request 2026-11-26)

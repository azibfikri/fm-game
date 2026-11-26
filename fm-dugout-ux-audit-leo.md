# Dugout live UI audit — Leonardo (QA/UX)

**Checked:** https://azibfikri.github.io/fm-game/ (26 Nov 2026) + `DESIGN.md`  
**Not checked:** mobile layout, motion polish frame-by-frame, Lark Base M1 wiring, match sim  
**Screenshot:** attached with this handoff  
**Mode:** review only — no code / deploy

---

## Verdict
**Partial game skin on a working OVR sandbox.** Atmosphere (charcoal + pitch green, condensed type, mini pitch, OVR tick) already beats CRM purple-slop. First session still reads as “attribute calculator in a dugout costume,” not “I manage this club.”

Analogy: floodlights are on, but you’re still in the gym calibrating a treadmill — not on the touchline for kickoff.

---

## 1) First 30 seconds
A new player thinks: **scouting / FIFA-style player editor**, not career start.

- Drop straight onto a fully filled Marcus/Julian profile + bars + formula weights  
- Club (South Bridge FC) and Matchweek 14 feel like wallpaper — no choice, no consequence  
- No “pick club → meet squad → open player” beat  
- Footer `ENGINE · BUILD` + GitHub + “calibrate” = builder energy

## 2) Visual hierarchy / game vs admin
| Working | Still slop / admin |
|---|---|
| Dark pitch-deep bg, acid accent, club stripe | “Attributes & Metric Weights” (lab copy) |
| Barlow-ish condensed name + huge OVR | “Drag bar or tap +/- to calibrate” |
| Mini pitch spot | Formula weight % chips read like a model debugger |
| Squad quick-picks (not “Elite Striker” pills) | Status-ish “Dugout Ready” + engine build strip |
| No purple / Inter hero | Rail marks Portal/Squad as LIVE but they don’t navigate |

**Feel score:** ~65% dugout, ~35% tool. DESIGN bans on CRM cards are mostly respected; copy bans are not.

## 3) Navigation
- **Portal LIVE** / **Squad 24**: clickable, `disabled=false`, **no view change** (dead ends dressed as live)  
- **Player Profile**: only real destination  
- **Operations** (Tactics SOON / Training M2 / Fixtures M3 / Transfers M4): grey roadmap — OK if clearly locked; avoid fake LIVE elsewhere  
- **Squad 24** badge lies: UI shows **4** presets  

**Fix pattern:** one live rail item, or make Portal a real hub. Label locked items “Locked” not “LIVE”.

## 4) Player profile + attrs
**Fun spark:** switching quick-picks, +/- updating OVR (verified: Sterling SHO 82→84, OVR 85→86). Pitch spot + role help game feel.

**Spreadsheet drag:**
- Open editing of every attr + weight table on day one  
- GK bar on an outfield CAM  
- Wage/value as static props (fine) but sit next to a full “calibrate” lab  

For M1 demo: default **read-only bars**; “Training tweak” or debug mode for +/-. Or one “Board view” vs “Coach tweak” toggle.

## 5) M1 friction (pick club → squad → player)
Missing entirely:
1. Club select / confirm South Bridge  
2. Squad list of 24 (or honest “Demo XI · 4”)  
3. Row → profile  

Today: profile *is* the app. Portal/Squad are promises.

## 6) Top 5 recommendations (impact × effort)

| # | Fix | Why | Effort |
|---|---|---|---|
| 1 | **Honest nav** — Portal/Squad either real views or not marked LIVE; Squad count = real N | Trust + first-session clarity | S |
| 2 | **Unslop copy** — drop calibrate / Metric Weights / ENGINE BUILD from chrome; game words only | DESIGN.md compliance | S |
| 3 | **Portal hub stub** — next match card, 4–8 squad tiles, one CTA “Open player” | Makes it feel like FM portal, not editor | M |
| 4 | **Attrs default locked**; unlock “tweak” for sandbox | Less spreadsheet, more inspect | S–M |
| 5 | **M1 spine screen:** Club confirm → Squad table → Profile | Delivers the requested career beat | M |

## 7) Bold idea (web FM, not fluff)
**Matchday tunnel, not empty Portal:** one full-bleed strip — opponent, kickoff clock, “Set XI” (even if XI is the same 4 demos). Profile becomes a side door from a highlighted name on the sheet. The game starts at the mouth of the tunnel; the gym (attr editor) stays behind a door labeled Coach tools.

Optional: rain/noise of the dugout as subtle CSS motion on that tunnel only (2–3 motions total per DESIGN).

---

## Hand to Gemini (checklist)
- [ ] Portal view ≠ Player Profile  
- [ ] Remove or hide formula weights from default profile  
- [ ] Rename section to Attributes (not Metric Weights)  
- [ ] Fix Squad 24 → Squad 4 or expand list  
- [ ] Footer: tiny GitHub only; no ENGINE BUILD in main chrome  
- [ ] Do not implement via Cursor — FM Bot / Gemini CLI only  

**Sources:** live URL walk (Portal/Squad/Profile/quick-picks/attr +/-), DESIGN.md hard bans + layout, screenshot of Sterling profile state.

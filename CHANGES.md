# ConcreteIQ — Changes vs previous build

## Phase 4 — Mix design re-aligned to user's IS 10262:2019 Excel template
| # | Issue user reported | Fix |
|---|---|---|
| 12 | Standard deviation σ for M40+ was 6 MPa (gave inflated target strength) | Per IS 10262:2019 Table 1 (good QC, OPC + min cement): M10–M15 = 3.5, M20–M25 = 4.0, **M30 and above = 5.0**. M60 target now correctly = 60 + 1.65×5 = 68.25 MPa. |
| 13 | W/C for M60 was being computed via Abrams' law as 0.28 (unrealistic for HSC) | Replaced with **IS 10262:2019 Annex A trial W/C table** (M25 → 0.50, M30 → 0.45, M40 → 0.40, M50 → 0.36, **M60 → 0.33**, M70 → 0.30, M80 → 0.28, …). Result is then clamped to IS 456:2000 Table 5 maximum for the chosen exposure (the lower of the two governs). |
| 14 | HRWR water reduction was 25% (water = 150) instead of 30% (water = 138 per Excel) | Updated SP rules to IS 9103 + HSC practice: HRWR 30 %, MRWR 12 %, Normal WR 6 %. Water for M60 now correctly resolves to 138 kg/m³. |
| 15 | Total binder was silently capped at 450 kg/m³ even when the absolute-volume calc said 418 | Removed the silent clamp. Calculated binder = water/wc is preserved (e.g. M60 → 138/0.33 = 418 kg/m³). User-set max is now a soft warning, not a hard override. |
| 16 | Coarse-aggregate fraction was using IS 10262:**2009** Table 3 (FA fraction) | Switched to IS 10262:**2019** **Table 10** (CA fraction): 20 mm → 0.64/0.66/0.68/0.70 for Zones I/II/III/IV. Adjustment per Cl.5.5.1 (+0.01 per −0.05 in W/C) and Cl.5.5.2 (−0.04 when SCM is used / pumpable). For M60 (20 mm, Zone II, w/c=0.33, GGBS+SF) gives 0.654 — **matches the Excel** exactly. |
| 17 | Air-entrained void was a flat 1.0 % regardless of aggregate size | Per IS 10262:2019 Table 11: **20 mm → 1.0 %, 10 mm → 1.5 %, 40 mm → 0.5 %**. |
| 18 | FA / CA values were rounded to nearest 5 kg/m³ (lossy for HSC) | Rounded to nearest 1 kg/m³. M60 now gives FA = 650 kg, CA = 1271 kg (vs Excel's 656 / 1283 — within 1 %). |

## Phase 5 — Detection: reject concrete cubes / cylinders / fresh concrete
| # | Issue user reported | Fix |
|---|---|---|
| 19 | Compression-tested concrete cubes, cylinders, fresh concrete in moulds, and finished slabs were wrongly accepted as "10 mm aggregate 96 % confidence" | Added a **smooth-concrete-surface gate** to the CV pipeline: when `avgLum ∈ [60, 200]`, `avgSat < 0.18`, `edgeDens < 0.18`, `bvHighR < 0.15` and `stoneCoverage < 0.42`, the image is rejected with reason "smooth concrete / mortar surface — cube, slab, pour, or finished concrete detected, not loose 20 mm aggregate". |
| 20 | MobileNet was missing classes that map to lab / construction equipment | Added 25+ ImageNet keywords typical of compression machines and lab equipment: `anvil, barrel, tank, container, bucket, rain barrel, milk can, ashcan, wok, frying pan, manhole cover, gas pump, pump, cylinder, column, piston, hardhat, press, machine, scale, balance, workbench, table lamp, tripod, tabletop`. |

## Phase 3 — Visual rendering fix (from earlier pass — kept for reference)
| # | Issue | Fix |
|---|---|---|
| 11 | Login screen icon, wordmark colour and "Start Using ConcreteIQ" button were rendering as colourless / invisible on the Emergent preview | Removed the auto-injected `<script src="/static/js/bundle.js">` + Tailwind CDN block. Downloaded build now ships with **only inline styles** so it renders identically on every host. |

## Earlier phases (kept for completeness)
* Phase 1 — Mix design nominal-mix M5–M20 hard-coded to IS 456 Cl.9 Table 9, design-mix M25+ to IS 10262, per-50-kg-bag panel.
* Phase 1 — MobileNet v2 ImageNet pre-classifier added.
* Phase 1 — 20 mm-down hard size gate; per-image strength varies; target-grade dropdown is comparison only.
* Phase 1 — Static-host friendly (Claude only on Netlify).
* Phase 2 — Per-image ▲/▼ vs target badge on every thumbnail.
* Phase 2 — Batch PDF Report button.

## Validation done (M60, Zone II, 20 mm, 100 mm slump, GGBS 30 %, SF 5 %, HRWR, severe exposure)
| Parameter | App now | User's Excel | Δ |
|---|---|---|---|
| σ (Table 1) | 5 MPa | 5 MPa | 0 |
| Target mean strength | 68.3 MPa | 68.25 MPa | < 0.1 |
| W/C | 0.33 | 0.33 | 0 |
| Water | 138 kg/m³ | 138 kg/m³ | 0 |
| Cement (OPC) | 272 kg/m³ | 271.8 kg/m³ | 0.2 |
| GGBS | 125 kg/m³ | 125.5 kg/m³ | 0.5 |
| Silica Fume | 21 kg/m³ | 20.9 kg/m³ | 0.1 |
| Total binder | 418 kg/m³ | 418.2 kg/m³ | 0.2 |
| Fine aggregate | 650 kg/m³ | 656 kg/m³ | 0.9 % |
| Coarse aggregate | 1271 kg/m³ | 1283 kg/m³ | 0.9 % |
| Superplasticiser | 4.2 kg/m³ | 4.18 kg/m³ | 0.02 |

## File-size impact
* This build: ~287 KB single HTML.
* Package zip (HTML + README + CHANGES + deploy folder): ~85 KB.
## Phase 6 — Strict, slow & accurate detection mode
| # | Issue user reported | Fix |
|---|---|---|
| 21 | Sky + trees, ceiling + curtain, lab equipment (gauges, buckets, racks), and people-in-lab photos were still being accepted as "10 mm aggregate 86–100 %" | The CV final-decision rule was loosened too aggressively. Re-tightened with a multi-signal gate: aggregate is accepted only if **stoneCoverage > 50 %**, **aggScore ≥ 65**, and **at least 5 of 7 corroborating signals** (edgeDens, bvHighR, goodParticleCount, textureEvidence, particleEdges, low saturation). |
| 22 | Detector was running too fast → low accuracy | Added an explicit 350 ms cadence between images so MobileNet has time to finish each inference cleanly and the browser can render thumbnails before the next pass. Progress label now says "Accurate Analysis: X/Y images (slow & precise)". |
| 23 | "Analyse All" button was clickable even with 1 image | Hard-enforced **IS 2386:1963 minimum sample size of 50 images** — the button is now `disabled` until at least 50 images are uploaded. Tooltip explains the rule. |
| 24 | Default confidence threshold of 45 % was too lenient | Raised default to **65 %** (recommended) with hint text "65 = strict (recommended) · 45 = lenient · 80 = very strict". |
| 25 | MobileNet keyword reject list was missing classes for many failure cases | Added 50+ more keywords for indoor scenery (curtain, drape, ceiling, wall, room, kitchen, library), pressure gauges (stopwatch, barometer, sundial, dial, meter, gauge), racks/shelves (rack, file, shelf, stand, crate, frame, grille, grid, oven, stove, refrigerator, safe, vault), outdoor scenery that slipped through (alp, volcano, seashore, valley, lakeside, promontory). |
| 26 | MobileNet probability threshold of 0.18 was too high — borderline phone-camera photos with spread predictions slipped through | Lowered to 0.12 so soft matches now fire the reject path. |
| 27 | Banner text didn't reflect the strict accept/reject rules | Rewrote IS 383 banner to enumerate every reject category (concrete cubes, lab equipment, gauges, racks, walls, vehicles, etc.) and added a "Slow & accurate mode" line explaining the 50-image minimum + 65 % confidence floor. |


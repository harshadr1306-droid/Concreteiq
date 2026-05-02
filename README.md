# ConcreteIQ — Single-File Build

A complete IS-code-compliant concrete-quality web app in **one self-contained
HTML file**. Drop on GitHub Pages, Netlify, Cloudflare Pages, S3 — or just
double-click the file to open it locally.

## What's inside this zip
| File | Purpose |
|---|---|
| `concreteiq.html` | The actual application (single static file, ~280 KB). |
| `README.md` | This file. |
| `CHANGES.md` | Detailed changelog of bug-fixes vs the previous build. |
| `deploy/netlify/netlify.toml` | Optional Netlify config — enables Claude-Vision serverless function (free tier). |
| `deploy/netlify/functions/analyse-image.js` | Serverless function for the optional Claude path. |
| `deploy/cloudflare-pages.md` | Notes for Cloudflare Pages deploy. |
| `deploy/github-pages.md` | Notes for GitHub Pages deploy. |

## Quick start
```sh
# Option A — open it directly
open concreteiq.html      # macOS
xdg-open concreteiq.html  # linux
start concreteiq.html     # windows

# Option B — host it on GitHub Pages
mkdir my-site && cd my-site
git init && cp /path/to/concreteiq.html ./index.html
git add . && git commit -m "deploy"
gh repo create --public --source=. --remote=origin --push
gh pages deploy
```

## Features
1. **IS Mix Design Calculator** (M5 → M100)
   - **Nominal mix** (M5–M20): hard-coded IS 456:2000 Cl.9 Table 9 ratios.
   - **Design mix** (M25+): full IS 10262:2019 step-by-step (target mean
     strength → Abrams W/C → Table 2 water → Cl.4.3 absolute volume).
   - **Per 50 kg cement-bag panel** showing site-ready batch quantities.
   - **IS 456:2000 Table 5 durability check** for every exposure class.
2. **AI Aggregate Detector**
   - **MobileNet v2 ImageNet pre-classifier** (lazy-loaded from jsDelivr CDN)
     hard-rejects clothing, plants, animals, vehicles, sky, etc.
   - **Custom multi-pass CV** (Sobel edges, block variance, particle count).
   - **20 mm-down only** — anything 40 mm / >40 mm / boulder is rejected.
   - **Optional Claude Vision** when deployed to Netlify (serverless function
     included).
3. **Per-image strength prediction**
   - Each photo gets its own 28-day MPa from real visual features.
   - Thumbnail badge with **▲/▼ vs target** indicator.
4. **Batch PDF report**
   - One-click button generates a printable HTML report with all images,
     per-image MPa + delta, full mix design, IS-code compliance summary.
   - Browser's "Save as PDF" produces a clean, signable document.
5. **No backend, no build step, no NPM install.**

## Where the logic comes from
| Code clause | Used for |
|---|---|
| **IS 456:2000 Cl.9, Table 9** | Nominal mix ratios M5–M20. |
| **IS 456:2000 Table 5** | Durability — minimum cement, max W/C per exposure. |
| **IS 456:2000 Cl.6.2.3.1** | Elastic modulus Ec = 5000√fck. |
| **IS 10262:2019 Cl.3.1** | Target mean strength = fck + 1.65σ. |
| **IS 10262:2019 Cl.3.2** | Abrams' W/C law (Indian calibration). |
| **IS 10262:2019 Table 2** | Water content per nominal aggregate size. |
| **IS 10262:2019 Table 3** | Fine-aggregate volume fraction by zone. |
| **IS 10262:2019 Cl.4.3** | Absolute-volume method. |
| **IS 383:2016 / IS 2386:1963** | Aggregate size limits, acceptance criteria. |
| **IS 9103, IS 455, IS 15388** | Admixture and SCM limits. |
| **IS 516:1959** | Split tensile / flexural strength relations. |

## License & disclaimer
Provided as-is for educational and field-engineering use. **All predicted
strengths are visual estimates and must be confirmed by laboratory cube
testing per IS 516:1959 before structural use.**

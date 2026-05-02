# Netlify deploy

## 1. Drag-and-drop (simplest)
1. Open https://app.netlify.com/drop
2. Drag the `concreteiq.html` file (renamed to `index.html`) into the drop area.
3. Done — your site is live.

## 2. Git-based deploy with the optional Claude Vision function
If you want to use Anthropic Claude Vision (slightly more accurate detection
than the offline MobileNet+CV path), follow these steps:

1. Create a Netlify site and connect it to your Git repository.
2. Copy `concreteiq.html` to your repo root (rename to `index.html`).
3. Copy `deploy/netlify/netlify.toml` to your repo root.
4. Copy `deploy/netlify/functions/analyse-image.js` to `netlify/functions/analyse-image.js` in your repo.
5. In Netlify dashboard → Site settings → Environment variables, add:
   - `ANTHROPIC_API_KEY` = your Anthropic API key.
6. Deploy.

When the page is loaded from a `*.netlify.app` (or your custom domain) the
detector will call `/api/analyse-image` first, then fall back to the offline
CV pipeline if anything fails.

# Cloudflare Pages deploy

## 1. Direct upload (simplest)
1. Go to <https://dash.cloudflare.com/?to=/:account/pages/new/upload>
2. Project name → e.g. `concreteiq`.
3. Drag the `concreteiq.html` file (renamed to `index.html`) into the upload area.
4. Click **Deploy site**.

Your app is live at `https://<project>.pages.dev` in seconds.

## 2. Git-based deploy
1. Push `concreteiq.html` (renamed to `index.html`) to a Git repository.
2. In Cloudflare Pages → **Create a project** → **Connect to Git**.
3. Build command: *leave empty*  
   Build output directory: `/`
4. Save and deploy.

> **Note:** Cloudflare Pages serves static assets only — the optional Claude
> Vision path is automatically skipped. Detection runs entirely client-side
> via MobileNet + the built-in CV engine, so no API key is needed.
>
> If you want Claude Vision on Cloudflare you can adapt
> `deploy/netlify/functions/analyse-image.js` to a Cloudflare Pages Function
> at `functions/api/analyse-image.js` (the platform's Workers runtime supports
> the `fetch` API used by the function as-is).

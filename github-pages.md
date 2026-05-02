# GitHub Pages deploy

```sh
# 1. New repo with the html as index.html
mkdir concreteiq && cd concreteiq
cp /path/to/concreteiq.html index.html
git init
git add .
git commit -m "Initial concreteiq deploy"

# 2. Create a public repo on GitHub and push
gh repo create concreteiq --public --source=. --push

# 3. Enable Pages
gh api -X POST "repos/$(gh api user --jq .login)/concreteiq/pages" \
  -f "source[branch]=main" -f "source[path]=/"
```

Or in the web UI: Settings → Pages → Source = `main` branch / root.

After 1–2 minutes the site will be live at:
`https://<your-github-username>.github.io/concreteiq/`

> **Note:** GitHub Pages serves static files only — the optional Claude Vision
> path will be skipped automatically. The detector falls back to the built-in
> MobileNet + custom CV engine, which works fully offline after the first load.

# Render Cost Calculator

A small web app to estimate render costs based on:

- **Rendertime per frame** (minutes)
- **Number of frames**
- **OctaneBench score** (Otoy Octane render benchmark)

Formula: `Rendertime (min) × Frames × (factor / OctaneBench)`. The **factor** (default `95.768752`) is configurable in the app.

You can add multiple entries and see a grand total.

## Run locally

Open `index.html` in a browser, or use a local server. With Python:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500/index.html`.

On Windows you can use `open-in-browser.bat` to start the server and open the app.

## Deploy on GitHub Pages

1. Push this repo to GitHub (e.g. branch `main`).
2. Go to **Settings → Pages**.
3. Under **Source**, choose **Deploy from a branch**.
4. Select branch (e.g. `main`) and folder **/ (root)**.
5. Save. The site will be available at `https://<username>.github.io/<repo>/`.

No build step; the site is served as static files from the repo root.

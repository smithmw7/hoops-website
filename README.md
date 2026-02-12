# Hightop Games Website

Website for hightopgames.com and Hightop Games LLC.

## Structure

```
hoops-website/
├── docs/           # Site content (deployed to GitHub Pages)
│   ├── assets/
│   ├── reword/     # Reword game landing
│   ├── index.html
│   └── ...
└── README.md
```

## Deployment (GitHub Pages)

1. **Settings → Pages** in the repo
2. **Source:** Deploy from a branch
3. **Branch:** `main` / **Folder:** `/docs`
4. Push to `main` to publish

The site is served from the `docs/` folder so the repo root stays clean for config, tooling, and future build setup.

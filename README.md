# Hightop Games website

The source for [hightopgames.com](https://hightopgames.com), built with React, TypeScript, and Vite and hosted on GitHub Pages.

## Local development

```bash
npm install
npm run dev
```

The local server defaults to `http://localhost:5173`.

## Verification

```bash
npm run check
npm run build
npm run preview
```

`npm run build` type-checks the React app, generates `dist/`, creates direct-load HTML entrypoints for each marketing route, and copies the preserved game builds, legal pages, domain file, and ad-verification files into the deployment artifact.

The separate Gameplay repository exports its deploy-only build into this
checkout's `gameplay/` directory. From that repository, run
`npm run export:hightop`; this site's normal build then preserves the copy at
`https://hightopgames.com/gameplay/` without merging either source tree.

Motion is deliberately separate from the static design layer. Once the visual system is approved, use GSAP for animation where motion materially improves hierarchy, feedback, or storytelling.

See [docs/architecture.md](docs/architecture.md) for the project layout and [docs/deployment.md](docs/deployment.md) before changing GitHub Pages settings or publishing.

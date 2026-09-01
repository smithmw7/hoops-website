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

Motion is deliberately separate from the static design layer. Once the visual system is approved, use GSAP for animation where motion materially improves hierarchy, feedback, or storytelling.

See [docs/architecture.md](docs/architecture.md) for the project layout and [docs/deployment.md](docs/deployment.md) before changing GitHub Pages settings or publishing.

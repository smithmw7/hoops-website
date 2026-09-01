# Website architecture

## Source of truth

- `web/src/App.tsx` selects the homepage, game marketing pages, or support experience from the current route.
- `web/src/components/` contains shared site and game-page components.
- `web/src/data/games.ts` is the single source of truth for game names, statuses, copy, colors, icons, and external calls to action.
- `web/src/styles/global.css` contains the shared responsive design system.
- `scripts/copy-static.mjs` assembles preserved static content into the final build.

## Preserved static routes

The existing Poker Draw, Skate Burger, and playable builds are versioned output rather than React source. They remain in their current root folders and are copied into `dist/` after Vite builds.

The existing Aces and Daily Reword privacy and terms pages are also preserved without rewriting. Their original asset folders are copied alongside the new marketing pages.

## Motion policy

The initial redesign is intentionally static. Do not add React Bits, animation libraries, or decorative motion until the static visual design is approved. For later motion work, prefer GSAP and include reduced-motion behavior.

## Transitional root files

The original root HTML remains temporarily because GitHub Pages is currently configured for legacy publishing from the root of `main`. It is not the source for the redesigned React site. After GitHub Pages is switched to **GitHub Actions** and the new workflow is deployed successfully, the obsolete root marketing HTML can be removed in a separate cleanup.

## Completion conditions

A website change is ready when:

1. `npm run check` passes.
2. `npm run build` passes.
3. The homepage, all four game pages, support, legal pages, and preserved game routes return successfully from `dist/`.
4. Desktop and mobile layouts have been visually checked.

# GitHub Pages deployment

The site continues to use the existing `hightopgames.com` GitHub Pages project and DNS configuration.

## One-time publishing-source change

The repository is currently configured for legacy GitHub Pages publishing from the root of `main`. The React/Vite project requires the repository's Pages source to be changed once:

1. Open the repository's **Settings → Pages** screen.
2. Under **Build and deployment**, change **Source** to **GitHub Actions**.
3. Run the **Deploy website to GitHub Pages** workflow, or push an approved commit to `main`.
4. Confirm the workflow's build and deploy jobs both pass.

Do not remove or change the custom domain. `CNAME` is included in every build artifact, and the React entry document plus generated route entrypoints use `https://hightopgames.com` for canonical URLs.

## Normal release flow

1. When publishing Gameplay, run `npm run export:hightop` from its repository.
   The command builds with `/gameplay/` as the public base and replaces only
   this checkout's committed `gameplay/` copy.
2. Run `npm ci`.
3. Run `npm run check` and `npm run build`.
4. Preview `dist/` with `npm run preview` and verify the required routes,
   including `/gameplay/` when its copy changed.
5. Merge the approved change to `main`.
6. Confirm the GitHub Pages workflow succeeds and check the live custom domain.

## Rollback

GitHub Pages deployments are attached to workflow runs. Re-run the last known-good commit's workflow or revert the website commit on `main`, then verify the custom domain after deployment.

import { cp, mkdir, copyFile, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');

const trees = [
  ['assets', 'assets'],
  ['playables', 'playables'],
  ['pokerdraw', 'pokerdraw'],
  ['skateburger', 'skateburger'],
  ['aces/assets', 'aces/assets'],
  ['reword/Assets', 'reword/Assets'],
];

const files = [
  ['CNAME', 'CNAME'],
  ['app-ads.txt', 'app-ads.txt'],
  ['robots.txt', 'robots.txt'],
  ['aces/privacy.html', 'aces/privacy.html'],
  ['aces/terms.html', 'aces/terms.html'],
  ['reword/privacy.html', 'reword/privacy.html'],
  ['reword/terms.html', 'reword/terms.html'],
];

const routes = [
  ['reword', 'Daily Reword — Hightop Games', 'A calm daily word ritual. Start with one word, use your rack to make the next, and clear every letter to win.'],
  ['aces', 'Aces — Hightop Games', 'A smart card merge puzzle where every move matters. Place cards, trigger combos, and collect all four Aces.'],
  ['cardkings', 'Card Kings — Hightop Games', 'A royal puzzle adventure where every card merge helps rebuild the kingdom.'],
  ['corgicafe', 'Corgi Cafe — Hightop Games', 'A cheerful cafe game about serving customers, building a welcoming space, and hanging out with corgis.'],
  ['hoops', 'Hightop Hoops — Hightop Games', 'Arcade basketball shooting, collectible shoes, and the chase for one more perfectly clean shot.'],
  ['support', 'Player Support — Hightop Games', 'Get help with a Hightop Games title or share feedback with the studio.'],
];

const redirects = [
  ['yahoo', '/'],
];

for (const [source, destination] of trees) {
  await cp(join(root, source), join(dist, destination), { recursive: true, force: true });
}

for (const [source, destination] of files) {
  const output = join(dist, destination);
  await mkdir(dirname(output), { recursive: true });
  await copyFile(join(root, source), output);
}

const appShell = await readFile(join(dist, 'index.html'), 'utf8');
for (const [route, title, description] of routes) {
  const canonical = `https://hightopgames.com/${route}/`;
  const routeHtml = appShell
    .replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
    .replace(/<meta name="description" content="[^"]*"\s*\/>/, `<meta name="description" content="${description}" />`)
    .replace(/<meta property="og:title" content="[^"]*"\s*\/>/, `<meta property="og:title" content="${title}" />`)
    .replace(/<meta property="og:description" content="[^"]*"\s*\/>/, `<meta property="og:description" content="${description}" />`)
    .replace(/<meta property="og:url" content="[^"]*"\s*\/>/, `<meta property="og:url" content="${canonical}" />`)
    .replace(/<link rel="canonical" href="[^"]*"\s*\/>/, `<link rel="canonical" href="${canonical}" />`);
  const routeDirectory = join(dist, route);
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(join(routeDirectory, 'index.html'), routeHtml);
}

for (const [route, destination] of redirects) {
  const routeDirectory = join(dist, route);
  const redirectHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="refresh" content="0; url=${destination}" />
    <link rel="canonical" href="https://hightopgames.com${destination}" />
    <title>Hightop Games</title>
    <script>window.location.replace(${JSON.stringify(destination)});</script>
  </head>
  <body>
    <p><a href="${destination}">Continue to Hightop Games</a></p>
  </body>
</html>
`;
  await mkdir(routeDirectory, { recursive: true });
  await writeFile(join(routeDirectory, 'index.html'), redirectHtml);
}

console.log(`Created ${routes.length} route entrypoints, ${redirects.length} redirect, and copied ${trees.length} static trees plus ${files.length} preserved files into dist/.`);

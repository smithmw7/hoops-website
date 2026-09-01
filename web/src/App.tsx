import { useEffect } from 'react';
import { getGame } from './data/games';
import { GamePage } from './components/GamePage';
import { HomePage } from './components/HomePage';
import { Layout } from './components/Layout';
import { SupportPage } from './components/SupportPage';

const route = window.location.pathname.replace(/^\/+|\/+$/g, '');

const pageMeta: Record<string, { title: string; description: string }> = {
  '': { title: 'Hightop Games — Games worth one more turn.', description: 'Hightop Games is an independent studio making bold, replayable games for mobile and the web.' },
  support: { title: 'Player Support — Hightop Games', description: 'Get help with a Hightop Games title or share feedback with the studio.' },
};

export default function App() {
  const game = getGame(route);
  const meta = game
    ? { title: `${game.name} — Hightop Games`, description: game.description }
    : pageMeta[route] || { title: 'Page not found — Hightop Games', description: 'The requested page could not be found.' };

  useEffect(() => {
    document.title = meta.title;
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.description);
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://hightopgames.com${window.location.pathname}`);
  }, [meta.description, meta.title]);

  if (route === '') return <HomePage />;
  if (route === 'support') return <SupportPage />;
  if (game) return <GamePage game={game} />;

  return (
    <Layout tone="light">
      <section className="not-found section-pad">
        <div className="site-shell">
          <p className="eyebrow">404</p>
          <h1>That one got away.</h1>
          <a className="button button-dark" href="/">Back to Hightop Games</a>
        </div>
      </section>
    </Layout>
  );
}

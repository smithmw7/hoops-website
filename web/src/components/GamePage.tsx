import type { CSSProperties } from 'react';
import type { Game } from '../data/games';
import { Layout } from './Layout';

export function GamePage({ game }: { game: Game }) {
  const style = { '--game-accent': game.accent, '--game-soft': game.accentSoft } as CSSProperties;

  return (
    <Layout tone="light">
      <section className="game-hero" style={style}>
        <div className="site-shell game-hero-grid">
          <div className="game-hero-copy">
            <a className="back-link" href="/#games">← All games</a>
            <p className="eyebrow">{game.eyebrow} · {game.status}</p>
            <h1>{game.tagline}</h1>
            <p className="game-intro">{game.description}</p>
            <div className="button-row">
              {game.primaryCta && (
                <a className="button button-dark" href={game.primaryCta.href} target={game.primaryCta.external ? '_blank' : undefined} rel={game.primaryCta.external ? 'noopener' : undefined}>
                  {game.primaryCta.label}<span aria-hidden="true">↗</span>
                </a>
              )}
              {game.secondaryCta && (
                <a className="button button-quiet" href={game.secondaryCta.href} target={game.secondaryCta.external ? '_blank' : undefined} rel={game.secondaryCta.external ? 'noopener' : undefined}>
                  {game.secondaryCta.label}<span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </div>
          <div className="game-hero-art" aria-hidden="true">
            <span className="orbit orbit-one" />
            <span className="orbit orbit-two" />
            <img src={game.icon} alt="" width="1024" height="1024" />
          </div>
        </div>
      </section>

      <section className="game-details section-pad">
        <div className="site-shell detail-grid">
          <div>
            <p className="eyebrow">Why it clicks</p>
            <h2>Simple on the surface.<br />Made to stay interesting.</h2>
          </div>
          <ol className="highlight-list">
            {game.highlights.map((highlight, index) => (
              <li key={highlight}><span>0{index + 1}</span><strong>{highlight}</strong></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="next-game" style={style}>
        <div className="site-shell next-game-inner">
          <p>Questions, feedback, or something not behaving?</p>
          <a className="button button-light" href={`/support/?game=${encodeURIComponent(game.name)}`}>Talk to player support<span aria-hidden="true">↗</span></a>
        </div>
      </section>
    </Layout>
  );
}

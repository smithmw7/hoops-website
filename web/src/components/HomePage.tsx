import { useLayoutEffect, useRef, type CSSProperties } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { games, type Game } from '../data/games';
import { Layout } from './Layout';

gsap.registerPlugin(ScrollTrigger);

function taglineLines(text: string) {
  return text.split(/(?<=\.)\s+/).map((line) => (
    <span className="tagline-line" key={line}>{line}</span>
  ));
}

function AppStoreBadge({ href, game }: { href: string; game: string }) {
  return (
    <a className="app-store-link" href={href} target="_blank" rel="noopener" aria-label={`Download ${game} on the App Store`}>
      <img src="/assets/images/app-store-badge.svg" alt="Download on the App Store" />
    </a>
  );
}

function PhoneGallery({ game }: { game: Game }) {
  if (!game.screenshots?.length) return null;

  return (
    <div className="phone-gallery" aria-label={`${game.name} screenshots`}>
      {game.screenshots.map((src, index) => (
        <figure className="phone-shot" key={src}>
          <img src={src} alt={`${game.name} gameplay screenshot ${index + 1}`} loading={index > 1 ? 'lazy' : 'eager'} />
        </figure>
      ))}
    </div>
  );
}

function StoreGameSection({ game }: { game: Game }) {
  const appStore = [game.primaryCta, game.secondaryCta].find((cta) => cta?.href.includes('apps.apple.com'))?.href;

  return (
    <section className={`game-chapter game-chapter-${game.slug}`} id={game.slug}>
      <div className="chapter-shell">
        <header className="chapter-header">
          <div className="chapter-title-row">
            <img className="chapter-icon" src={game.icon} alt="" width="1024" height="1024" />
            <div>
              <p className="chapter-kicker">{game.status}</p>
              <h2>{game.name}</h2>
            </div>
          </div>
          {appStore && <AppStoreBadge href={appStore} game={game.name} />}
        </header>
        <div className="chapter-statement">
          <h3>{taglineLines(game.tagline)}</h3>
          <p>{game.description}</p>
          {game.slug === 'reword' && game.primaryCta && (
            <a className="chapter-text-link" href={game.primaryCta.href} target="_blank" rel="noopener">Play today’s puzzle ↗</a>
          )}
        </div>
        <PhoneGallery game={game} />
      </div>
    </section>
  );
}

function CardKingsSection({ game }: { game: Game }) {
  return (
    <section className="game-chapter game-chapter-cardkings" id="cardkings">
      <div className="card-kings-kingdom">
        <img className="card-kings-kingdom-art" src="/assets/images/card-kings/kingdom.webp" alt="The road to the Card Kings castle" width="1536" height="1024" loading="lazy" />
        <div className="card-kings-copy">
          <p className="chapter-kicker">{game.status}</p>
          <img className="card-kings-logo" src="/assets/images/card-kings/logo.webp" alt="Card Kings" />
          <h2>{taglineLines(game.tagline)}</h2>
          <p>{game.description}</p>
        </div>
      </div>
      <div className="card-kings-key-art" aria-label="Card Kings key art">
        <figure><img src="/assets/images/card-kings/queen.webp" alt="The Queen of Hearts in her throne room" width="1122" height="1402" loading="lazy" /></figure>
        <figure><img src="/assets/images/card-kings/magic-table.webp" alt="Luna, the King, and the inventor discovering a magical card" width="1024" height="1536" loading="lazy" /></figure>
      </div>
      <div className="card-kings-cast" aria-label="Characters from Card Kings">
        <img className="card-kings-rivals" src="/assets/images/card-kings/king-and-rival.webp" alt="The King and his card-playing rival" width="767" height="733" loading="lazy" />
      </div>
    </section>
  );
}

function PreviewGameSection({ game }: { game: Game }) {
  const style = { '--preview-color': game.accent, '--preview-soft': game.accentSoft } as CSSProperties;

  return (
    <section className={`preview-game preview-game-${game.slug}`} id={game.slug} style={style}>
      <div className="preview-copy">
        <p className="chapter-kicker">{game.status}</p>
        {game.wordmark ? (
          <img className="preview-logo" src={game.wordmark} alt={game.name} width="692" height="315" />
        ) : (
          <h2>{game.name}</h2>
        )}
        <h3>{taglineLines(game.tagline)}</h3>
      </div>
      <img src={game.icon} alt={`${game.name} app icon`} width="1024" height="1024" loading="lazy" />
    </section>
  );
}

export function HomePage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const reword = games.find((game) => game.slug === 'reword')!;
  const aces = games.find((game) => game.slug === 'aces')!;
  const cardKings = games.find((game) => game.slug === 'cardkings')!;
  const hoops = games.find((game) => game.slug === 'hoops')!;
  const corgiCafe = games.find((game) => game.slug === 'corgicafe')!;
  const featuredGames = [aces, reword, cardKings, hoops, corgiCafe];

  useLayoutEffect(() => {
    if (!pageRef.current) return;

    const media = gsap.matchMedia();
    const context = gsap.context(() => {
      media.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.timeline({ defaults: { ease: 'power3.out' } })
          .from('.hero-brand-lockup img', { autoAlpha: 0, scale: 0.96, duration: 1.1 })
          .from('.hero-game', { autoAlpha: 0, y: 22, duration: 0.7, stagger: 0.08 }, '-=0.58');

        gsap.to('.hero-brand-mark', {
          y: -6,
          scale: 1.012,
          duration: 3.4,
          delay: 1.1,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
        gsap.fromTo('.hero-logo-glint',
          { backgroundPosition: '180% 0' },
          {
            backgroundPosition: '-80% 0',
            duration: 1.45,
            delay: 2.4,
            ease: 'power1.inOut',
            repeat: -1,
            repeatDelay: 5.2,
          },
        );

        gsap.utils.toArray<HTMLElement>('.game-chapter-aces, .game-chapter-reword').forEach((section) => {
          const header = section.querySelector('.chapter-header');
          const lines = section.querySelectorAll('.tagline-line');
          const supportingCopy = section.querySelectorAll('.chapter-statement > p, .chapter-text-link');
          const screenshots = section.querySelectorAll('.phone-shot');

          gsap.from(header, {
            autoAlpha: 0,
            y: 24,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: header, start: 'top 86%', once: true },
          });
          gsap.from(lines, {
            autoAlpha: 0,
            y: 32,
            duration: 0.85,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: section.querySelector('.chapter-statement'), start: 'top 78%', once: true },
          });
          gsap.from(supportingCopy, {
            autoAlpha: 0,
            y: 18,
            duration: 0.65,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: { trigger: section.querySelector('.chapter-statement'), start: 'top 68%', once: true },
          });
          gsap.from(screenshots, {
            autoAlpha: 0,
            y: 34,
            duration: 0.85,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: section.querySelector('.phone-gallery'), start: 'top 82%', once: true },
          });
        });

        gsap.from('.card-kings-copy > *', {
          autoAlpha: 0,
          y: 26,
          duration: 0.8,
          stagger: 0.09,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.card-kings-copy', start: 'top 76%', once: true },
        });
        gsap.fromTo('.card-kings-kingdom-art', {
          yPercent: -2.5,
          scale: 1.02,
        }, {
          yPercent: 5,
          scale: 1.055,
          ease: 'none',
          scrollTrigger: { trigger: '.card-kings-kingdom', start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        });
        gsap.from('.card-kings-key-art figure', {
          autoAlpha: 0,
          y: 36,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.card-kings-key-art', start: 'top 80%', once: true },
        });
        gsap.from('.card-kings-rivals', {
          autoAlpha: 0,
          scale: 0.97,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.card-kings-cast', start: 'top 72%', once: true },
        });

        gsap.utils.toArray<HTMLElement>('.preview-game').forEach((section) => {
          const copy = section.querySelectorAll('.preview-copy > *');
          const icon = section.querySelector(':scope > img');

          gsap.from(copy, {
            autoAlpha: 0,
            y: 26,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 72%', once: true },
          });
          gsap.from(icon, {
            autoAlpha: 0,
            y: 38,
            scale: 0.97,
            duration: 0.95,
            ease: 'power3.out',
            scrollTrigger: { trigger: section, start: 'top 70%', once: true },
          });
          gsap.to(icon, {
            yPercent: -4,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.25 },
          });
        });

        gsap.from('.studio-signoff > *', {
          autoAlpha: 0,
          y: 20,
          duration: 0.75,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.studio-signoff', start: 'top 82%', once: true },
        });
      });
    }, pageRef);

    let cancelled = false;
    void document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      media.revert();
      context.revert();
    };
  }, []);

  return (
    <Layout showBrand={false}>
      <div ref={pageRef}>
        <section className="home-hero" aria-labelledby="home-title">
          <div className="hero-content">
            <h1 className="visually-hidden" id="home-title">Hightop Games</h1>
            <div className="hero-brand-lockup">
              <div className="hero-brand-mark">
                <img src="/assets/images/LogoHightopGames.png" alt="Hightop Games" width="813" height="350" />
                <span className="hero-logo-glint" aria-hidden="true" />
              </div>
            </div>
            <div className="hero-games" aria-label="Featured Hightop Games titles">
              {featuredGames.map((game) => (
                <a className={`hero-game hero-game-${game.slug}`} href={`#${game.slug}`} aria-label={game.name} key={game.slug}>
                  <span className="hero-icon-shell">
                    <img src={game.icon} alt="" width="1024" height="1024" />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <div id="games">
          <StoreGameSection game={aces} />
          <StoreGameSection game={reword} />
          <CardKingsSection game={cardKings} />
          <PreviewGameSection game={hoops} />
          <PreviewGameSection game={corgiCafe} />
        </div>

        <section className="studio-signoff" id="studio">
          <p>Hightop Games · California</p>
          <a href="mailto:marshall@hightopgames.com">marshall@hightopgames.com ↗</a>
        </section>
      </div>
    </Layout>
  );
}

import { useRef } from 'react';

const mediaPath = '/assets/images/colorrise';
const screenshots = [
  ['01-gradient-in-motion', 'Arrange warm shades into a smooth gradient'],
  ['02-perfect-finish', 'A perfect three-star finish'],
  ['03-puzzle-collection', 'Explore the Color Rise puzzle collection'],
  ['04-advanced-puzzle', 'Connect the colors in a more advanced puzzle'],
  ['05-player-progress', 'Track your stars and puzzle progress'],
  ['06-how-to-play', 'Learn how to connect matching color stacks'],
];

export function ColorRiseSection({ standalone = false }: { standalone?: boolean }) {
  const galleryRef = useRef<HTMLDivElement>(null);
  const Heading = standalone ? 'h1' : 'h2';

  function moveGallery(direction: number) {
    const gallery = galleryRef.current;
    if (!gallery) return;
    gallery.scrollBy({
      left: direction * gallery.clientWidth,
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
    });
  }

  return (
    <section className={`game-chapter game-chapter-colorrise${standalone ? ' colorrise-standalone' : ''}`} id="colorrise" aria-labelledby="colorrise-title">
      <div className="chapter-shell">
        <header className="colorrise-header">
          <img className="colorrise-icon" src={`${mediaPath}/app-icon.webp`} alt="" width="768" height="768" />
          <Heading id="colorrise-title"><a href="/colorrise/">Color Rise</a></Heading>
        </header>
        <div className="colorrise-gallery-controls">
          <button type="button" onClick={() => moveGallery(-1)} aria-label="Previous Color Rise previews" aria-controls="colorrise-gallery">←</button>
          <button type="button" onClick={() => moveGallery(1)} aria-label="Next Color Rise previews" aria-controls="colorrise-gallery">→</button>
        </div>
        <div className="phone-gallery colorrise-gallery" id="colorrise-gallery" ref={galleryRef} role="region" aria-label="Color Rise video and App Store screenshots" tabIndex={0}>
          <figure className="phone-shot">
            <video controls playsInline preload="none" poster={`${mediaPath}/gameplay-preview-poster.webp`} width="886" height="1920" aria-label="Play the Color Rise gameplay preview">
              <source src={`${mediaPath}/gameplay-preview.mp4`} type="video/mp4" />
            </video>
          </figure>
          {screenshots.map(([file, description]) => (
            <figure className="phone-shot" key={file}>
              <img src={`${mediaPath}/${file}.webp`} alt={description} loading="lazy" width="660" height="1434" />
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

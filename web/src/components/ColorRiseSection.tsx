const mediaPath = '/assets/images/colorrise/cfg-002';
const screenshots = [
  ['01-gradient-in-motion', 'Connect green, blue, and purple shades in Northern Lights Level 11'],
  ['02-perfect-finish', 'A perfect three-star finish in Northern Lights'],
  ['03-locations', 'Explore Color Rise locations and their colorful gradients'],
  ['05-advanced-puzzle', 'Connect warm shades in Fall Colors Level 8'],
  ['04-puzzle-collection', 'Explore the Northern Lights puzzle collection'],
];

export function ColorRiseSection({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? 'h1' : 'h2';

  return (
    <section className={`game-chapter game-chapter-colorrise${standalone ? ' colorrise-standalone' : ''}`} id="colorrise" aria-labelledby="colorrise-title">
      <div className="chapter-shell">
        <header className="colorrise-header">
          <img className="colorrise-icon" src="/assets/images/colorrise/app-icon.webp" alt="" width="768" height="768" />
          <Heading id="colorrise-title"><a href="/colorrise/">Color Rise</a></Heading>
        </header>
        <div className="phone-gallery colorrise-gallery" id="colorrise-gallery" role="region" aria-label="Color Rise video and App Store screenshots" tabIndex={0}>
          <figure className="phone-shot">
            <video controls playsInline preload="none" poster={`${mediaPath}/northern-lights-preview-poster.webp`} width="886" height="1920" aria-label="Play the Color Rise Northern Lights gameplay preview">
              <source src={`${mediaPath}/northern-lights-preview.mp4`} type="video/mp4" />
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

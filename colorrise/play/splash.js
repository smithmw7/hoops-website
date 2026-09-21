// The launch logo and its cue own startup. Nothing in the game can delay them.
(() => {
  const splash = document.querySelector('#splash');
  const play = document.querySelector('#splashPlay');
  const audio = window.GameAudio;
  let started = false, starting = false;
  play.setAttribute('aria-busy', 'true');
  const fonts = Promise.all([
    document.fonts.load('400 72px Montserrat'),
    document.fonts.load('700 96px Montserrat')
  ]);

  function loadGame() {
    audio.warm();
    const scripts = [...document.querySelectorAll('script[data-game-src]')];
    Promise.all(scripts.map(entry => new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = false;
      script.src = entry.dataset.gameSrc;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Could not load ${script.src}`));
      document.body.append(script);
    }))).then(() => {
      play.removeAttribute('aria-busy');
      play.setAttribute('aria-label', 'Play');
    }).catch(error => console.error('Game startup failed:', error));
  }

  async function start() {
    if (started || starting || document.hidden) return;
    starting = true;
    try {
      await fonts;
      if (!await audio.startSplash()) return;
      started = true;
      requestAnimationFrame(() => {
        splash.classList.remove('splash-pending');
        // Give the entire logo burst its own rendering window before loading the game.
        setTimeout(loadGame, 800);
      });
    } catch (error) {
      console.error('Splash startup failed:', error);
      play.setAttribute('aria-label', 'Retry sound');
    } finally { starting = false; }
  }

  // Web browsers may require a gesture. That gesture starts both sound and logo.
  splash.addEventListener('pointerdown', start);
  splash.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') start(); });
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
  window.addEventListener('color-stack-active', start);
  start();
})();

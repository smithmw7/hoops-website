import { useState, type ReactNode } from 'react';

type LayoutProps = {
  children: ReactNode;
  tone?: 'dark' | 'light';
  showBrand?: boolean;
};

export function Layout({ children, tone = 'dark', showBrand = true }: LayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className={`site-header site-header-${tone}`} data-menu-open={menuOpen}>
        <div className={`site-shell header-inner${showBrand ? '' : ' header-inner-brandless'}`}>
          {showBrand && (
            <a className="brand" href="/" aria-label="Hightop Games home">
              <img src="/assets/images/LogoHightopGames.png" alt="Hightop Games" width="813" height="350" />
            </a>
          )}
          <button
            className="menu-button"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span /><span />
          </button>
          <nav className="site-nav" aria-label="Main navigation">
            <a href="/#games">Games</a>
            <a href="/#studio">Studio</a>
            <a href="/support/">Support</a>
          </nav>
        </div>
      </header>
      <main id="main">{children}</main>
      <footer className="site-footer">
        <div className="site-shell footer-top">
          <img src="/assets/images/LogoHightopGames.png" alt="Hightop Games" width="813" height="350" />
          <nav aria-label="Footer navigation">
            <a href="/#games">Games</a>
            <a href="/support/">Support</a>
            <a href="mailto:marshall@hightopgames.com">Contact</a>
          </nav>
        </div>
        <div className="site-shell footer-bottom">
          <p>© {new Date().getFullYear()} Hightop Games LLC</p>
          <div><a href="/aces/privacy.html">Privacy</a><a href="/aces/terms.html">Terms</a></div>
        </div>
      </footer>
    </>
  );
}

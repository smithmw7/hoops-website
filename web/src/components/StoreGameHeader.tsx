type StoreGameHeaderProps = {
  name: string;
  icon: string;
  titleId: string;
  heading?: 'h1' | 'h2';
  titleHref?: string;
  appStoreUrl?: string;
};

export function StoreGameHeader({ name, icon, titleId, heading: Heading = 'h2', titleHref, appStoreUrl }: StoreGameHeaderProps) {
  return (
    <header className="chapter-header">
      <img className="chapter-icon" src={icon} alt="" width="1024" height="1024" />
      <div className="chapter-heading">
        <Heading className="chapter-name" id={titleId}>
          {titleHref ? <a href={titleHref}>{name}</a> : name}
        </Heading>
        {appStoreUrl && (
          <a className="app-store-link" href={appStoreUrl} target="_blank" rel="noopener" aria-label={`Download ${name} on the App Store`}>
            <img src="/assets/images/app-store-badge.svg" alt="Download on the App Store" />
          </a>
        )}
      </div>
    </header>
  );
}

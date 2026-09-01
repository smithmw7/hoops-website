export type Game = {
  slug: 'reword' | 'aces' | 'cardkings' | 'corgicafe' | 'hoops';
  name: string;
  shortName: string;
  eyebrow: string;
  tagline: string;
  description: string;
  status: 'Play now' | 'Available now' | 'In development';
  icon: string;
  wordmark?: string;
  accent: string;
  accentSoft: string;
  href: string;
  primaryCta?: { label: string; href: string; external?: boolean };
  secondaryCta?: { label: string; href: string; external?: boolean };
  screenshots?: string[];
  highlights: string[];
};

export const games: Game[] = [
  {
    slug: 'reword',
    name: 'Daily Reword',
    shortName: 'Reword',
    eyebrow: 'Daily word puzzle',
    tagline: 'A calm daily ritual.',
    description: 'Start with a five-letter word. Use your rack to make the next one. Clear every letter to win.',
    status: 'Play now',
    icon: '/assets/images/DailyRewordIcon.png',
    accent: '#4264e8',
    accentSoft: '#dfe6ff',
    href: '/reword/',
    primaryCta: { label: 'Play today’s puzzle', href: 'https://dailyreword.com/', external: true },
    secondaryCta: {
      label: 'Download on the App Store',
      href: 'https://apps.apple.com/us/app/daily-reword/id6756642733',
      external: true,
    },
    screenshots: ['/assets/images/reword/01.webp', '/assets/images/reword/02.webp', '/assets/images/reword/03.webp', '/assets/images/reword/04.webp'],
    highlights: ['One new challenge daily', 'Fast, thoughtful play', 'Made for your daily ritual'],
  },
  {
    slug: 'aces',
    name: 'Aces',
    shortName: 'Aces',
    eyebrow: 'Card merge puzzle',
    tagline: 'Every move matters.',
    description: 'Place cards. Discover patterns. Trigger combos. Collect all four Aces.',
    status: 'Available now',
    icon: '/assets/images/AcesIcon.png',
    accent: '#ed5c3b',
    accentSoft: '#ffe1d7',
    href: '/aces/',
    primaryCta: {
      label: 'Download on the App Store',
      href: 'https://apps.apple.com/us/app/aces-official-card-puzzle/id6759623356',
      external: true,
    },
    screenshots: ['/assets/images/aces/01.webp', '/assets/images/aces/02.webp', '/assets/images/aces/03.webp', '/assets/images/aces/04.webp'],
    highlights: ['Tactile card merging', 'Quick to learn', 'Strategy that keeps unfolding'],
  },
  {
    slug: 'cardkings',
    name: 'Card Kings',
    shortName: 'Card Kings',
    eyebrow: 'Royal merge puzzle',
    tagline: 'Merge cards. Rebuild a kingdom.',
    description: 'A royal puzzle adventure where every merge restores the realm.',
    status: 'In development',
    icon: '/assets/images/card-kings/logo.webp',
    accent: '#d89b22',
    accentSoft: '#edf6ff',
    href: '/#cardkings',
    highlights: ['Merge toward the Aces', 'Restore a royal world', 'Meet a colorful kingdom'],
  },
  {
    slug: 'corgicafe',
    name: 'Corgi Cafe',
    shortName: 'Corgi Cafe',
    eyebrow: 'Cozy cafe game',
    tagline: 'Good coffee. Great company.',
    description: 'A cheerful cafe game about serving customers, building a welcoming space, and hanging out with corgis.',
    status: 'In development',
    icon: '/assets/images/CorgiCafeIcon.png',
    accent: '#d66d28',
    accentSoft: '#ffe2a3',
    href: '/corgicafe/',
    highlights: ['A cozy, no-fail rhythm', 'Simple cafe crafting', 'Corgis, naturally'],
  },
  {
    slug: 'hoops',
    name: 'Hightop Hoops',
    shortName: 'Hoops',
    eyebrow: 'Arcade basketball',
    tagline: 'Arcade Basketball. Ultimate Sneaker Collection.',
    description: 'Arcade basketball shooting, collectible shoes, and the chase for one more perfectly clean shot.',
    status: 'In development',
    icon: '/assets/images/HightopHoopsIcon.png',
    wordmark: '/assets/images/LogoHightopHoops.png',
    accent: '#f27a20',
    accentSoft: '#ffe4c8',
    href: '/hoops/',
    highlights: ['Pick-up-and-play shooting', 'Shoes with real personality', 'Built for one-more-run energy'],
  },
];

export function getGame(slug: string) {
  return games.find((game) => game.slug === slug);
}

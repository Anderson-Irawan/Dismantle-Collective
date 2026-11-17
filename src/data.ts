import artwork from './assets/img/artwork-placeholder.webp';
import crowd from './assets/img/event-crowd.webp';
import lasers from './assets/img/happening-lasers.webp';
import dj from './assets/img/happening-dj.webp';
import graffiti from './assets/img/happening-graffiti.webp';

export const SITE = {
  name: 'Dismantle Collective',
  email: 'hello@dismantle-collective.com',
  // TODO: replace with the collective's real Instagram profile.
  instagram: 'https://www.instagram.com/',
};

export type Accent = 'red' | 'orange' | 'blue' | 'green';

export interface Artist {
  slug: string;
  name: string;
  category: string;
  image: string;
}

const artistNames = [
  'BOBBY',
  'Bruno Schmidt',
  'C.A.R',
  'Fits Wentink',
  'Luca Lozano',
  'Malin Genie',
  'R.E.D',
  'Sam Bangura',
  'Samuel Deep',
  'Terry Francis',
  'Unai Trotti',
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Artwork is a placeholder until each artist has their own image.
export const artists: Artist[] = artistNames.map((name) => ({
  slug: slugify(name),
  name,
  category: 'Category',
  image: artwork,
}));

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

export const products: Product[] = [
  { id: 'zine-1', name: 'Dismantle-Zine Vol. 1', price: 14.99, image: artwork },
  { id: 'zine-2', name: 'Dismantle-Zine Vol. 2', price: 14.99, image: artwork },
  { id: 'december-hoodie', name: 'December Hoodie', price: 79.99, image: artwork },
  { id: 'jazz-club-cap', name: 'Jazz Club Cap', price: 23.99, image: artwork },
  { id: 'jazz-club-beanie', name: 'Jazz Club Beanie', price: 29.99, image: artwork },
  { id: 'crew-shirt', name: 'Crew Shirt', price: 44.99, image: artwork },
];

export const formatPrice = (n: number) => `$${n.toFixed(2)}`;

export interface DismantleEvent {
  id: string;
  title: string[]; // one entry per line
  date: string; // ISO date
  lineup?: string[];
  ticketUrl: string;
  image: string;
  accent: Accent;
}

export const events: DismantleEvent[] = [
  {
    id: 'dismantle-x-amity',
    title: ['DISMANTLE', 'X AMITY'],
    date: '2026-11-21',
    lineup: ['FRITS WENTINK', 'MALIN GENIE', 'R.E.D'],
    ticketUrl: '#',
    image: crowd,
    accent: 'green',
  },
  { id: 'event-2', title: ['EVENT', '#2'], date: '2026-12-20', ticketUrl: '#', image: crowd, accent: 'orange' },
  { id: 'event-3', title: ['EVENT', '#3'], date: '2026-01-07' /* as in the design; probably meant 2027 */, ticketUrl: '#', image: crowd, accent: 'blue' },
];

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

export interface Happening {
  id: string;
  title: string[];
  image: string;
  accent: Accent;
  href: string;
}

export const happenings: Happening[] = [
  { id: 'maline-genie', title: ['MALINE GENIE', 'UNLEASHES NEW SET'], image: lasers, accent: 'orange', href: '#' },
  { id: 'news-2', title: ['NEWS #2'], image: dj, accent: 'green', href: '#' },
  { id: 'news-3', title: ['NEWS #3'], image: graffiti, accent: 'blue', href: '#' },
];

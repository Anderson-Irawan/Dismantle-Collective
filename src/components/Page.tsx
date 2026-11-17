import { useEffect, type ReactNode } from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';

interface PageProps {
  title?: string;
  theme: 'dark' | 'red' | 'orange' | 'blue' | 'green';
  children: ReactNode;
}

export function Page({ title, theme, children }: PageProps) {
  useEffect(() => {
    document.title = title ? `${title} — Dismantle Collective` : 'Dismantle Collective';
  }, [title]);

  const isHome = theme === 'dark';
  return (
    <div className={`page theme-${theme}`}>
      <Nav variant={isHome ? 'blocks' : 'plain'} />
      <main className="page__main">{children}</main>
      <Footer tone={isHome ? 'cream' : 'grey'} />
    </div>
  );
}

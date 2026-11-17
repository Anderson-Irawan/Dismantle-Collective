import { NavLink } from 'react-router-dom';
import { LogoMark } from './Icons';

const left = [
  { to: '/artists', label: 'Artists', accent: 'red' },
  { to: '/about', label: 'About', accent: 'blue' },
];
const right = [
  { to: '/shop', label: 'Shop', accent: 'orange' },
  { to: '/schedule', label: 'Schedule', accent: 'green' },
];

/**
 * `blocks` = the home page variant: colour-filled mono buttons.
 * Default = plain uppercase links on the page's colour.
 */
export function Nav({ variant = 'plain' }: { variant?: 'plain' | 'blocks' }) {
  const link = (l: (typeof left)[number], align: 'start' | 'end') => (
    <NavLink key={l.to} to={l.to} className={`nav__link nav__link--${l.accent} nav__link--${align}`}>
      {l.label}
    </NavLink>
  );

  return (
    <header className={`nav nav--${variant}`}>
      <nav className="nav__inner" aria-label="Main">
        <div className="nav__group">{left.map((l) => link(l, 'start'))}</div>
        <NavLink to="/" className="nav__home" end>
          <LogoMark />
        </NavLink>
        <div className="nav__group nav__group--right">{right.map((l) => link(l, 'end'))}</div>
      </nav>
    </header>
  );
}

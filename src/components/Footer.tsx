import { Link } from 'react-router-dom';
import { LogoType } from './Icons';

const site = [
  { to: '/artists', label: 'Artists' },
  { to: '/about', label: 'About' },
  { to: '/shop', label: 'Shop' },
  { to: '/schedule', label: 'Schedule' },
];

// Legal pages are not designed yet.
const legal = ['Terms & Conditions', 'Privacy Policy', 'Cookie Policy', 'Legal Guarantee'];

export function Footer({ tone = 'grey' }: { tone?: 'grey' | 'cream' }) {
  return (
    <footer className={`footer footer--${tone}`}>
      <Link to="/" className="footer__logo">
        <LogoType />
      </Link>
      <div className="footer__links">
        <ul className="footer__col footer__col--site">
          {site.map((l) => (
            <li key={l.to}>
              <Link to={l.to}>{l.label}</Link>
            </li>
          ))}
        </ul>
        <ul className="footer__col">
          {legal.map((l) => (
            <li key={l}>
              <a href="#">{l}</a>
            </li>
          ))}
        </ul>
      </div>
      <p className="footer__copy">Copyright © 2026 Dismantle Collective. All rights reserved.</p>
    </footer>
  );
}

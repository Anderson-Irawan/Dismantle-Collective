import type { CSSProperties } from 'react';
import logoUrl from '../assets/logo/logo.svg';
import markUrl from '../assets/logo/mark.svg';
import typeUrl from '../assets/logo/type.svg';
import instagramUrl from '../assets/icons/instagram.svg';
import emailUrl from '../assets/icons/email.svg';

/**
 * Renders an SVG asset as a CSS mask so it can be tinted with `currentColor`
 * (the logo is white on the home page and black everywhere else).
 */
function MaskedSvg({ src, className, label }: { src: string; className: string; label?: string }) {
  const style = { '--mask': `url("${src}")` } as CSSProperties;
  return (
    <span
      className={`masked ${className}`}
      style={style}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}

export const Logo = ({ className = '' }: { className?: string }) => (
  <MaskedSvg src={logoUrl} className={`logo-full ${className}`} label="Dismantle" />
);
export const LogoMark = ({ className = '' }: { className?: string }) => (
  <MaskedSvg src={markUrl} className={`logo-mark ${className}`} label="Dismantle Collective home" />
);
export const LogoType = ({ className = '' }: { className?: string }) => (
  <MaskedSvg src={typeUrl} className={`logo-type ${className}`} label="Dismantle" />
);
export const InstagramIcon = ({ className = '' }: { className?: string }) => (
  <MaskedSvg src={instagramUrl} className={`icon icon-instagram ${className}`} />
);
export const EmailIcon = ({ className = '' }: { className?: string }) => (
  <MaskedSvg src={emailUrl} className={`icon icon-email ${className}`} />
);

export const ArrowUpRight = ({ className = '' }: { className?: string }) => (
  <svg className={`arrow ${className}`} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <path d="M4 12 12 4M5.5 4H12v6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

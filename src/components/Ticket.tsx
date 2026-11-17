import type { DismantleEvent } from '../data';
import { SITE, formatDate } from '../data';
import { ArrowUpRight, InstagramIcon } from './Icons';

interface TicketProps {
  event: DismantleEvent;
  /** featured = wide ticket with lineup + Instagram; compact = small home ticket; dark = schedule page */
  variant: 'featured' | 'compact' | 'dark';
}

export function Ticket({ event, variant }: TicketProps) {
  const showExtras = variant !== 'compact';
  return (
    <article className={`ticket ticket--${variant} accent-${event.accent}`}>
      <div className="ticket__main" style={{ backgroundImage: `url(${event.image})` }}>
        <time className="ticket__date" dateTime={event.date}>
          {formatDate(event.date)}
        </time>
        <h3 className="ticket__title">
          {event.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h3>
        {variant === 'featured' && event.lineup && (
          <p className="ticket__lineup">{event.lineup.join(' | ')}</p>
        )}
      </div>
      <div className="ticket__stub">
        <a className="ticket__cta" href={event.ticketUrl}>
          Get
          <br />
          Tickets!
          <ArrowUpRight className="ticket__arrow" />
        </a>
        {showExtras && (
          <a className="ticket__ig" href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
            <InstagramIcon />
          </a>
        )}
      </div>
      <span className="ticket__notch ticket__notch--top" aria-hidden="true" />
      <span className="ticket__notch ticket__notch--bottom" aria-hidden="true" />
    </article>
  );
}

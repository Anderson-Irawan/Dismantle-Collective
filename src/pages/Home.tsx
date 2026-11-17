import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Page } from '../components/Page';
import { Ticket } from '../components/Ticket';
import { ArrowUpRight, EmailIcon, InstagramIcon, Logo } from '../components/Icons';
import { SITE, artists, events, happenings } from '../data';

export default function Home() {
  const [featured, ...rest] = events;
  const [active, setActive] = useState(1); // design shows the second artist highlighted
  const activeArtist = artists[active];

  return (
    <Page theme="dark">
      {/* Hero */}
      <section className="hero">
        <h1 className="hero__logo">
          <Logo />
        </h1>
        <div className="hero__row">
          <Link to="/schedule" className="hero-card accent-red">
            <span className="hero-card__label">Upcoming event/news</span>
            <span className="hero-card__title">
              DISMANTLE
              <br />X AMITY
            </span>
            <span className="corner corner--sm">
              <ArrowUpRight />
            </span>
          </Link>
          <div className="hero__social">
            <a href={SITE.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <a href={`mailto:${SITE.email}`} aria-label="Email us">
              <EmailIcon />
            </a>
          </div>
          <Link to="/shop" className="hero-card accent-green">
            <span className="hero-card__label">Upcoming event/news</span>
            <span className="hero-card__title">
              NEW IN
              <br />
              SHOP
            </span>
            <span className="corner corner--sm">
              <ArrowUpRight />
            </span>
          </Link>
        </div>
      </section>

      {/* Recent happenings */}
      <section className="happenings">
        <h2 className="happenings__title">RECENT HAPPENINGS</h2>
        <div className="happenings__grid">
          {happenings.map((h) => (
            <a key={h.id} href={h.href} className={`happening accent-${h.accent}`}>
              <img className="happening__img" src={h.image} alt="" loading="lazy" />
              <span className="corner corner--lg" aria-hidden="true" />
              <h3 className="happening__title">
                {h.title.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </h3>
            </a>
          ))}
        </div>
      </section>

      {/* Representing */}
      <section className="representing">
        <h2 className="representing__title">Representing</h2>
        <div className="representing__body">
          <ul className="representing__list">
            {artists.map((a, i) => (
              <li key={a.slug}>
                <Link
                  to={`/artists#${a.slug}`}
                  className={`representing__name${i === active ? ' is-active' : ''}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                >
                  {a.name}
                </Link>
              </li>
            ))}
          </ul>
          <figure className="representing__art">
            <span className="px px--a" />
            <span className="px px--b" />
            <span className="px px--c" />
            <span className="px px--d" />
            <span className="px px--e" />
            <span className="px px--f" />
            <img key={activeArtist.slug} src={activeArtist.image} alt={`${activeArtist.name} artwork`} />
          </figure>
        </div>
      </section>

      {/* Events */}
      <section className="home-events">
        <Ticket event={featured} variant="featured" />
        <div className="home-events__row">
          {rest.map((e) => (
            <Ticket key={e.id} event={e} variant="compact" />
          ))}
          <Link to="/schedule" className="schedule-card">
            <span className="schedule-card__title">
              FULL
              <br />
              SCHEDULE
            </span>
            <ArrowUpRight className="schedule-card__arrow" />
          </Link>
        </div>
      </section>
    </Page>
  );
}

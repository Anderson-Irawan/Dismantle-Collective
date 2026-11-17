import swirl from '../assets/img/swirl.webp';
import { SITE } from '../data';
import { EmailIcon } from './Icons';

export function ContactBlock({ title = 'Get in Touch' }: { title?: string }) {
  return (
    <section className="contact" style={{ backgroundImage: `url(${swirl})` }}>
      <a className="contact__link" href={`mailto:${SITE.email}`}>
        <EmailIcon className="contact__icon" />
        <h2 className="contact__title">{title}</h2>
        <span className="contact__email">{SITE.email}</span>
      </a>
    </section>
  );
}

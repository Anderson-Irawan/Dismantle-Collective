import { Page } from '../components/Page';
import { ContactBlock } from '../components/ContactBlock';
import { artists } from '../data';

export default function Artists() {
  return (
    <Page title="Artists" theme="red">
      <h1 className="page-title">OUR ARTISTS</h1>
      <div className="card-grid">
        {artists.map((a) => (
          <article key={a.slug} id={a.slug} className="card">
            <div className="card__media">
              <img src={a.image} alt={`${a.name} artwork`} loading="lazy" />
            </div>
            <h2 className="card__title card__title--lg">{a.name}</h2>
            <p className="card__meta">{a.category}</p>
          </article>
        ))}
      </div>
      <ContactBlock />
    </Page>
  );
}

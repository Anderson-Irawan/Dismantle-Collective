import { Page } from '../components/Page';
import { formatPrice, products } from '../data';

export default function Shop() {
  return (
    <Page title="Shop" theme="orange">
      <h1 className="page-title">WHAT’S IN STORE?</h1>
      <div className="card-grid card-grid--shop">
        {products.map((p) => (
          <article key={p.id} className="card">
            <div className="card__media">
              <img src={p.image} alt={p.name} loading="lazy" />
            </div>
            <h2 className="card__title">{p.name}</h2>
            <p className="card__meta card__meta--price">{formatPrice(p.price)}</p>
          </article>
        ))}
      </div>
    </Page>
  );
}

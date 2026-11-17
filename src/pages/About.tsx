import { Page } from '../components/Page';
import { ContactBlock } from '../components/ContactBlock';
import { Logo } from '../components/Icons';

// Placeholder copy from the design — replace with the collective's story.
const paragraphs = [
  'Lorem ipsum dolor sit amet consectetur adipiscing elit. Est id id est tempor adipiscing et anim qui elit mollit. Harum proident aut cum eum qui qui est. Fugiat quo nam culpa culpa quibusdam sed dolores placeat harum consequat.',
  'Amet occaecat duis in soluta eligendi. Sed occaecat cupidatat minim fuga fugiat minus culpa ex. Voluptatum autem autem eum nulla aliquip dolorum est praesentium imperdiet. Deserunt ut et excepteur in consectetur laborum omnis et voluptas adipiscing.',
  'Do culpa tempor dolor veniam dolor in est placeat nostrud quibusdam repellendus. Quibusdam eu id proident do facilis excepturi omnis aut. Id magna quibusdam voluptate pariatur aliqua placeat sint nulla soluta et elit nostrud. Veniam dolor ad cum deleniti et commodo quod sint cumque.',
];

export default function About() {
  return (
    <Page title="About" theme="blue">
      <h1 className="page-title page-title--center">INTRODUCING</h1>
      <div className="about__logo">
        <Logo />
      </div>
      <div className="about__copy">
        {paragraphs.map((p) => (
          <p key={p.slice(0, 20)}>{p}</p>
        ))}
      </div>
      <ContactBlock />
    </Page>
  );
}

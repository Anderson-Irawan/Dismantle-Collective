import { Page } from '../components/Page';
import { ContactBlock } from '../components/ContactBlock';
import { Ticket } from '../components/Ticket';
import { events } from '../data';

export default function Schedule() {
  return (
    <Page title="Schedule" theme="green">
      <h1 className="page-title">UPCOMING EVENTS</h1>
      <div className="schedule-list">
        {events.map((e) => (
          <Ticket key={e.id} event={e} variant="dark" />
        ))}
      </div>
      <ContactBlock title="Let’s Collaborate" />
    </Page>
  );
}

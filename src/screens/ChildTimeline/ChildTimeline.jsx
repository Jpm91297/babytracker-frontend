import { Link, useParams } from 'react-router'
import { Button } from '../../components/Button.jsx'
import { Card } from '../../components/Card.jsx'
import { eventTypeByName, eventTypes } from '../../events/index.js'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useChild } from '../../hooks/useChild.js'
import { useEvents } from '../../hooks/useEvents.js'
import { useSummary } from '../../hooks/useSummary.js'
import { dayLabel, formatBirthDate, formatTime, timeAgo } from '../../utils/time.js'
import styles from './ChildTimeline.module.css'

// Group Events by Day
function groupByDay(events) {

    const days = [];

    for (const event of events) {
        const label = dayLabel(event.startedAt);
        const current = days[days.length - 1];

        if (current?.label === label) current.events.push(event);
        else days.push({ label, events: [event] });
    }

    return days;
};

// Log tile for an event type
function Tile(props) {

    const { eventType, childId, summary } = props;

    const { lastAt, subline } = summary ? eventType.tile(summary) : {};

    return (
        <Link
            to={`/children/${childId}/log/${eventType.name}`}
            className={`${styles.tile} ${styles[eventType.tone]}`}
        >
            <span className={styles.tileLabel}>{eventType.label}</span>
            {summary && (
                <>
                    <span className={styles.tileTime}>
                        {lastAt ? timeAgo(lastAt) : 'Not logged yet'}
                    </span>
                    <span className={styles.tileSubline}>
                        {subline || 'Tap to log'}
                    </span>
                </>
            )}
        </Link>
    );
};

// Timeline row for one event
function EventRow(props) {

    const { event, userId } = props;

    const type = eventTypeByName[event.type];

    if (!type) return null;

    return (
        <li className={styles.event}>
            <span className={`${styles.badge} ${styles[type.tone]}`}>
                {type.label}
            </span>
            <div className={styles.eventBody}>
                <p className={styles.eventSummary}>
                    {type.summarize(event.details)}
                </p>
                <p className={styles.eventMeta}>
                    {formatTime(event.startedAt)} ·{' '}
                    {event.loggedBy.id === userId ? 'You' : event.loggedBy.name}
                </p>
                {event.notes && <p className={styles.eventNotes}>{event.notes}</p>}
            </div>
        </li>
    );
};

function Events(props) {

    const { childId } = props;

    const { user } = useAuth();

    const { events, error, loading, getEvents } = useEvents(childId);

    if (error) {
        return (
            <div className={styles.status}>
                <p className={styles.error} role="alert">
                    {error}
                </p>
                <Button variant="secondary" onClick={getEvents}>
                    Try again
                </Button>
            </div>
        );
    }

    if (loading && !events) return <p className={styles.muted}>Loading…</p>;

    if (events.length === 0) {
        return <p className={styles.muted}>Nothing logged yet.</p>;
    }

    return (
        <>
            {groupByDay(events).map((day) => (
                <section key={day.label} className={styles.day}>
                    <h2 className={styles.dayLabel}>{day.label}</h2>
                    <Card className={styles.events}>
                        <ul className={styles.eventList}>
                            {day.events.map((event) => (
                                <EventRow key={event.id} event={event} userId={user.id} />
                            ))}
                        </ul>
                    </Card>
                </section>
            ))}
        </>
    );
};

export function ChildTimeline() {

    const { id } = useParams();

    const { child, error, notFound, loading, getChild } = useChild(id);

    const { summary, error: summaryError, getSummary } = useSummary(id);

    return (
        <main className={styles.screen}>
            <Link to="/" className={styles.back}>
                ‹ Your children
            </Link>

            {loading && !child && <p className={styles.muted}>Loading…</p>}

            {error && (
                <div className={styles.status}>
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                    {!notFound && (
                        <Button variant="secondary" onClick={getChild}>
                            Try again
                        </Button>
                    )}
                </div>
            )}

            {child && (
                <>
                    <header className={styles.header}>
                        <h1 className={styles.title}>{child.name}</h1>
                        {child.birthDate && (
                            <p className={styles.muted}>
                                {formatBirthDate(child.birthDate)}
                            </p>
                        )}
                    </header>

                    <div className={styles.tiles}>
                        {eventTypes.map((type) => (
                            <Tile
                                key={type.name}
                                eventType={type}
                                childId={id}
                                summary={summary}
                            />
                        ))}
                    </div>

                    {summaryError && (
                        <div className={styles.status}>
                            <p className={styles.error} role="alert">
                                {summaryError}
                            </p>
                            <Button variant="secondary" onClick={getSummary}>
                                Try again
                            </Button>
                        </div>
                    )}

                    <Events childId={id} />
                </>
            )}
        </main>
    );
};

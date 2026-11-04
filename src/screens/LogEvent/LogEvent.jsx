import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router'
import { api, errorMessage } from '../../api/client.js'
import { Button } from '../../components/Button.jsx'
import { eventTypes } from '../../events/index.js'
import { useChild } from '../../hooks/useChild.js'
import { startTimeError } from '../../utils/time.js'
import styles from './LogEvent.module.css'

// Performs Load & Save, Form dynamically rendered
function LogEventForm(props) {

    const { childId, type } = props;

    const navigate = useNavigate();

    const { child, error: childError, notFound, loading, getChild } = useChild(childId);

    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // Returns whether the event was saved
    async function save(values) {

        const { time, notes, details } = values;

        // Validate Event Time
        const timeError = startTimeError(time);

        if (timeError) {
            setError(timeError);
            return false;
        }

        setSubmitting(true);
        setError('');

        try {
            await api.post(`/children/${childId}/events`, {
                type: type.name,
                startedAt: new Date(time).toISOString(),
                details,
                notes,
            });
            navigate(`/children/${childId}`, { replace: true });
            return true;
        } catch (err) {
            setError(errorMessage(err));
            setSubmitting(false);
            return false;
        }
    };

    return (
        <main className={styles.screen}>
            <Link to={`/children/${childId}`} className={styles.back}>
                ‹ {child?.name ?? 'Back'}
            </Link>

            {loading && !child && <p className={styles.muted}>Loading…</p>}

            {childError && (
                <div className={styles.status}>
                    <p className={styles.error} role="alert">
                        {childError}
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
                    <h1 className={styles.title}>Log {type.label.toLowerCase()}</h1>
                    <type.Form
                        childId={childId}
                        error={error}
                        setError={setError}
                        submitting={submitting}
                        onSave={save}
                    />
                </>
            )}
        </main>
    );
};

// Route to Proper Form Based on Event Type
export function LogEvent() {

    const { id, type } = useParams();

    const eventType = eventTypes.find((eventType) => eventType.name === type);

    if (!type) return <Navigate to={`/children/${id}`} replace />;

    return <LogEventForm childId={id} type={eventType} />;
};

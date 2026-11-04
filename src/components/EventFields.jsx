import { useId } from 'react'
import { toLocalInput } from '../utils/time.js'
import { Button } from './Button.jsx'
import { Field } from './Field.jsx'
import styles from './EventFields.module.css'

// Common Components for each form
export function EventFields(props) {

    const { timeLabel, time, onTimeChange, notes, onNotesChange, error, submitting, saveLabel } = props;

    const notesId = useId();

    return (
        <>
            <div className={styles.timeRow}>
                <Field
                    label={timeLabel}
                    type="datetime-local"
                    value={time}
                    onChange={(e) => onTimeChange(e.target.value)}
                />
                <Button
                    variant="secondary"
                    className={styles.now}
                    onClick={() => onTimeChange(toLocalInput(new Date()))}
                >
                    Now
                </Button>
            </div>

            <div className={styles.notes}>
                <label htmlFor={notesId} className={styles.notesLabel}>
                    Notes
                </label>
                <textarea
                    id={notesId}
                    className={styles.notesInput}
                    rows={3}
                    maxLength={500}
                    value={notes}
                    onChange={(e) => onNotesChange(e.target.value)}
                />
            </div>

            {error && (
                <p className={styles.error} role="alert">
                    {error}
                </p>
            )}

            <Button type="submit" disabled={submitting}>
                {submitting ? 'Saving…' : saveLabel}
            </Button>
        </>
    );
};

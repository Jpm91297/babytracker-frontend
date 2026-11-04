import { useState } from 'react'
import { EventFields } from '../components/EventFields.jsx'
import { toLocalInput } from '../utils/time.js'
import styles from './DiaperForm.module.css'

const TYPE_OPTIONS = [
    { value: 'wet', label: 'Wet' },
    { value: 'dirty', label: 'Dirty' },
    { value: 'mixed', label: 'Mixed' },
    { value: 'dry', label: 'Dry' },
];

export function DiaperForm(props) {

    const { error, setError, submitting, onSave } = props;

    const [type, setType] = useState(null);
    const [time, setTime] = useState(() => toLocalInput(new Date()));
    const [notes, setNotes] = useState('');

    async function handleSubmit(e) {

        e.preventDefault();

        if (!type) {
            setError('Choose wet, dirty, mixed or dry');
            return;
        }

        await onSave({ time, notes, details: { type } });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.types} role="radiogroup" >
                {TYPE_OPTIONS.map((option) => (
                    <label key={option.value} className={styles.type}>
                        <input
                            type="radio"
                            name="type"
                            className={styles.typeInput}
                            checked={type === option.value}
                            onChange={() => setType(option.value)}
                        />
                        {option.label}
                    </label>
                ))}
            </div>

            <EventFields
                timeLabel="Time"
                time={time}
                onTimeChange={setTime}
                notes={notes}
                onNotesChange={setNotes}
                error={error}
                submitting={submitting}
                saveLabel="Save diaper"
            />
        </form>
    );
};

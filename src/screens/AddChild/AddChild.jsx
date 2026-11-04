import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { api, errorMessage } from '../../api/client.js'
import { Button } from '../../components/Button.jsx'
import { Field } from '../../components/Field.jsx'
import styles from './AddChild.module.css'

export function AddChild() {

    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {

        e.preventDefault();

        if (!name.trim() || !birthDate) {
            setError('Enter a name and birth date');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await api.post('/children', { name, birthDate });
            navigate('/', { replace: true });
        } catch (err) {
            setError(errorMessage(err));
            setSubmitting(false);
        }
    };


    return (
        <main className={styles.screen}>
            <Link to="/" className={styles.back}>
                ‹ Your children
            </Link>
            <header className={styles.header}>
                <h1 className={styles.title}>Add a child</h1>
                <p className={styles.subtitle}>
                    You'll be the owner, and can invite other caregivers later.
                </p>
            </header>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <Field
                    label="Name"
                    autoComplete="off"
                    maxLength={100}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Field
                    label="Birth date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                />
                {error && (
                    <p className={styles.formError} role="alert">
                        {error}
                    </p>
                )}
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Adding…' : 'Add child'}
                </Button>
            </form>
        </main>
    );
};
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { api, errorMessage } from '../../api/client.js'
import { Button } from '../../components/Button.jsx'
import { Field } from '../../components/Field.jsx'
import styles from './AddChildCode.module.css'

export function AddChildCode() {

    const navigate = useNavigate();
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!code.trim()) {
            setError('Enter your invite code');
            return;
        }
        setSubmitting(true);
        setError('');
        try {
            await api.post('/invites/accept', { code });
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
                <h1 className={styles.title}>Join with an invite code</h1>
                <p className={styles.subtitle}>
                    Ask the child's owner for a code. Codes expire after 48
                    hours and work once.
                </p>
            </header>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <Field
                    label="Invite code"
                    autoComplete="off"
                    autoCapitalize="characters"
                    spellCheck={false}
                    placeholder="K7WM2QXP"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                {error && (
                    <p className={styles.formError} role="alert">
                        {error}
                    </p>
                )}
                <Button type="submit" disabled={submitting}>
                    {submitting ? 'Joining…' : 'Join'}
                </Button>
            </form>
        </main>
    );
};
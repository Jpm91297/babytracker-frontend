import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { errorMessage } from '../../api/client.js'
import { Button } from '../../components/Button.jsx'
import { Field } from '../../components/Field.jsx'
import { ThemeToggle } from '../../components/ThemeToggle.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import styles from './SignIn.module.css'

export function SignIn() {
    const { signIn } = useAuth();
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        setError('')
        try {
            await signIn(email, password)
            navigate('/', { replace: true })
        } catch (err) {
            setError(errorMessage(err))
            setSubmitting(false)
        }
    }

    return (
        <main className={styles.screen}>
            <div className={styles.topBar}>
                <span className={styles.logo}>
                    <svg
                        aria-hidden="true"
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <circle cx="9" cy="8" r="3" />
                        <circle cx="16.5" cy="9" r="2.5" />
                        <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
                        <path d="M15 14.2c.5-.1 1-.2 1.5-.2 2.5 0 4.5 2 4.5 4.5" />
                    </svg>
                </span>
                <ThemeToggle />
            </div>
            <header className={styles.header}>
                <h1 className={styles.title}>Welcome back</h1>
                <p className={styles.subtitle}>
                    Log feedings and diapers together, each from your own
                    account.
                </p>
            </header>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <Field
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Field
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {error && (
                    <p className={styles.formError} role="alert">
                        {error}
                    </p>
                )}
                <Button
                    type="submit"
                    className={styles.submit}
                    disabled={submitting}
                >
                    {submitting ? 'Signing in…' : 'Sign in'}
                </Button>
            </form>
            <p className={styles.footer}>
                New here? <Link to="/signup">Create an account</Link>
            </p>
        </main>
    )
}

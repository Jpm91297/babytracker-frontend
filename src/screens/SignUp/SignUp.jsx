import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { errorMessage } from '../../api/client.js'
import { Button } from '../../components/Button.jsx'
import { Field } from '../../components/Field.jsx'
import { ThemeToggle } from '../../components/ThemeToggle.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import styles from './SignUp.module.css'

export function SignUp() {
    const { signUp } = useAuth()
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()
        setSubmitting(true)
        setError('')
        try {
            // Signing up also signs you in
            await signUp(name, email, password)
            navigate('/', { replace: true })
        } catch (err) {
            setError(errorMessage(err))
            setSubmitting(false)
        }
    }

    return (
        <main className={styles.screen}>
            <div className={styles.topBar}>
                <Link to="/signin" className={styles.back}>
                    <svg
                        aria-hidden="true"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </Link>
                <ThemeToggle />
            </div>
            <header className={styles.header}>
                <h1 className={styles.title}>Create your account</h1>
                <p className={styles.subtitle}>
                    Everyone who cares for your little one gets their own login.
                </p>
            </header>
            <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <Field
                    label="Your name"
                    autoComplete="given-name"
                    placeholder="First name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
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
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
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
                    {submitting ? 'Creating account…' : 'Create account'}
                </Button>
            </form>
            <div className={styles.note}>
                <svg
                    aria-hidden="true"
                    className={styles.noteIcon}
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M15 7h3a5 5 0 0 1 0 10h-3" />
                    <path d="M9 17H6A5 5 0 0 1 6 7h3" />
                    <path d="M8 12h8" />
                </svg>
                <p>
                    Joining a partner's child? Sign up, then enter the invite
                    code they shared with you.
                </p>
            </div>
            <p className={styles.footer}>
                Already have an account? <Link to="/signin">Sign in</Link>
            </p>
        </main>
    )
}

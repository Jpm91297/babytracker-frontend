import { Button } from '../../components/Button.jsx'
import { ThemeToggle } from '../../components/ThemeToggle.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import styles from './Home.module.css'

// Placeholder 
export function Home() {
    const { user, signOut } = useAuth()

    return (
        <main className={styles.screen}>
            <div className={styles.topBar}>
                <h1 className={styles.title}>Hi {user.name}</h1>
                <ThemeToggle />
            </div>
            <p className={styles.muted}>
                Signed in as {user.email}. Your children will show up here.
            </p>
            <Button variant="secondary" onClick={signOut}>
                Sign out
            </Button>
        </main>
    )
}

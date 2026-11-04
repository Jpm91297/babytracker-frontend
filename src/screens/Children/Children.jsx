import { Link, useNavigate } from 'react-router'
import { Button } from '../../components/Button.jsx'
import { Card } from '../../components/Card.jsx'
import { ThemeToggle } from '../../components/ThemeToggle.jsx'
import { useAuth } from '../../hooks/useAuth.jsx'
import { useChildren } from '../../hooks/useChildren.js'
import { formatBirthDate, timeAgo } from '../../utils/time.js'
import styles from './Children.module.css'

// Card for each child
function ChildCard(props) {

    const { child } = props;

    return (
        <li>
            <Link to={`/children/${child.id}`} className={styles.childLink}>
                <Card className={styles.child}>
                    <div className={styles.identity}>
                        <span className={styles.avatar} aria-hidden="true">
                            {child.name[0].toUpperCase()}
                        </span>
                        <div>
                            <h2 className={styles.name}>{child.name}</h2>
                            {child.birthDate && (
                                <p className={styles.birthDate}>
                                    {formatBirthDate(child.birthDate)}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className={styles.lastEvents}>
                        <p className={`${styles.lastEvent} ${styles.feed}`}>
                            {child.lastFeedAt
                                ? `Fed ${timeAgo(child.lastFeedAt)}`
                                : 'No feeds yet'}
                        </p>
                        <p className={`${styles.lastEvent} ${styles.diaper}`}>
                            {child.lastDiaperAt
                                ? `Diaper ${timeAgo(child.lastDiaperAt)}`
                                : 'No diapers yet'}
                        </p>
                    </div>
                </Card>
            </Link>
        </li>
    );
};

export function Children() {
    
    const { user, signOut } = useAuth();

    const { children, error, loading, getChildren } = useChildren();

    const navigate = useNavigate();

    return (
        <main className={styles.screen}>
            <div className={styles.topBar}>
                <h1 className={styles.title}>Your children</h1>
                <ThemeToggle />
            </div>

            {loading && !children && <p className={styles.muted}>Loading…</p>}

            {error && (
                <div className={styles.status}>
                    <p className={styles.error} role="alert">
                        {error}
                    </p>
                    <Button variant="secondary" onClick={getChildren}>
                        Try again
                    </Button>
                </div>
            )}

            {children?.length === 0 && (
                <p className={styles.muted}>
                    No children yet. Add one, or join with a code from another
                    caregiver.
                </p>
            )}

            {children?.length > 0 && (
                <ul className={styles.list}>
                    {children.map((child) => (
                        <ChildCard key={child.id} child={child} />
                    ))}
                </ul>
            )}

            <div className={styles.actions}>
                <Button onClick={() => navigate('/children/new')}>
                    Add a child
                </Button>
                <Button variant="secondary" onClick={() => navigate('/join')}>
                    Add with an invite code
                </Button>
            </div>

            <div className={styles.account}>
                <p className={styles.signedIn}>Signed in as {user.name}</p>
                <Button variant="ghost" onClick={signOut}>
                    Sign out
                </Button>
            </div>
        </main>
    );
};

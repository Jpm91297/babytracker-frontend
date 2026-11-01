import styles from './Card.module.css'

// A surface for grouped content. Extra props go to the <div>.
export function Card({ className = '', ...props }) {
    return <div className={`${styles.card} ${className}`} {...props} />
}

import styles from './Button.module.css'

// variant: 'primary' (accent fill) | 'secondary' (outlined) | 'ghost' (text only)
export function Button({
    variant = 'primary',
    type = 'button',
    className = '',
    ...props
}) {
    return (
        <button
            type={type}
            className={`${styles.button} ${styles[variant]} ${className}`}
            {...props}
        />
    )
}

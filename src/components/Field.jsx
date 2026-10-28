import { useId } from 'react'
import styles from './Field.module.css'

// A labelled input. Extra props go to the <input>.
export function Field({ label, id, ...inputProps }) {
    const generatedId = useId()
    const inputId = id ?? generatedId

    return (
        <div className={styles.field}>
            <label htmlFor={inputId} className={styles.label}>
                {label}
            </label>
            <input id={inputId} className={styles.input} {...inputProps} />
        </div>
    )
}

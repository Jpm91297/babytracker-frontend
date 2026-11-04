import { useId } from 'react'
import styles from './ToggleGroup.module.css'

// Pick one of a few options. Radio inputs underneath, so the keyboard works by default.
// options: [{ value, label }]
export function ToggleGroup(props) {

    const { label, options, value, onChange } = props;

    const name = useId();

    return (
        <div className={styles.control} role="radiogroup">
            {options.map((option) => (
                <label key={option.value} className={styles.option}>
                    <input
                        type="radio"
                        name={name}
                        className={styles.input}
                        checked={value === option.value}
                        onChange={() => onChange(option.value)}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
};

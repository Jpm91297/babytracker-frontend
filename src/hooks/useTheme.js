import { useState } from 'react'

const STORAGE_KEY = 'theme'

export function useTheme() {
    const [theme, setTheme] = useState(() =>
        document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
    )

    function toggleTheme() {
        const next = theme === 'dark' ? 'light' : 'dark'
        if (next === 'dark') document.documentElement.dataset.theme = 'dark'
        else delete document.documentElement.dataset.theme
        try {
            localStorage.setItem(STORAGE_KEY, next)
        } catch {}
        setTheme(next)
    }

    return { theme, toggleTheme }
}

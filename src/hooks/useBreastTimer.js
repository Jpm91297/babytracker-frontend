import { useEffect, useState } from 'react'

const EMPTY = { leftSec: 0, rightSec: 0, runningSide: null, startedAt: null };

// Left & right feeding timers, one running at a time
export function useBreastTimer() {
    const [timer, setTimer] = useState(EMPTY);

    // Adds a second to the running side every second
    useEffect(() => {
        if (!timer.runningSide) return;

        const key = `${timer.runningSide}Sec`;
        const interval = setInterval(() => {
            setTimer((t) => ({ ...t, [key]: t[key] + 1 }));
        }, 1000);

        return () => clearInterval(interval);
    }, [timer.runningSide]);

    // Starts a side, or pauses it if it's already running
    const toggle = (side) => {
        setTimer((t) => ({
            ...t,
            runningSide: t.runningSide === side ? null : side,
            startedAt: t.startedAt ?? Date.now(),
        }));
    }

    // Stops the timer, and returns its totals for saving
    const pause = () => {
        setTimer((t) => ({ ...t, runningSide: null }));

        return { leftSec: timer.leftSec, rightSec: timer.rightSec };
    }

    const reset = () => setTimer(EMPTY);

    return { ...timer, toggle, pause, reset };
};

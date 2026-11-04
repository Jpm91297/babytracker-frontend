import { useState } from 'react'
import { Button } from '../components/Button.jsx'
import { EventFields } from '../components/EventFields.jsx'
import { Field } from '../components/Field.jsx'
import { ToggleGroup } from '../components/ToggleGroup.jsx'
import { useBreastTimer } from '../hooks/useBreastTimer.js'
import { toLocalInput } from '../utils/time.js'
import { fromMl, getVolumeUnit, setVolumeUnit, toMl } from '../utils/units.js'
import styles from './FeedingForm.module.css'

const METHOD_OPTIONS = [
    { value: 'breast', label: 'Breast' },
    { value: 'bottle', label: 'Bottle' },
];

const UNIT_OPTIONS = [
    { value: 'ml', label: 'ml' },
    { value: 'oz', label: 'oz' },
];

const CONTENTS_OPTIONS = [
    { value: 'breast_milk', label: 'Breast milk' },
    { value: 'formula', label: 'Formula' },
];

const SIDE_NAMES = { left: 'Left', right: 'Right' };

const AMOUNT_STEP = { ml: 10, oz: 0.5 };
const DEFAULT_AMOUNT = { ml: 90, oz: 3 };

// Seconds as a stopwatch, e.g. "14:05"
function formatClock(seconds) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
};

// Seconds as a value for a minutes field, blank rather than 0
const toMinutesField = (seconds) => String(Math.round(seconds / 60) || '');

function TimerButton(props) {

    const { side, seconds, running, disabled, onClick } = props;

    return (
        <button
            type="button"
            className={`${styles.timer} ${running ? styles.running : ''}`}
            disabled={disabled}
            onClick={onClick}
        >
            <span className={styles.timerSide}>{SIDE_NAMES[side]}</span>
            <span className={styles.timerClock}>{formatClock(seconds)}</span>
            <span className={styles.timerHint}>{running ? 'Tap to pause' : 'Tap to start'}</span>
        </button>
    );
};

export function FeedingForm(props) {

    const { error, setError, submitting, onSave } = props;

    const timer = useBreastTimer();

    const [method, setMethod] = useState('breast');
    const [notes, setNotes] = useState('');

    // Start time follows the timer until the user sets one
    const [openedAt] = useState(() => toLocalInput(new Date()));
    const [editedTime, setEditedTime] = useState(null);

    // Typed minutes, in place of the timers
    const [manual, setManual] = useState(false);
    const [leftMinutes, setLeftMinutes] = useState('');
    const [rightMinutes, setRightMinutes] = useState('');

    const [unit, setUnit] = useState(getVolumeUnit);
    const [amount, setAmount] = useState(() => String(DEFAULT_AMOUNT[getVolumeUnit()]));
    const [contents, setContents] = useState('breast_milk');

    const timerTime = method === 'breast' && timer.startedAt && toLocalInput(new Date(timer.startedAt));
    const time = editedTime ?? (timerTime || openedAt);

    function switchToMinutes() {
        const { leftSec, rightSec } = timer.pause();
        setLeftMinutes(toMinutesField(leftSec));
        setRightMinutes(toMinutesField(rightSec));
        setManual(true);
        setError('');
    };

    function switchToTimers() {
        setManual(false);
        setError('');
    };

    function resetTimer() {
        if (window.confirm('Discard this timer?')) timer.reset();
    };

    function changeUnit(next) {
        setAmount(String(fromMl(toMl(Number(amount), unit), next)));
        setUnit(next);
        setVolumeUnit(next);
    };

    function stepAmount(direction) {
        const step = AMOUNT_STEP[unit];
        const next = Math.max(step, (Number(amount) || 0) + direction * step);
        setAmount(String(Math.round(next * 10) / 10));
    };

    function timerDetails() {
        const { leftSec, rightSec } = timer.pause();

        if (leftSec + rightSec === 0) {
            setError('Start a timer, or enter minutes instead');
            return null;
        }

        return { method: 'breast', leftSec, rightSec };
    };

    function manualDetails() {
        const left = Number(leftMinutes);
        const right = Number(rightMinutes);

        if (!(left >= 0) || !(right >= 0)) {
            setError('Enter valid minutes');
            return null;
        }

        const leftSec = Math.round(left * 60);
        const rightSec = Math.round(right * 60);

        if (leftSec + rightSec === 0) {
            setError('Enter minutes for at least one side');
            return null;
        }

        return { method: 'breast', leftSec, rightSec };
    };

    function bottleDetails() {
        const amountMl = toMl(Number(amount), unit);

        if (!(amountMl > 0)) {
            setError('Enter the amount');
            return null;
        }

        return { method: 'bottle', amountMl, contents };
    };

    async function handleSubmit(e) {

        e.preventDefault();

        const details = method === 'bottle' ? bottleDetails() : manual ? manualDetails() : timerDetails();

        if (!details) return;

        const saved = await onSave({ time, notes, details });

        // Only a breast feeding used up the timer
        if (saved && method === 'breast') timer.reset();
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <ToggleGroup
                label="Feeding method"
                options={METHOD_OPTIONS}
                value={method}
                onChange={(next) => {
                    setMethod(next);
                    setError('');
                }}
            />

            {method === 'breast' && (
                <div className={styles.section}>
                    {manual ? (
                        <div className={styles.minutes}>
                            <Field
                                label="Left minutes"
                                type="number"
                                inputMode="decimal"
                                min="0"
                                value={leftMinutes}
                                onChange={(e) => setLeftMinutes(e.target.value)}
                            />
                            <Field
                                label="Right minutes"
                                type="number"
                                inputMode="decimal"
                                min="0"
                                value={rightMinutes}
                                onChange={(e) => setRightMinutes(e.target.value)}
                            />
                        </div>
                    ) : (
                        <>
                            <div className={styles.timers}>
                                {Object.keys(SIDE_NAMES).map((side) => (
                                    <TimerButton
                                        key={side}
                                        side={side}
                                        seconds={side === 'left' ? timer.leftSec : timer.rightSec}
                                        running={timer.runningSide === side}
                                        disabled={submitting}
                                        onClick={() => timer.toggle(side)}
                                    />
                                ))}
                            </div>
                            <p className={styles.total}>
                                Total {formatClock(timer.leftSec + timer.rightSec)}
                            </p>
                        </>
                    )}

                    <div className={styles.timerActions}>
                        <Button variant="ghost" onClick={manual ? switchToTimers : switchToMinutes}>
                            {manual ? 'Use timers instead' : 'Enter minutes instead'}
                        </Button>
                        {!manual && timer.startedAt && (
                            <Button variant="ghost" onClick={resetTimer}>
                                Reset
                            </Button>
                        )}
                    </div>
                </div>
            )}

            {method === 'bottle' && (
                <div className={styles.section}>
                    <div className={styles.group}>
                        <label htmlFor="bottle-amount" className={styles.groupLabel}>
                            Amount
                        </label>
                        <div className={styles.stepper}>
                            <button
                                type="button"
                                className={styles.step}
                                onClick={() => stepAmount(-1)}
                            >
                                -
                            </button>
                            <input
                                id="bottle-amount"
                                className={styles.amount}
                                type="number"
                                inputMode="decimal"
                                min="0"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                            />
                            <button
                                type="button"
                                className={styles.step}
                                onClick={() => stepAmount(1)}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <ToggleGroup
                        label="Volume unit"
                        options={UNIT_OPTIONS}
                        value={unit}
                        onChange={changeUnit}
                    />
                    <ToggleGroup
                        label="Bottle contents"
                        options={CONTENTS_OPTIONS}
                        value={contents}
                        onChange={setContents}
                    />
                </div>
            )}

            <EventFields
                timeLabel="Start time"
                time={time}
                onTimeChange={setEditedTime}
                notes={notes}
                onNotesChange={setNotes}
                error={error}
                submitting={submitting}
                saveLabel="Save feeding"
            />
        </form>
    );
};

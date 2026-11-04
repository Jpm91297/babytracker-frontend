import { formatVolume } from '../utils/units.js';
import { FeedingForm } from './FeedingForm.jsx';

const CONTENTS = { breast_milk: 'Breast milk', formula: 'Formula' };

// Seconds as whole minutes, e.g. "14m"
function formatDuration(seconds) {
    return seconds < 60 ? '<1m' : `${Math.round(seconds / 60)}m`;
};

function summarize(details) {

    if (details.method === 'bottle') {
        return `${formatVolume(details.amountMl)} · ${CONTENTS[details.contents]}`;
    }

    const sides = [];
    if (details.leftSec > 0) sides.push(`Left ${formatDuration(details.leftSec)}`);
    if (details.rightSec > 0) sides.push(`Right ${formatDuration(details.rightSec)}`);
    return sides.join(' · ');
};

export const feeding = {
    name: 'feeding',
    label: 'Feeding',
    tone: 'feed',
    summarize,
    Form: FeedingForm,
    tile(summary) {
        const { lastFeeding } = summary;
        return {
            lastAt: lastFeeding?.startedAt ?? null,
            subline: lastFeeding && summarize(lastFeeding.details),
        };
    },
};

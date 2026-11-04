import { DiaperForm } from './DiaperForm.jsx';

const TYPES = { wet: 'Wet', dirty: 'Dirty', mixed: 'Mixed', dry: 'Dry' };

function summarize(details) {
    return TYPES[details.type];
};

export const diaper = {
    name: 'diaper',
    label: 'Diaper',
    tone: 'diaper',
    summarize,
    Form: DiaperForm,
    tile(summary) {
        const { lastDiaper } = summary;
        return {
            lastAt: lastDiaper?.startedAt ?? null,
            subline: lastDiaper && summarize(lastDiaper.details),
        };
    },
};

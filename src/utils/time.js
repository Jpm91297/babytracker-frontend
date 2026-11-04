// 'YYYY-MM-DD'
export function formatBirthDate(birthDate) {

    return new Date(birthDate).toLocaleDateString(undefined, {
        dateStyle: 'medium',
        timeZone: 'UTC',
    });
};

// How long ago an ISO timestamp was
export function timeAgo(iso, now = new Date()) {

    const minutes = Math.floor((now - new Date(iso)) / 60000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;

    return `${Math.floor(hours / 24)}d ago`;
};

// A Date as a datetime-local input value, in the user's timezone
export function toLocalInput(date) {

    const pad = (value) => String(value).padStart(2, '0');

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

// What's wrong with a datetime-local value, or '' if it can be logged
export function startTimeError(value) {

    if (!value) return 'Enter a time';
    if (new Date(value) > new Date()) return "The time can't be in the future";

    return '';
};

// Time of day in the user's timezone
export function formatTime(iso) {

    return new Date(iso).toLocaleTimeString(undefined, {
        hour: 'numeric',
        minute: '2-digit',
    });
};

// Today, Yesterday, or a date in the user's timezone
export function dayLabel(iso, now = new Date()) {

    const date = new Date(iso);
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    if (date.toDateString() === now.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';

    return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        ...(date.getFullYear() !== now.getFullYear() && { year: 'numeric' }),
    });
};
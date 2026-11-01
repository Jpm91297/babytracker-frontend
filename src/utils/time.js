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
import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client.js'

// State Management for a Child's Events
export function useEvents(childId) {
    const [events, setEvents] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const getEvents = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/children/${childId}/events`);
            setEvents(res.data.events);
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getEvents();
    }, [childId]);

    return { events, error, loading, getEvents };
};

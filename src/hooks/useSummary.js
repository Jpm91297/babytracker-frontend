import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client.js'

// State Management for a Child's Latest Events
export function useSummary(childId) {
    const [summary, setSummary] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const getSummary = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/children/${childId}/summary`);
            setSummary(res.data);
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getSummary();
    }, [childId]);

    return { summary, error, loading, getSummary };
};

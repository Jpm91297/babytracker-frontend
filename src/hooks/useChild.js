import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client.js'

// State Management for a Single Child
export function useChild(id) {
    
    const [child, setChild] = useState(null);
    const [error, setError] = useState('');
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);

    const getChild = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get(`/children/${id}`);
            setChild(res.data.child);
        } catch (err) {
            setError(errorMessage(err));
            setNotFound(err.response?.status === 404);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getChild();
    }, [id]);

    return { child, error, notFound, loading, getChild };
};

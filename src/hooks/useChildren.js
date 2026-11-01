import { useEffect, useState } from 'react'
import { api, errorMessage } from '../api/client.js'

// State Management for Children
export function useChildren() {
    const [children, setChildren] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    const getChildren = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await api.get('/children');
            setChildren(res.data.children);
        } catch (err) {
            setError(errorMessage(err));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getChildren();
    }, []);

    return { children, error, loading, getChildren };
};
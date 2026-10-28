import { Navigate, Outlet } from 'react-router'
import { useAuth } from '../hooks/useAuth.jsx'

// Route to Sign-in if not authenticated, otherwise proceed
export function RequireAuth() {

    const { user, loading } = useAuth()

    if (loading) return null;

    if (!user) return <Navigate to="/signin" replace />;

    return <Outlet />;
};

// Outside of Auth
export function GuestOnly() {

    const { user, loading } = useAuth();
    
    if (loading) return null;

    // Navigate to home if signed in
    if (user) return <Navigate to="/" replace />;

    return <Outlet />;
};

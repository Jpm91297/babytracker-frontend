import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../api/client.js'

const AuthContext = createContext(null)


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // Check Token
    useEffect(() => {
        api.get('/auth/user')
        .then((res) => setUser(res.data.user))
        .catch(() => setUser(null))
        .finally(() => setLoading(false))
    }, []);


    async function signIn(email, password) {
        const res = await api.post('/auth/login', { email, password })
        setUser(res.data.user)
    }

    async function signUp(name, email, password) {
        const res = await api.post('/auth/signup', { name, email, password })
        setUser(res.data.user)
    }

    async function signOut() {
        await api.post('/auth/logout')
        setUser(null)
    }

    return (
        <AuthContext value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext>
    )
}


export function useAuth() {
    return useContext(AuthContext)
}

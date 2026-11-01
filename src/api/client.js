import axios from 'axios'

// API Handler
export const api = axios.create({ baseURL: '/api', withCredentials: true })

// Parse Error Message
export function errorMessage(err) {
    return err.response?.data?.error ?? 'Something went wrong. Try again.'
}
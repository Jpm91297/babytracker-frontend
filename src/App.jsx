import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './hooks/useAuth.jsx'
import { GuestOnly, RequireAuth } from './components/RouteGuards.jsx'
import { Home } from './screens/Home/Home.jsx'
import { SignIn } from './screens/SignIn/SignIn.jsx'
import { SignUp } from './screens/SignUp/SignUp.jsx'

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route element={<GuestOnly />}>
                        <Route path="/signin" element={<SignIn />} />
                        <Route path="/signup" element={<SignUp />} />
                    </Route>
                    <Route element={<RequireAuth />}>
                        <Route path="/" element={<Home />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App

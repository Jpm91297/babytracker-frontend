import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { AuthProvider } from './hooks/useAuth.jsx'
import { GuestOnly, RequireAuth } from './components/RouteGuards.jsx'
import { AddChild } from './screens/AddChild/AddChild.jsx'
import { Children } from './screens/Children/Children.jsx'
import { AddChildCode } from './screens/AddChildcode/AddChildCode.jsx'
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
                        <Route path="/" element={<Children />} />
                        <Route path="/children/new" element={<AddChild />} />
                        <Route path="/join" element={<AddChildCode />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    )
}

export default App

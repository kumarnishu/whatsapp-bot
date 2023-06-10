import { Routes, Route, Navigate } from "react-router-dom"
import LoginPage from "./pages/auth/LoginPage"
import SignUpPage from "./pages/auth/SignUpPage"
import { useContext } from "react"
import { UserContext } from "./contexts/UserContext"
import ResetPasswordPage from "./pages/auth/ResetPasswordPage"
import UpdatePasswordPage from "./pages/auth/UpdatePassword"
import FlowsPage from "./pages/FlowsPage"
import FlowPage from "./pages/FlowPage"

export enum paths {
    login = "/login",
    signup = "/signup",
    flows = "/flows",
    flow = "flow",
    reset_password = "/password/reset/:token",
    update_password = "/password/update",
}
function AppRoutes() {
    const { user } = useContext(UserContext)
    return (
        <Routes>
            <Route path={paths.login} element={<LoginPage />} />
            <Route path={paths.signup} element={<SignUpPage />} />
            <Route path={paths.reset_password} element={<ResetPasswordPage />} />
            <Route path={paths.flows} element={user ? <FlowsPage /> : <LoginPage />} />
            <Route path={paths.flow} element={user ? <FlowPage /> : <LoginPage />} />
            <Route path={paths.update_password} element={user ? <UpdatePasswordPage /> : <LoginPage />} />
            <Route path="*" element={<Navigate to={paths.login} />} />
        </Routes>
    )
}

export default AppRoutes

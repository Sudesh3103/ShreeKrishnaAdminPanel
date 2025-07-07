import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"
import AdminLogin from "./AdminLogin"
import Dashboard from "./Dashboard"
import ForgotPassword from './ForgotPassword'


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

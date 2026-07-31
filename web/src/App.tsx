import { Routes, Route } from 'react-router'
import SingUp from "./pages/SignUp"
import Login from "./pages/Login"
import Dashboard from './pages/Dashboard'
import { Navigate } from 'react-router'
import { ProtectedRoute } from './features/auth/ProtectedRoute'



function App() {


  return (

    <Routes>
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/signup" element={<SingUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>


  )
}

export default App

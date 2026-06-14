import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import BuilderPage from './pages/BuilderPage'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Full-screen auth pages (no navbar/footer) */}
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />

      {/* Main app shell with navbar + footer */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />

        {/* Protected — require login */}
        <Route
          path="builder"
          element={
            <ProtectedRoute>
              <BuilderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App

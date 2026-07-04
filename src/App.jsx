import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import BuilderPage from './pages/BuilderPage'
import DashboardPage from './pages/DashboardPage'
import FormsPage from './pages/FormsPage'
import FormDetailPage from './pages/FormDetailPage'
import FormFillPage from './pages/FormFillPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import './App.css'

function App() {
  return (
    <Routes>
      {/* Full-screen pages (no navbar/footer) */}
      <Route path="login" element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />

      {/* Public form-fill page */}
      <Route path="form/:id" element={<FormFillPage />} />

      {/* Protected, full-screen app surfaces */}
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="forms"
        element={
          <ProtectedRoute>
            <FormsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="forms/:id"
        element={
          <ProtectedRoute>
            <FormDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="builder"
        element={
          <ProtectedRoute>
            <BuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="builder/:id"
        element={
          <ProtectedRoute>
            <BuilderPage />
          </ProtectedRoute>
        }
      />

      {/* Marketing shell with navbar + footer */}
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App

import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import CallToAction from '../components/CallToAction'

function HomePage() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) return null

  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <CallToAction />
    </>
  )
}

export default HomePage

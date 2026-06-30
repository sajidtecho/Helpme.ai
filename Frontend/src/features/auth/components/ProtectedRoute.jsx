import React from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

/**
 * Route guard wrapper that redirects unauthenticated users to the Login page.
 */
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  // Render a clean loading spinner while verifying token sessions
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#030712',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          width: '2.5rem',
          height: '2.5rem',
          border: '3px solid rgba(255, 255, 255, 0.1)',
          borderTopColor: '#2563EB',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  // If no user session exists, redirect to login page
  if (!user) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute

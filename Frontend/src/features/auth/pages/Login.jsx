import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import '../auth.form.scss' // Import auth styling rules
import logoImg from '../../../assets/logo-v3.png' // Import logo asset for Vite bundling
import { useAuth } from '../hooks/useAuth.js' // Import auth hook
import { joinApiUrl } from '../../../config/api.js'

const Login = () => {
  const { handlelogin } = useAuth()
  const navigate = useNavigate()

  // Form input states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  
  // Interactive UI states
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [successMsg, setSuccessMsg] = useState('')

  // Toggle password visibility
  const handleTogglePassword = (e) => {
    e.preventDefault()
    setShowPassword(!showPassword)
  }

  // Handle form submission and validations
  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Reset status states
    setErrors({})
    setSuccessMsg('')
    
    // Front-end validations
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Trigger real api login
    setIsLoading(true)
    
    handlelogin({ email, password })
      .then(() => {
        setIsLoading(false)
        setSuccessMsg('Welcome back! Redirecting to dashboard...')
        setTimeout(() => {
          navigate('/dashboard')
        }, 1200)
      })
      .catch((err) => {
        setIsLoading(false)
        setErrors({ form: err.response?.data?.message || err.message || 'Login failed. Please verify your credentials.' })
      })
  }

  return (
    <div className="auth-page">
      {/* Background System - Slow moving ambient blur orbs */}
      <div className="bg-ambient">
        <div className="orb orb-primary"></div>
        <div className="orb orb-secondary"></div>
        <div className="orb orb-accent"></div>
      </div>

      <div className="auth-content">
        {/* Left Side - Showcase/Hero Panel (Desktop Only)*/}
        <section className="auth-showcase">
          {/* Showcase Brand Logo */}
          <div className="showcase-header"> 
            <Link to="/">
              <img src={logoImg} alt="HelpMe.Ai Logo" className="brand-logo-img" style={{ cursor: 'pointer' }} />
            </Link>
          </div>

          {/* Headline & Subtitle */}
          <div className="showcase-body">
            <h1 className="headline">
              Tailor your resume with <span>AI intelligence</span> to beat the ATS.
            </h1>
            <p className="subtitle">
              Scan your resume against any job description, pinpoint missing skills, calculate compatibility instantly, and export optimized applications designed to get interviews.
            </p>

            {/* Interactive Dashboard Mockup Widget */}
            <div className="dashboard-mockup">
              {/* SVG Gradients for Score Chart */}
              <svg style={{ height: 0, width: 0, position: 'absolute' }}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="mock-header">
                <span className="mock-title">ATS SCORING SYSTEM</span>
                <span className="mock-status">COMPLETED</span>
              </div>

              {/* Progress Circle Visualizer */}
              <div className="analysis-score-container">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray="92, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">92%</text>
                </svg>
                <div className="score-meta">
                  <h4>Excellent Compatibility</h4>
                  <p>Your resume matches 14 out of 16 core job requirements.</p>
                </div>
              </div>

              {/* Mini widgets grid */}
              <div className="mock-widgets-grid">
                <div className="widget-card">
                  <span className="widget-label">ATS Rank</span>
                  <div className="widget-value" style={{ color: '#10B981' }}>Strong Fit (Top 5%)</div>
                </div>
                <div className="widget-card">
                  <span className="widget-label">Keywords Analysis</span>
                  <div className="skill-gap-list">
                    <span className="skill-tag match">React</span>
                    <span className="skill-tag match">Redux</span>
                    <span className="skill-tag missing">Python</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features indicator */}
          <div className="showcase-footer">
            <div className="features-indicator">
              <span>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                ATS Matcher
              </span>
              <span>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                AI Assistant
              </span>
              <span>
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                Tailored Exports
              </span>
            </div>
            <span>© 2026 HelpMe.AI Inc.</span>
          </div>
        </section>

        {
        /*
            Right Side - Sign In Form Area
        */
        }
        <section className="auth-form-side">
          <div className="form-container">
            {/* Mobile Logo (Visible on mobile/tablet viewports only) */}
            <div className="mobile-logo-header">
              <Link to="/">
                <img src={logoImg} alt="HelpMe.Ai Logo" className="brand-logo-img" style={{ cursor: 'pointer' }} />
              </Link>
            </div>

            {/* Glassmorphism Auth Card */}
            <div className="auth-card">
              <header className="form-header">
                <h2 className="title">Welcome</h2>
                <p className="subtitle">Sign in to scan resumes and build tailored templates.</p>
              </header>

              <form onSubmit={handleSubmit} noValidate>
                {/* Form Alert Message */}
                {successMsg && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    color: '#34d399',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    marginBottom: '1.25rem'
                  }}>
                    {successMsg}
                  </div>
                )}

                {errors.form && (
                  <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.2)',
                    color: '#f87171',
                    padding: '0.75rem 1rem',
                    borderRadius: '0.75rem',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                    marginBottom: '1.25rem'
                  }}>
                    {errors.form}
                  </div>
                )}

                {/* Email Address Input */}
                <div className="form-group">
                  <div className="label-wrapper">
                    <label htmlFor="email">Email Address</label>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="email"
                      type="email"
                      className={`input-control ${errors.email ? 'has-error' : ''}`}
                      placeholder="Enter Your Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                    {/* Mail SVG Icon */}
                    <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path>
                    </svg>
                  </div>
                  {errors.email && (
                    <span className="error-text">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {errors.email}
                    </span>
                  )}
                </div>

                {/* Password Input */}
                <div className="form-group">
                  <div className="label-wrapper">
                    <label htmlFor="password">Password</label>
                  </div>
                  <div className="input-wrapper">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      className={`input-control input-control-password ${errors.password ? 'has-error' : ''}`}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                    {/* Lock SVG Icon */}
                    <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                    </svg>
                    {/* Eye toggle button */}
                    <button type="button" className="password-toggle" onClick={handleTogglePassword} disabled={isLoading}>
                      {showPassword ? (
                        // Eye Open Icon
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      ) : (
                        // Eye Slash Icon
                        <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <span className="error-text">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                      </svg>
                      {errors.password}
                    </span>
                  )}
                </div>

                {/* Form Actions (Remember me & Forgot password) */}
                <div className="form-actions">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                    />
                    <div className="checkbox-checkmark">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span>Remember me</span>
                  </label>
                  <a href="#forgot" className="forgot-link" onClick={(e) => e.preventDefault()}>Forgot Password?</a>
                </div>

                {/* Submit Action Button */}
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="btn-loader"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Form Divider */}
              <div className="divider">
                <span>Or continue with</span>
              </div>

              {/* Social Login Button Grid */}
              <div className="social-grid">
                <button 
                  type="button"
                  className="social-btn" 
                  onClick={() => { window.location.href = joinApiUrl('/api/auth/google') }} 
                  disabled={isLoading}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  Google
                </button>
                <button 
                  type="button"
                  className="social-btn" 
                  onClick={() => { window.location.href = joinApiUrl('/api/auth/linkedin') }} 
                  disabled={isLoading}
                >
                  <svg viewBox="0 0 24 24" width="24" height="24" fill="#0077B5" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
                  </svg>
                  LinkedIn
                </button>
              </div>

              {/* Form Footer Redirect Link */}
              <footer className="form-footer">
                <p>
                  Don't have an account?
                  <Link to="/register">Create an Account</Link>
                </p>
              </footer>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Login
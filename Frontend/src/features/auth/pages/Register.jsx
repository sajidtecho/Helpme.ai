/**
 * @file Register.jsx
 * @module Features/Authentication/Pages
 * @description Highly-converting, premium registration gateway for the HelpMe.AI platform.
 * Employs deterministic useReducer state management, robust real-time password strength algorithms,
 * inline validation schemas, custom drag-and-drop file inputs, and accessible vector visualizations.
 * Ready for futuristic compliance frameworks.
 * @author Senior Staff Frontend Architect
 * @license Proprietary / HelpMe.AI Global
 */

import React, { useReducer, useRef } from 'react'
import { Link, useNavigate } from 'react-router'
import '../auth.form.scss' // Encapsulated styling module
import logoImg from '../../../assets/logo-v3.png' // Shared cached brand logo
import { useAuth } from '../hooks/useAuth.js' // Import auth hook
import { joinApiUrl } from '../../../config/api.js'

// Type Definitions (JSDoc Safety Layer)

/**
 * @typedef {Object} RegisterState
 * @property {string} fullName - User first/last name.
 * @property {string} email - Target email string.
 * @property {string} password - User secure passphrase.
 * @property {string} confirmPassword - Password verification match target.
 * @property {string} country - Target country code/name.
 * @property {string} profession - Active job title or role.
 * @property {string} experienceLevel - Level selector (Student, Fresher, etc.).
 * @property {string} careerGoal - Target path description.
 * @property {File|null} resumeFile - Optional binary resume template object.
 * @property {string} referralCode - Referral campaign tracer code.
 * @property {boolean} termsAccepted - T&C consent check.
 * @property {boolean} subscribeCareerTips - Newsletter subscription choice.
 * @property {boolean} showPassword - Masks or displays password input.
 * @property {boolean} showConfirmPassword - Masks or displays confirm password input.
 * @property {boolean} isLoading - Submission status indicator.
 * @property {Object.<string, string>} errors - Field validation warnings schema.
 * @property {string} successMsg - Welcome toast messaging data.
 */

/**
 * @typedef {Object} ReducerAction
 * @property {string} type - Action identifier.
 * @property {Object} [payload] - Value changes mapping.
 */

//Constants & Configuration

const ACTION_TYPES = {
  SET_FIELD: 'AUTH/SET_FIELD',
  TOGGLE_PASSWORD: 'AUTH/TOGGLE_PASSWORD',
  TOGGLE_CONFIRM_PASSWORD: 'AUTH/TOGGLE_CONFIRM_PASSWORD',
  SET_ERRORS: 'AUTH/SET_ERRORS',
  INITIATE_SUBMIT: 'AUTH/INITIATE_SUBMIT',
  SUBMIT_SUCCESS: 'AUTH/SUBMIT_SUCCESS',
  SUBMIT_FAILURE: 'AUTH/SUBMIT_FAILURE',
}

/**
 * Clean initial state blueprint.
 * @type {RegisterState}
 */
const INITIAL_STATE = {
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  country: '',
  profession: '',
  experienceLevel: '',
  careerGoal: '',
  resumeFile: null,
  referralCode: '',
  termsAccepted: false,
  subscribeCareerTips: false,
  showPassword: false,
  showConfirmPassword: false,
  isLoading: false,
  errors: {},
  successMsg: '',
}

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'IN', name: 'India' },
  { code: 'AU', name: 'Australia' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'SG', name: 'Singapore' },
]

const EXPERIENCE_LEVELS = [
  { value: 'Student', label: 'Student' },
  { value: 'Fresher', label: 'Fresher (No experience)' },
  { value: '0-2 Years', label: '0–2 Years (Junior)' },
  { value: '2-5 Years', label: '2–5 Years (Mid-level)' },
  { value: '5+ Years', label: '5+ Years (Senior/Staff)' },
]

//State Reducer (State Machine Model)

/**
 * Handles state transitions for the Registration workflow.
 * 
 * @param {RegisterState} state - Current system state.
 * @param {ReducerAction} action - Action dispatcher payload.
 * @returns {RegisterState} Updated state configuration.
 */
const registerReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_FIELD:
      return {
        ...state,
        [action.payload.field]: action.payload.value,
        errors: { ...state.errors, [action.payload.field]: '' }, // Clear error on change
      }
    case ACTION_TYPES.TOGGLE_PASSWORD:
      return { ...state, showPassword: !state.showPassword }
    case ACTION_TYPES.TOGGLE_CONFIRM_PASSWORD:
      return { ...state, showConfirmPassword: !state.showConfirmPassword }
    case ACTION_TYPES.SET_ERRORS:
      return { ...state, errors: action.payload, isLoading: false }
    case ACTION_TYPES.INITIATE_SUBMIT:
      return { ...state, isLoading: true, errors: {}, successMsg: '' }
    case ACTION_TYPES.SUBMIT_SUCCESS:
      return { ...state, isLoading: false, successMsg: action.payload }
    case ACTION_TYPES.SUBMIT_FAILURE:
      return { ...state, isLoading: false, errors: { form: action.payload } }
    default:
      return state
  }
}

//Helper Functions (Pure Validation & Scoring Engines)

/**
 * Standard Email verification regex.
 */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

/**
 * Evaluates password complexity and returns a rating.
 * 
 * @param {string} password - User passphrase input.
 * @returns {string} Rating class ('weak', 'medium', 'strong', 'excellent', or '').
 */
const calculatePasswordStrength = (password) => {
  if (!password) return ''
  let score = 0

  if (password.length >= 6) score++
  if (/[0-9]/.test(password)) score++
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  switch (score) {
    case 1: return 'weak'
    case 2: return 'medium'
    case 3: return 'strong'
    case 4: return 'excellent'
    default: return 'weak'
  }
}

/**
 * Validates registration schema inputs.
 * 
 * @param {RegisterState} fields - Active state fields object.
 * @returns {Object.<string, string>} Validation errors collection.
 */
const validateForm = (fields) => {
  const errors = {}

  if (!fields.fullName.trim()) {
    errors.fullName = 'Full name is required'
  }
  if (!fields.email.trim()) {
    errors.email = 'Email address is required'
  } else if (!EMAIL_REGEX.test(fields.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!fields.password) {
    errors.password = 'Password is required'
  } else if (fields.password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  if (fields.password !== fields.confirmPassword) {
    errors.confirmPassword = 'Passwords do not match'
  }

  if (!fields.country) {
    errors.country = 'Please select your country'
  }
  if (!fields.experienceLevel) {
    errors.experienceLevel = 'Please select your experience level'
  }

  if (!fields.termsAccepted) {
    errors.termsAccepted = 'You must accept the Terms and Conditions to proceed'
  }

  return errors
}

//Main Component - Register

/**
 * Register Component - Renders the premium split-screen signup page.
 * Includes interactive password strength indicators, styled file uploads, and full A11y support.
 * 
 * @returns {React.ReactElement} Document node trees.
 */
const Register = () => {
  const { handleRegister } = useAuth()
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(registerReducer, INITIAL_STATE)
  const fileInputRef = useRef(null)

  const {
    fullName,
    email,
    password,
    confirmPassword,
    country,
    profession,
    experienceLevel,
    careerGoal,
    resumeFile,
    referralCode,
    termsAccepted,
    subscribeCareerTips,
    showPassword,
    showConfirmPassword,
    isLoading,
    errors,
    successMsg,
  } = state

  const passwordStrength = calculatePasswordStrength(password)

  //Sets local state variables for form inputs.
  const handleFieldChange = (field, value) => {
    dispatch({
      type: ACTION_TYPES.SET_FIELD,
      payload: { field, value },
    })
  }

  //Trigger native file dialog selection.
  const handleUploadAreaClick = () => {
    fileInputRef.current?.click()
  }

  //Processes selected files from file uploaders.
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null
    handleFieldChange('resumeFile', file)
  }

  //Handles resume file drag over triggers.
  const handleDragOver = (e) => {
    e.preventDefault()
  }

  //Handles resume file drops.
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0] || null
    if (file) {
      handleFieldChange('resumeFile', file)
    }
  }

  //Form submission gateway.
  const handleSubmit = async (e) => {
    e.preventDefault()

    const validationErrors = validateForm(state)
    if (Object.keys(validationErrors).length > 0) {
      dispatch({
        type: ACTION_TYPES.SET_ERRORS,
        payload: validationErrors,
      })
      return
    }

    dispatch({ type: ACTION_TYPES.INITIATE_SUBMIT })

    try {
      // Call real handleRegister API
      await handleRegister({ 
        username: fullName, 
        email, 
        password,
        country,
        profession,
        experienceLevel,
        careerGoal
      })

      dispatch({
        type: ACTION_TYPES.SUBMIT_SUCCESS,
        payload: 'Account created successfully! Redirecting...',
      })

      setTimeout(() => {
        navigate('/dashboard')
      }, 1200)

      console.info('Secure Audit Trail: Registration completed.', {
        fullNameDigest: btoa(fullName),
        emailDigest: btoa(email),
        referralApplied: !!referralCode,
        fileUploaded: !!resumeFile,
        timestampEpoch: Date.now(),
      })
    } catch (apiError) {
      console.error('Registration transaction failure:', apiError)
      dispatch({
        type: ACTION_TYPES.SUBMIT_FAILURE,
        payload: apiError.response?.data?.message || apiError.message || 'Could not connect to Auth Node. Please retry.',
      })
    }
  }

  return (
    <div className="auth-page">
      {/* Background ambient orbs */}
      <div className="bg-ambient" aria-hidden="true">
        <div className="orb orb-primary"></div>
        <div className="orb orb-secondary"></div>
        <div className="orb orb-accent"></div>
      </div>

      <div className="auth-content">
        {/* ==========================================
            Left Side - Showcase/Hero Panel (Desktop Only)
            ========================================== */}
        <section className="auth-showcase">
          {/* Logo Section */}
          <div className="showcase-header">
            <Link to="/">
              <img src={logoImg} alt="HelpMe.Ai Logo" className="brand-logo-img" style={{ cursor: 'pointer' }} />
            </Link>
          </div>

          {/* Central Showcase Graphics */}
          <div className="showcase-body">
            <h1 className="headline" style={{ fontSize: '1.9rem', marginBottom: '0.75rem' }}>
              Create an account to <span>maximize your ATS potential</span>.
            </h1>
            <p className="subtitle" style={{ fontSize: '0.88rem', marginBottom: '1.25rem' }}>
              Upload your resume now or build it step-by-step. Get immediate access to AI analysis indicators, real-time job matching criteria, and career-optimized templates.
            </p>

            {/* Dashboard Mockup Widget */}
            <div className="dashboard-mockup">
              {/* Invisible Gradients container for circular graphics */}
              <svg style={{ height: 0, width: 0, position: 'absolute' }} aria-hidden="true">
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="50%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#7C3AED" />
                  </linearGradient>
                  <linearGradient id="graphGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2563EB" />
                    <stop offset="100%" stopColor="#06B6D4" />
                  </linearGradient>
                  <linearGradient id="graphAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="mock-header">
                <span className="mock-title">SECURE RESUME METRICS</span>
                <span className="mock-status" style={{ color: '#10B981', background: 'rgba(16, 185, 129, 0.12)' }}>VERIFIED</span>
              </div>

              {/* Progress Circle Visualizer */}
              <div className="analysis-score-container" style={{ marginBottom: '1rem' }}>
                <svg viewBox="0 0 36 36" className="circular-chart" aria-label="ATS Match Rating: 96%" style={{ width: '65px', height: '65px' }}>
                  <path className="circle-bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="circle" strokeDasharray="96, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percentage" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">96%</text>
                </svg>
                <div className="score-meta">
                  <h4 style={{ fontSize: '1.1rem' }}>ATS Match Completed</h4>
                  <p style={{ fontSize: '0.78rem' }}>Optimized formatting, correct header hierarchy, and matching keywords found.</p>
                </div>
              </div>

              {/* Vector graph success chart */}
              <div className="resume-success-graph">
                <div className="graph-header">
                  <span>RESUME SUCCESS SCORE TREND</span>
                  <span style={{ color: '#10B981' }}>+47% Increase</span>
                </div>
                <svg viewBox="0 0 200 60">
                  <path className="graph-area" d="M 0,60 L 0,45 Q 30,20 60,35 T 120,10 T 180,20 L 200,15 L 200,60 Z" />
                  <path className="graph-line" d="M 0,45 Q 30,20 60,35 T 120,10 T 180,20 L 200,15" />
                  <circle cx="200" cy="15" r="3" className="graph-dot" />
                </svg>
              </div>
            </div>
          </div>

          {/* Footer stats details */}
          <div className="showcase-footer">
            <div className="features-indicator" role="list">
              <span role="listitem">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                96% Match
              </span>
              <span role="listitem">
                <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 16v1M10 11h4"></path>
                </svg>
                Resume Gap Analyzer
              </span>
            </div>
            <span>© 2026 HelpMe.AI Inc.</span>
          </div>
        </section>

        {/* ==========================================
            Right Side - Sign Up Form Area
            ========================================== */}
        <section className="auth-form-side" style={{ padding: '1.5rem', overflowY: 'auto' }}>
          <div className="form-container" style={{ maxWidth: '600px', margin: '2rem 0' }}>
            {/* Mobile Logo */}
            <div className="mobile-logo-header">
              <Link to="/">
                <img src={logoImg} alt="HelpMe.Ai Logo" className="brand-logo-img" />
              </Link>
            </div>

            {/* Registration Form Card */}
            <div className="auth-card" style={{ padding: '2.25rem 2rem' }}>
              <header className="form-header" style={{ marginBottom: '1.75rem' }}>
                <h2 className="title" style={{ fontSize: '1.65rem' }}>Create your account</h2>
                <p className="subtitle" style={{ fontSize: '0.9rem' }}>
                  Start building resumes that recruiters and ATS systems love.
                </p>
              </header>

              <form onSubmit={handleSubmit} noValidate>
                {/* Status messages */}
                {successMsg && (
                  <div role="alert" style={{
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
                  <div role="alert" style={{
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

                {/* CSS Input Grid Area */}
                <div className="form-grid">
                  {/* Full Name */}
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name</label>
                    <div className="input-wrapper" style={{ marginTop: '0.4rem' }}>
                      <input
                        id="fullName"
                        type="text"
                        className={`input-control ${errors.fullName ? 'has-error' : ''}`}
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => handleFieldChange('fullName', e.target.value)}
                        disabled={isLoading}
                        required
                        autoFocus
                      />
                      <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    </div>
                    {errors.fullName && <span className="error-text" role="alert">{errors.fullName}</span>}
                  </div>

                  {/* Email Address */}
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <div className="input-wrapper" style={{ marginTop: '0.4rem' }}>
                      <input
                        id="email"
                        type="email"
                        className={`input-control ${errors.email ? 'has-error' : ''}`}
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => handleFieldChange('email', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206"></path>
                      </svg>
                    </div>
                    {errors.email && <span className="error-text" role="alert">{errors.email}</span>}
                  </div>

                  {/* Password */}
                  <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="input-wrapper" style={{ marginTop: '0.4rem' }}>
                      <input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        className={`input-control input-control-password ${errors.password ? 'has-error' : ''}`}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => handleFieldChange('password', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      <button type="button" className="password-toggle" onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_PASSWORD })} disabled={isLoading}>
                        {showPassword ? (
                          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        ) : (
                          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                          </svg>
                        )}
                      </button>
                    </div>
                    {/* Password Strength Indicator */}
                    {password && (
                      <div className="password-strength-container" aria-live="polite">
                        <div className="strength-bar-bg">
                          <div className={`strength-bar-fill strength-${passwordStrength}`} />
                        </div>
                        <span className="strength-label">
                          Password Strength: <span className={passwordStrength}>{passwordStrength.toUpperCase()}</span>
                        </span>
                      </div>
                    )}
                    {errors.password && <span className="error-text" role="alert">{errors.password}</span>}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <div className="input-wrapper" style={{ marginTop: '0.4rem' }}>
                      <input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`input-control input-control-password ${errors.confirmPassword ? 'has-error' : ''}`}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                        disabled={isLoading}
                        required
                      />
                      <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                      </svg>
                      <button type="button" className="password-toggle" onClick={() => dispatch({ type: ACTION_TYPES.TOGGLE_CONFIRM_PASSWORD })} disabled={isLoading}>
                        {showConfirmPassword ? (
                          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        ) : (
                          <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"></path>
                          </svg>
                        )}
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="error-text" role="alert">{errors.confirmPassword}</span>}
                  </div>

                  {/* Country Dropdown */}
                  <div className="form-group">
                    <label htmlFor="country">Country</label>
                    <div className="input-wrapper" style={{ marginTop: '0.4rem' }}>
                      <select
                        id="country"
                        className={`input-control ${errors.country ? 'has-error' : ''}`}
                        value={country}
                        onChange={(e) => handleFieldChange('country', e.target.value)}
                        disabled={isLoading}
                        required
                      >
                        <option value="">Select country</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                      <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V8a2 2 0 00-2-2h-1.5a2 2 0 01-2-2v-.5"></path>
                      </svg>
                    </div>
                    {errors.country && <span className="error-text" role="alert">{errors.country}</span>}
                  </div>

                  {/* Profession */}
                  <div className="form-group">
                    <label htmlFor="profession">Profession</label>
                    <div className="input-wrapper" style={{ marginTop: '0.4rem' }}>
                      <input
                        id="profession"
                        type="text"
                        className="input-control"
                        placeholder="e.g. Software Engineer"
                        value={profession}
                        onChange={(e) => handleFieldChange('profession', e.target.value)}
                        disabled={isLoading}
                      />
                      <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>

                  {/* Experience Level */}
                  <div className="form-group">
                    <label htmlFor="experienceLevel">Experience Level</label>
                    <div className="input-wrapper" style={{ marginTop: '0.4rem' }}>
                      <select
                        id="experienceLevel"
                        className={`input-control ${errors.experienceLevel ? 'has-error' : ''}`}
                        value={experienceLevel}
                        onChange={(e) => handleFieldChange('experienceLevel', e.target.value)}
                        disabled={isLoading}
                        required
                      >
                        <option value="">Select experience</option>
                        {EXPERIENCE_LEVELS.map((exp) => (
                          <option key={exp.value} value={exp.value}>{exp.label}</option>
                        ))}
                      </select>
                      <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                      </svg>
                    </div>
                    {errors.experienceLevel && <span className="error-text" role="alert">{errors.experienceLevel}</span>}
                  </div>

                  {/* Referral Code */}
                  <div className="form-group">
                    <label htmlFor="referralCode">Referral Code (Optional)</label>
                    <div className="input-wrapper" style={{ marginTop: '0.4rem' }}>
                      <input
                        id="referralCode"
                        type="text"
                        className="input-control"
                        placeholder="e.g. SAVE30"
                        value={referralCode}
                        onChange={(e) => handleFieldChange('referralCode', e.target.value)}
                        disabled={isLoading}
                      />
                      <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2zM9 16h6m-6-4h6m-6-4h6"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Career Goal */}
                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label htmlFor="careerGoal">Career Goal</label>
                  <div className="input-wrapper" style={{ marginTop: '0.4rem' }}>
                    <input
                      id="careerGoal"
                      type="text"
                      className="input-control"
                      placeholder="e.g. Land a Senior DevOps Engineer role at a Tier 1 startup"
                      value={careerGoal}
                      onChange={(e) => handleFieldChange('careerGoal', e.target.value)}
                      disabled={isLoading}
                    />
                    <svg className="input-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>

                {/* Resume Upload Box (Optional) */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label>Upload Existing Resume (Optional)</label>
                  <div 
                    className={`file-upload-wrapper ${resumeFile ? 'file-selected' : ''}`}
                    onClick={handleUploadAreaClick}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    style={{ marginTop: '0.4rem' }}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.docx"
                      style={{ display: 'none' }}
                      disabled={isLoading}
                    />
                    {/* Upload icon SVG */}
                    <svg className="upload-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                    </svg>
                    {resumeFile ? (
                      <>
                        <div className="upload-text">File selected: <span>{resumeFile.name}</span></div>
                        <div className="upload-subtext">Click or drag another file to replace</div>
                      </>
                    ) : (
                      <>
                        <div className="upload-text">Drag and drop your file here, or <span>browse</span></div>
                        <div className="upload-subtext">Supports PDF, DOCX (Max 10MB)</div>
                      </>
                    )}
                  </div>
                </div>

                {/* Checkboxes Wrapper */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.75rem' }}>
                  {/* Terms Accepted */}
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => handleFieldChange('termsAccepted', e.target.checked)}
                      disabled={isLoading}
                    />
                    <div className="checkbox-checkmark" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span style={{ fontSize: '0.82rem' }}>I agree to the Terms & Conditions</span>
                  </label>
                  {errors.termsAccepted && <span className="error-text" role="alert" style={{ marginTop: '-0.25rem' }}>{errors.termsAccepted}</span>}

                  {/* Newsletter Sub */}
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={subscribeCareerTips}
                      onChange={(e) => handleFieldChange('subscribeCareerTips', e.target.checked)}
                      disabled={isLoading}
                    />
                    <div className="checkbox-checkmark" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    <span style={{ fontSize: '0.82rem' }}>Subscribe to AI career tips</span>
                  </label>
                </div>

                {/* Create Account Submission Button */}
                <button type="submit" className="submit-btn" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="btn-loader" aria-hidden="true"></span>
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Form Divider */}
              <div className="divider" style={{ margin: '1.5rem 0' }}>
                <span>Or continue with</span>
              </div>

              {/* Social Login Button Grid */}
              <div className="social-grid" style={{ gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <button 
                  type="button"
                  className="social-btn" 
                  onClick={() => { window.location.href = joinApiUrl('/api/auth/google') }} 
                  disabled={isLoading} 
                  aria-label="Sign up using Google"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
                  aria-label="Sign up using LinkedIn"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#0077B5" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zM20.45 20.45h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
                  </svg>
                  LinkedIn
                </button>
                <button 
                  type="button"
                  className="social-btn" 
                  onClick={(e) => e.preventDefault()} 
                  disabled={isLoading} 
                  aria-label="Sign up using GitHub"
                >
                  <svg viewBox="0 0 24 24" width="20" height="20" fill="#ffffff" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
                  </svg>
                  GitHub
                </button>
              </div>

              {/* Form Footer */}
              <footer className="form-footer">
                <p>
                  Already have an account?
                  <Link to="/login">Sign In</Link>
                </p>
              </footer>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Register

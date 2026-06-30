import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { generateReport, getReportDetails } from '../services/report.api'
import InterviewReportViewer from '../components/InterviewReportViewer'
import Navbar from '../components/Navbar'
import '../dashboard.scss' // Dashboard stylesheets

/**
 * Dashboard Component - The main interface where users input details,
 * trigger the AI analysis service, and review/download their reports.
 */
const Dashboard = () => {
  const { user, handleLogout } = useAuth()
  const location = useLocation()

  // Form inputs and analysis states
  const [jobDescription, setJobDescription] = useState('')
  const [resumeText, setResumeText] = useState('')
  const [selfDescription, setSelfDescription] = useState('')
  const [report, setReport] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  // Check if we need to load a report from router state (history retrieval)
  useEffect(() => {
    if (location.state?.reportId) {
      const loadReport = async () => {
        setIsLoading(true)
        setErrorMsg('')
        setReport(null)
        try {
          const data = await getReportDetails(location.state.reportId)
          if (data && data.report) {
            setReport(data.report)
          } else {
            throw new Error('No report content returned from database')
          }
        } catch (err) {
          console.error('Error loading report from state:', err)
          setErrorMsg(`Failed to load historical report: ${err.message}`)
        } finally {
          setIsLoading(false)
        }
      }
      loadReport()
    }
  }, [location.state])

  // Extract first letter of name for the profile circle icon fallback
  const firstLetter = user?.username ? user.username.charAt(0) : 'U'

  // Submit Handler for AI Analysis
  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMsg('')
    setReport(null)

    try {
      const data = await generateReport(jobDescription, resumeText, selfDescription)
      if (data && data.report) {
        setReport(data.report)
      } else {
        throw new Error('No report content returned from backend')
      }
    } catch (err) {
      console.error('Error generating report:', err)
      const message = err.response?.data?.message || err.message || 'API request failed'
      setErrorMsg(`Failed to generate report: ${message}. Please ensure your backend server is running and your Gemini API key is correct.`)
    } finally {
      setIsLoading(false)
    }
  }

  // Clear current report to run a new generation
  const handleBackToForm = () => {
    setReport(null)
    setErrorMsg('')
  }

  return (
    <div className="dashboard-layout">
      {/* Premium Glassmorphic Navbar */}
      <Navbar />

      {/* Main content body */}
      {report && (
        <div className="back-btn-row">
          <button type="button" className="back-link-btn" onClick={handleBackToForm}>
            <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Generator
          </button>
        </div>
      )}

      <main className="dashboard-content">
        {report ? (
          // Renders the generated AI report card and PDF button
          <InterviewReportViewer report={report} />
        ) : isLoading ? (
          // Loading spinner card
          <div className="ai-loader-card">
            <div className="loader-spinner"></div>
            <h2>Analyzing your profile with AI...</h2>
            <p>
              We are cross-referencing your resume against the target role requirements, calculating ATS compatibility, and generating tailored interview prep plans. This takes about 10–15 seconds.
            </p>
          </div>
        ) : (
          // Input Form Card
          <div className="report-form-card">
            <div className="welcome-header">
              <h2>Welcome, {user?.username || 'User'}!</h2>
            </div>
            <h1>Analyze Resume & ATS Score</h1>
            <p className="form-subtext">
              Enter your resume details and the target job description to generate a structured compatibility report.
            </p>

            {errorMsg && (
              <div className="error-banner" role="alert">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="jd-input">
                  Job Description <span className="req-star">*</span>
                </label>
                <textarea
                  id="jd-input"
                  className="form-textarea"
                  placeholder="Paste the target job description requirements here..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="resume-input">
                  Resume Text <span className="req-star">*</span>
                </label>
                <textarea
                  id="resume-input"
                  className="form-textarea"
                  placeholder="Paste your plain-text resume here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="self-input">Self Description (Optional)</label>
                <textarea
                  id="self-input"
                  className="form-textarea"
                  placeholder="Tell us about yourself or add extra focus areas (e.g., 'Focusing on backend roles')."
                  value={selfDescription}
                  onChange={(e) => setSelfDescription(e.target.value)}
                />
              </div>

              <button type="submit" className="generate-btn">
                Generate ATS & Interview Report
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default Dashboard

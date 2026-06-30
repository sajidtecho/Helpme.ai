import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import { getUserReports } from '../../dashboard/services/report.api'
import Navbar from '../../dashboard/components/Navbar'
import '../profile.scss'

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

/**
 * Profile - Comprehensive page showing user details modification and ATS report history.
 */
const Profile = () => {
  const { user, handleLogout, handleUpdateProfile } = useAuth()
  const navigate = useNavigate()

  // Form input states
  const [username, setUsername] = useState(user?.username || '')
  const [country, setCountry] = useState(user?.country || '')
  const [profession, setProfession] = useState(user?.profession || '')
  const [experienceLevel, setExperienceLevel] = useState(user?.experienceLevel || '')
  const [careerGoal, setCareerGoal] = useState(user?.careerGoal || '')

  // UI state indicators
  const [isSaving, setIsSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  
  // Reports history state
  const [reports, setReports] = useState([])
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)

  // Sync user state on load or change
  useEffect(() => {
    if (user) {
      setUsername(user.username || '')
      setCountry(user.country || '')
      setProfession(user.profession || '')
      setExperienceLevel(user.experienceLevel || '')
      setCareerGoal(user.careerGoal || '')
    }
  }, [user])

  // Load report history on component mount
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getUserReports()
        if (response && response.reports) {
          setReports(response.reports)
        }
      } catch (err) {
        console.error('Failed to load report history:', err)
      } finally {
        setIsLoadingHistory(false)
      }
    }
    fetchHistory()
  }, [])

  // Handle Form Submission
  const handleSubmitProfile = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setSuccessMsg('')
    setErrorMsg('')

    if (!username.trim()) {
      setErrorMsg('Username is required')
      setIsSaving(false)
      return
    }

    try {
      await handleUpdateProfile({
        username,
        country,
        profession,
        experienceLevel,
        careerGoal,
      })
      setSuccessMsg('Profile settings updated successfully!')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to update profile settings.')
    } finally {
      setIsSaving(false)
    }
  }

  // Get score bracket for badge color-coding
  const getScoreClass = (score) => {
    if (score < 50) return 'low'
    if (score < 80) return 'medium'
    return 'high'
  }

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Extract first letter of username for avatar fallback
  const avatarLetter = username ? username.charAt(0) : 'U'

  return (
    <div className="profile-layout">
      {/* Premium Glassmorphic Navbar */}
      <Navbar />

      {/* Profile dashboard split container */}
      <main className="profile-container">
        
        {/* Left column: Profile Details Card */}
        <section className="profile-card">
          <h2>Profile Details</h2>
          <form className="settings-form" onSubmit={handleSubmitProfile} noValidate>
            
            {/* Avatar Preview Section */}
            <div className="avatar-preview-section">
              {user?.avatar ? (
                <img src={user.avatar} alt={`${username}'s avatar`} className="avatar-img" />
              ) : (
                <div className="avatar-circle">{avatarLetter}</div>
              )}
              <span className="provider-badge">Provider: {user?.authProvider || 'Local'}</span>
            </div>

            {/* Alert Notifications */}
            {successMsg && <div className="alert alert-success">{successMsg}</div>}
            {errorMsg && <div className="alert alert-error">{errorMsg}</div>}

            {/* Username Input */}
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                className="input-control"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSaving}
                required
              />
            </div>

            {/* Email Input (Disabled/Read-only) */}
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="input-control"
                value={user?.email || ''}
                disabled
              />
            </div>

            {/* Country Dropdown */}
            <div className="form-group">
              <label htmlFor="country">Country</label>
              <select
                id="country"
                className="input-control"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                disabled={isSaving}
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Profession Input */}
            <div className="form-group">
              <label htmlFor="profession">Profession</label>
              <input
                id="profession"
                type="text"
                className="input-control"
                placeholder="e.g. Software Engineer"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                disabled={isSaving}
              />
            </div>

            {/* Experience Level Dropdown */}
            <div className="form-group">
              <label htmlFor="experienceLevel">Experience Level</label>
              <select
                id="experienceLevel"
                className="input-control"
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                disabled={isSaving}
              >
                <option value="">Select experience</option>
                {EXPERIENCE_LEVELS.map((exp) => (
                  <option key={exp.value} value={exp.value}>{exp.label}</option>
                ))}
              </select>
            </div>

            {/* Career Goal Input */}
            <div className="form-group">
              <label htmlFor="careerGoal">Career Goal</label>
              <input
                id="careerGoal"
                type="text"
                className="input-control"
                placeholder="e.g. Land a Senior Tech role"
                value={careerGoal}
                onChange={(e) => setCareerGoal(e.target.value)}
                disabled={isSaving}
              />
            </div>

            <button type="submit" className="save-btn" disabled={isSaving}>
              {isSaving ? 'Saving Changes...' : 'Save Settings'}
            </button>
          </form>
        </section>

        {/* Right column: Report History Card */}
        <section className="profile-card history-section">
          <h2>ATS Scan History</h2>

          {isLoadingHistory ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                border: '3px solid rgba(255, 255, 255, 0.1)',
                borderTopColor: '#2563EB',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
            </div>
          ) : reports.length === 0 ? (
            <div className="no-history-card">
              <svg className="history-empty-icon" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
              </svg>
              <h4>No scan history found</h4>
              <p>You haven't run any resume analyses yet. Scan your first resume against a job description now.</p>
              <Link to="/dashboard" className="start-analysis-btn">Scan Resume</Link>
            </div>
          ) : (
            <div className="reports-table-wrapper">
              <table className="reports-table">
                <thead>
                  <tr>
                    <th>Target Role</th>
                    <th>Match Score</th>
                    <th>Scan Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {reports.map((report) => (
                    <tr key={report._id}>
                      <td className="role-cell" title={report.jobDescription}>
                        {report.jobDescription}
                      </td>
                      <td>
                        <span className={`score-badge ${getScoreClass(report.score)}`}>
                          {report.score}%
                        </span>
                      </td>
                      <td className="date-cell">
                        {formatDate(report.createdAt)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="action-btn"
                          onClick={() => navigate('/dashboard', { state: { reportId: report._id } })}
                          aria-label={`View analysis for ${report.jobDescription.slice(0, 20)}`}
                        >
                          View
                          <svg className="btn-arrow" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"></path>
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Profile

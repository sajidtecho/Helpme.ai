import React from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import Navbar from '../../dashboard/components/Navbar'
import '../home.scss'

/**
 * Home - Default landing screen for HelpMe.AI.
 * Promotes features, handles login navigation states, and provides premium layout aesthetics.
 */
const Home = () => {
  const { user } = useAuth()

  return (
    <div className="home-layout">
      {/* Background glow orbs */}
      <div className="bg-ambient" aria-hidden="true">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
        <div className="orb orb-3"></div>
      </div>

      {/* Navigation Header */}
      <Navbar />

      {/* Hero section */}
      <main className="hero-container">
        <div className="hero-badge">
          <svg className="sparkle-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
          </svg>
          AI-Powered Recruitment Analytics
        </div>

        <h1 className="hero-title">
          Tailor your resume with <span>AI intelligence</span> to beat the ATS.
        </h1>
        
        <p className="hero-subtitle">
          Instantly scan your resume against target job descriptions, calculate compatibility matching scores, identify critical keyword gaps, and receive tailored 7-day interview study roadmaps.
        </p>

        <div className="cta-row">
          {user ? (
            <>
              <Link to="/dashboard" className="btn-primary">
                Analyze Resume Now
              </Link>
              <Link to="/profile" className="btn-secondary">
                View Profile
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn-primary">
                Get Started Free
              </Link>
              <Link to="/login" className="btn-secondary">
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Feature Grid highlights */}
        <section className="features-grid" aria-label="Core Application Features">
          <div className="feature-card">
            <div className="icon-wrapper" aria-hidden="true">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3>ATS Compatibility Score</h3>
            <p>Obtain instant scoring breakdowns verifying how well your resume matches key indicators inside target descriptions.</p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper" aria-hidden="true">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h3>Keyword Gap Analysis</h3>
            <p>Pinpoint critical missing skills, tools, and technical keywords categorized dynamically by impact and severity.</p>
          </div>

          <div className="feature-card">
            <div className="icon-wrapper" aria-hidden="true">
              <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h3>7-Day Study Roadmap</h3>
            <p>Follow a progressive preparation schedule containing daily tasks and references specifically designed to close your skill gaps.</p>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Home

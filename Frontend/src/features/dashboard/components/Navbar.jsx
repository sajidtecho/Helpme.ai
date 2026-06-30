import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import logoImg from '../../../assets/logo-v3.png'

/**
 * Navbar - Shared navigation bar component containing responsive navigation links,
 * logo routing, active route markers, and a premium dropdown profile menu wrapping
 * the Dashboard, Login, Register, and Logout controls.
 */
const Navbar = () => {
  const { user, handleLogout } = useAuth()
  const location = useLocation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Close dropdown on route change
  useEffect(() => {
    setIsDropdownOpen(false)
  }, [location.pathname])

  const firstLetter = user?.username ? user.username.charAt(0) : 'U'

  return (
    <nav className="navbar" role="navigation" aria-label="Main Navigation">
      <div className="nav-logo">
        <Link to="/">
          <img src={logoImg} alt="HelpMe.Ai Logo" className="logo-img" style={{ cursor: 'pointer' }} />
        </Link>
      </div>

      {/* Navigation links in center */}
      <div className="nav-links">
        <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
          Home
        </Link>
        {user && (
          <Link to="/profile" className={`nav-link ${location.pathname === '/profile' ? 'active' : ''}`}>
            Profile
          </Link>
        )}
      </div>

      <div className="nav-actions">
        <div className="profile-menu-container" ref={dropdownRef} style={{ position: 'relative' }}>
          {user ? (
            <>
              <div 
                className="profile-group" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Toggle profile menu"
                role="button"
                tabIndex="0"
                style={{ cursor: 'pointer' }}
              >
                <div className="profile-avatar" aria-hidden="true">
                  {firstLetter}
                </div>
                <span className="profile-name">{user.username}</span>
                <svg 
                  className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                  style={{ marginLeft: '4px', transition: 'transform 0.2s ease', transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>

              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <Link to="/dashboard" className="dropdown-item">
                    <svg className="dropdown-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    Dashboard
                  </Link>
                  <Link to="/profile" className="dropdown-item">
                    <svg className="dropdown-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    My Profile
                  </Link>
                  <hr className="dropdown-divider" />
                  <button 
                    onClick={handleLogout} 
                    className="dropdown-item logout-item"
                    style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
                  >
                    <svg className="dropdown-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <div 
                className="profile-group guest" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-label="Toggle guest menu"
                role="button"
                tabIndex="0"
                style={{ cursor: 'pointer' }}
              >
                <div className="profile-avatar guest-avatar" aria-hidden="true" style={{ background: 'rgba(255, 255, 255, 0.08)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span className="profile-name">Guest</span>
                <svg 
                  className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`} 
                  width="12" 
                  height="12" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.5"
                  style={{ marginLeft: '4px', transition: 'transform 0.2s ease', transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }}
                >
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </div>

              {isDropdownOpen && (
                <div className="profile-dropdown">
                  <Link to="/login" className="dropdown-item">
                    <svg className="dropdown-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Login
                  </Link>
                  <Link to="/register" className="dropdown-item">
                    <svg className="dropdown-icon" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Register
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

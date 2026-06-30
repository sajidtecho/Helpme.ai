import React, { useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import './report-viewer.scss';

/**
 * InterviewReportViewer - Renders AI analysis report with premium interactive features.
 */
const InterviewReportViewer = ({ report }) => {
  const reportRef = useRef();

  // 1. Practice Mode State
  const [practiceMode, setPracticeMode] = useState(true);
  const [revealedQuestions, setRevealedQuestions] = useState({});
  const [expandedQuestions, setExpandedQuestions] = useState({});

  // 2. Skill Gap Filter Tab State
  const [activeGapTab, setActiveGapTab] = useState('all');

  // 3. Prep Roadmap Checkbox State
  const [completedSteps, setCompletedSteps] = useState({});

  if (!report) return null;

  // Circular Score Calculations
  const scoreVal = report.score || 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreVal / 100) * circumference;

  // Determine Score Color
  const getScoreColor = (score) => {
    if (score < 50) return '#ef4444'; // Red
    if (score < 80) return '#f59e0b'; // Amber
    return '#10b981'; // Green
  };
  const scoreColor = getScoreColor(scoreVal);

  // Filter Skill Gaps
  const totalGaps = report.skillGap?.length || 0;
  const highGaps = report.skillGap?.filter(g => g.severity?.toLowerCase() === 'high').length || 0;
  const mediumGaps = report.skillGap?.filter(g => g.severity?.toLowerCase() === 'medium').length || 0;
  const lowGaps = report.skillGap?.filter(g => g.severity?.toLowerCase() === 'low').length || 0;

  const filteredGaps = report.skillGap?.filter((gap) => {
    if (activeGapTab === 'all') return true;
    return gap.severity?.toLowerCase() === activeGapTab;
  }) || [];

  // Toggle Questions Expanded State
  const toggleExpand = (id) => {
    setExpandedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Question Answer Reveal
  const toggleReveal = (id, e) => {
    e.stopPropagation(); // Avoid triggering expand toggle
    setRevealedQuestions(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Toggle Prep Day Task Completion
  const toggleStep = (idx) => {
    setCompletedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Progress percentage calculation
  const totalSteps = report.preparationPlan?.length || 0;
  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const prepProgress = totalSteps > 0 ? Math.round((completedCount / totalSteps) * 100) : 0;

  // PDF Download Trigger
  const handleDownloadPDF = () => {
    const element = reportRef.current;
    
    const opt = {
      margin:       0.4,
      filename:     `HelpMeAI_Report_Score_${scoreVal}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { 
        scale: 2, 
        useCORS: true,
        backgroundColor: '#ffffff'
      },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' },
      pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
    };

    // Apply PDF style overrides
    element.classList.add('printing-pdf');

    html2pdf()
      .from(element)
      .set(opt)
      .save()
      .then(() => {
        element.classList.remove('printing-pdf');
      })
      .catch((err) => {
        console.error('PDF export error:', err);
        element.classList.remove('printing-pdf');
      });
  };

  return (
    <div className="report-viewer-container">
      {/* Dynamic Controls bar */}
      <div className="action-bar-row">
        <div className="practice-mode-switch">
          <label className="switch-container">
            <input 
              type="checkbox" 
              checked={practiceMode} 
              onChange={() => setPracticeMode(!practiceMode)} 
            />
            <span className="slider-round"></span>
          </label>
          <span className="switch-label">Practice Mode {practiceMode ? 'ON' : 'OFF'}</span>
        </div>

        <button type="button" className="download-pdf-btn" onClick={handleDownloadPDF}>
          <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
          </svg>
          Download PDF
        </button>
      </div>

      {/* PDF Document Container */}
      <div className="report-document" ref={reportRef} id="report-pdf-content">
        
        {/* Brand/Logo Document Header */}
        <header className="doc-header">
          <div className="doc-brand">HelpMe.Ai</div>
          <div className="doc-header-main">
            <div className="header-info">
              <h1>Interview Analysis Report</h1>
              <div className="metadata-grid">
                <div className="meta-item">
                  <strong>Role Profile:</strong> {report.jobDescription || 'N/A'}
                </div>
                <div className="meta-item">
                  <strong>Candidate Profile:</strong> {report.selfDescription || 'N/A'}
                </div>
              </div>
            </div>

            {/* Circular Gauge Score */}
            <div className="circular-score-wrapper">
              <svg className="score-ring" width="100" height="100">
                <circle 
                  className="ring-bg" 
                  cx="50" 
                  cy="50" 
                  r={radius} 
                />
                <circle 
                  className="ring-fg" 
                  cx="50" 
                  cy="50" 
                  r={radius} 
                  stroke={scoreColor}
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="score-inner-text">
                <span className="score-num">{scoreVal}%</span>
                <span className="score-lbl">MATCH</span>
              </div>
            </div>
          </div>
        </header>

        {/* Section 1: Executive Summary */}
        <section className="doc-section section-overall">
          <h2>1. Executive Summary</h2>
          <p className="overall-text">{report.overall}</p>
        </section>

        {/* Section 2 & 3: Strengths and Weaknesses */}
        <section className="doc-section section-split">
          <div className="split-column column-strengths">
            <h2>2. Core Strengths</h2>
            <ul className="strength-list">
              {report.strength && report.strength.map((str, idx) => (
                <li key={idx}>✅ {typeof str === 'object' ? str.strength : str}</li>
              ))}
            </ul>
          </div>
          <div className="split-column column-weaknesses">
            <h2>3. Areas for Improvement</h2>
            <ul className="weakness-list">
              {report.weakness && report.weakness.map((wk, idx) => (
                <li key={idx}>⚠️ {typeof wk === 'object' ? wk.weakness : wk}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 4: Skill Gaps (Filterable) */}
        <section className="doc-section page-break-before">
          <div className="section-title-row">
            <h2>4. Skill Gap Analysis</h2>
            
            {/* Filter Tabs (Hidden in PDF) */}
            <div className="tab-group" role="tablist" aria-label="Filter Gaps by Severity">
              <button 
                type="button" 
                className={`tab-btn ${activeGapTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveGapTab('all')}
              >
                All ({totalGaps})
              </button>
              <button 
                type="button" 
                className={`tab-btn ${activeGapTab === 'high' ? 'active' : ''}`}
                onClick={() => setActiveGapTab('high')}
              >
                High ({highGaps})
              </button>
              <button 
                type="button" 
                className={`tab-btn ${activeGapTab === 'medium' ? 'active' : ''}`}
                onClick={() => setActiveGapTab('medium')}
              >
                Medium ({mediumGaps})
              </button>
              <button 
                type="button" 
                className={`tab-btn ${activeGapTab === 'low' ? 'active' : ''}`}
                onClick={() => setActiveGapTab('low')}
              >
                Low ({lowGaps})
              </button>
            </div>
          </div>

          {filteredGaps.length > 0 ? (
            <div className="table-wrapper">
              <table className="gap-table">
                <thead>
                  <tr>
                    <th>Skill Name</th>
                    <th>Severity Rating</th>
                    <th>Gap Explanation</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredGaps.map((gap, idx) => (
                    <tr key={idx} className="gap-row-item">
                      <td className="skill-name"><strong>{gap.skill}</strong></td>
                      <td>
                        <span className={`severity-badge ${gap.severity?.toLowerCase()}`}>
                          {gap.severity}
                        </span>
                      </td>
                      <td>{gap.explanation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-gaps-msg">No skill gaps matching the selected severity tab.</p>
          )}
        </section>

        {/* Section 5: Technical Questions (Accordions) */}
        <section className="doc-section page-break-before">
          <h2>5. Technical Interview Practice</h2>
          <div className="question-list">
            {report.technicalQuestion && report.technicalQuestion.map((q, idx) => {
              const qId = `tech-${idx}`;
              const isExpanded = !!expandedQuestions[qId];
              const isRevealed = !practiceMode || !!revealedQuestions[qId];

              return (
                <div className={`q-card ${isExpanded ? 'expanded' : ''}`} key={idx} onClick={() => toggleExpand(qId)}>
                  <div className="q-header">
                    <div className="q-title-area">
                      <span className="expand-chevron"></span>
                      <h3>Q{idx + 1}: {q.question}</h3>
                    </div>
                    <div className="q-badges">
                      <span className="q-rating">Rating: {q.rating}%</span>
                      {practiceMode && (
                        <button 
                          type="button" 
                          className={`reveal-btn ${isRevealed ? 'revealed' : ''}`}
                          onClick={(e) => toggleReveal(qId, e)}
                        >
                          {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={`q-collapsible-body ${isExpanded ? 'show' : ''}`}>
                    <div className="q-body-inner">
                      <p><strong>Intent:</strong> {q.intention}</p>
                      
                      <div className={`answer-box ${isRevealed ? 'revealed' : 'blurred'}`}>
                        {!isRevealed && (
                          <div className="blur-overlay" onClick={(e) => toggleReveal(qId, e)}>
                            <span>Click to reveal Sample Answer & Feedback</span>
                          </div>
                        )}
                        <p><strong>Sample Answer:</strong> {q.answer}</p>
                        <p className="q-feedback"><strong>AI Feedback:</strong> {q.feedback}</p>
                      </div>
                      
                      <p className="q-meta-conf"><strong>Confidence Recommendation:</strong> {q.confidenceScore}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 6: Behavioral Questions (Accordions) */}
        <section className="doc-section page-break-before">
          <h2>6. Behavioral Interview Practice</h2>
          <div className="question-list">
            {report.behaviouralQuestion && report.behaviouralQuestion.map((q, idx) => {
              const qId = `beh-${idx}`;
              const isExpanded = !!expandedQuestions[qId];
              const isRevealed = !practiceMode || !!revealedQuestions[qId];

              return (
                <div className={`q-card ${isExpanded ? 'expanded' : ''}`} key={idx} onClick={() => toggleExpand(qId)}>
                  <div className="q-header">
                    <div className="q-title-area">
                      <span className="expand-chevron"></span>
                      <h3>Q{idx + 1}: {q.question}</h3>
                    </div>
                    <div className="q-badges">
                      <span className="q-rating">Rating: {q.rating}%</span>
                      {practiceMode && (
                        <button 
                          type="button" 
                          className={`reveal-btn ${isRevealed ? 'revealed' : ''}`}
                          onClick={(e) => toggleReveal(qId, e)}
                        >
                          {isRevealed ? 'Hide Answer' : 'Reveal Answer'}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className={`q-collapsible-body ${isExpanded ? 'show' : ''}`}>
                    <div className="q-body-inner">
                      <p><strong>Intent:</strong> {q.intention}</p>
                      
                      <div className={`answer-box ${isRevealed ? 'revealed' : 'blurred'}`}>
                        {!isRevealed && (
                          <div className="blur-overlay" onClick={(e) => toggleReveal(qId, e)}>
                            <span>Click to reveal Sample Answer & Feedback</span>
                          </div>
                        )}
                        <p><strong>Sample Answer:</strong> {q.answer}</p>
                        <p className="q-feedback"><strong>AI Feedback:</strong> {q.feedback}</p>
                      </div>
                      
                      <p className="q-meta-conf"><strong>Confidence Recommendation:</strong> {q.confidenceScore}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 7: Preparation Plan (Trackable Roadmap) */}
        <section className="doc-section page-break-before">
          <div className="section-title-row">
            <h2>7. 7-Day Targeted Preparation Plan</h2>
            
            {/* Interactive Progress Bar */}
            <div className="prep-progress-wrapper">
              <span className="progress-lbl">Roadmap Completion: {prepProgress}%</span>
              <div className="progress-track">
                <div className="progress-bar-fill" style={{ width: `${prepProgress}%` }}></div>
              </div>
            </div>
          </div>

          <div className="prep-roadmap">
            {report.preparationPlan && report.preparationPlan.map((plan, idx) => {
              const isChecked = !!completedSteps[idx];

              return (
                <div className={`roadmap-step ${isChecked ? 'completed' : ''}`} key={idx}>
                  {/* Step Completion Checkbox */}
                  <div className="step-checkbox-wrapper">
                    <input 
                      type="checkbox" 
                      id={`step-chk-${idx}`}
                      checked={isChecked}
                      onChange={() => toggleStep(idx)}
                      className="step-checkbox"
                    />
                  </div>

                  <div className="step-badge">Day {idx + 1}</div>
                  
                  <div className="step-content">
                    <h3>{plan.topic}</h3>
                    <p><strong>Daily Goal:</strong> {plan.task}</p>
                    <p><strong>Study Focus:</strong> {plan.description}</p>
                    <p><strong>Reference Resources:</strong> {plan.resources?.join(', ')}</p>
                    <div className="step-meta">
                      <span className="meta-conf">Target Confidence: {plan.confidence}</span>
                      <span className="meta-status">Day Status: {isChecked ? 'COMPLETED' : plan.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default InterviewReportViewer;

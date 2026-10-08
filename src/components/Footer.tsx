import React from 'react'
import { ArrowRight, ExternalLink, Mail, CheckCircle2 } from 'lucide-react'

const GithubIcon: React.FC<{ size?: number; className?: string }> = ({ size = 16, className = '' }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    aria-hidden="true"
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
)

export const Footer: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <footer className="footer" id="contact" aria-label="Site Footer">
      <div className="container footer-container">
        
        {/* ================================================================
            TOP BANNER: WORK WITH WHATBREAKS & OPEN SOURCE CARDS
            ================================================================ */}
        <div className="footer-callout-grid">
          {/* Card 1: Work with WhatBreaks */}
          <div className="footer-callout-card">
            <div className="footer-callout-header">
              <div className="footer-callout-badge mono">WORK WITH WHATBREAKS</div>
              <Mail size={16} className="text-muted" />
            </div>
            <p className="footer-callout-text">
              For questions, partnerships, collaboration, or early access:
            </p>
            <div className="footer-callout-contact">
              <a 
                href="mailto:aaradhy@whatbreaks.dev" 
                className="footer-email-address mono"
                title="Send email to aaradhy@whatbreaks.dev"
              >
                aaradhy@whatbreaks.dev
              </a>
            </div>
            <div className="footer-callout-action">
              <a
                href="mailto:aaradhy@whatbreaks.dev"
                className="btn btn-primary footer-cta-btn"
                aria-label="Email aaradhy@whatbreaks.dev"
              >
                <span>Email us</span>
                <ArrowRight size={14} />
              </a>
            </div>
          </div>

          {/* Card 2: Open Source GitHub */}
          <div className="footer-callout-card">
            <div className="footer-callout-header">
              <div className="footer-callout-badge mono">OPEN SOURCE</div>
              <GithubIcon size={16} className="text-muted" />
            </div>
            <p className="footer-callout-text">
              Inspect our dependency graph engine, explore Kubernetes impact models, or contribute on GitHub.
            </p>
            <div className="footer-callout-contact">
              <a
                href="https://github.com/aaradhychinche-alt/WhatBreaks"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-repo-link mono"
                title="Open official WhatBreaks GitHub repository"
              >
                github.com/aaradhychinche-alt/WhatBreaks
              </a>
            </div>
            <div className="footer-callout-action">
              <a
                href="https://github.com/aaradhychinche-alt/WhatBreaks"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary footer-cta-btn footer-github-btn"
                aria-label="Open WhatBreaks GitHub repository in a new tab"
              >
                <span>GitHub ↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* ================================================================
            MAIN FOOTER CONTENT & NAVIGATION
            ================================================================ */}
        <div className="footer-main-grid">
          {/* Left Column: Brand, Tagline, Availability, Direct Contact */}
          <div className="footer-brand-column">
            <div className="footer-brand">
              <span className="logo-glyph" aria-hidden="true" style={{ width: '16px', height: '16px' }}>
                <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="11" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
                  <rect x="6" y="11" width="6" height="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
              <span className="footer-logo mono">WHATBREAKS</span>
            </div>

            <p className="footer-tagline">
              Know what breaks before you change it.
            </p>

            <div className="footer-v1-pill mono">
              <span className="v1-dot"></span>
              <span>Kubernetes V1 available now.</span>
            </div>

            <div className="footer-work-with-us">
              <span className="footer-work-label text-muted">Work with us:</span>
              <a 
                href="mailto:aaradhy@whatbreaks.dev" 
                className="footer-direct-mail mono"
              >
                aaradhy@whatbreaks.dev
              </a>
            </div>

            <div className="footer-quick-buttons">
              <a
                href="mailto:aaradhy@whatbreaks.dev"
                className="btn btn-sm btn-primary footer-pill-btn"
              >
                <span>Email us →</span>
              </a>
              <a
                href="https://github.com/aaradhychinche-alt/WhatBreaks"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-secondary footer-pill-btn"
              >
                <span>GitHub ↗</span>
              </a>
            </div>
          </div>

          {/* Right Columns: Footer Navigation */}
          <nav className="footer-nav-grid" aria-label="Footer Navigation">
            {/* Column 1: Product Navigation */}
            <div className="footer-nav-col">
              <span className="footer-nav-heading mono">PRODUCT</span>
              <ul className="footer-nav-list">
                <li>
                  <button type="button" className="footer-link" onClick={() => scrollTo('product')}>
                    Product
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => scrollTo('change')}>
                    The Change
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => scrollTo('blast-radius')}>
                    Blast Radius
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => scrollTo('dashboard')}>
                    Dashboard
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Engine & Tools Navigation */}
            <div className="footer-nav-col">
              <span className="footer-nav-heading mono">ENGINE</span>
              <ul className="footer-nav-list">
                <li>
                  <button type="button" className="footer-link" onClick={() => scrollTo('how-it-works')}>
                    How it works
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => scrollTo('cli')}>
                    CLI
                  </button>
                </li>
                <li>
                  <button type="button" className="footer-link" onClick={() => scrollTo('kubernetes')}>
                    Kubernetes V1
                  </button>
                </li>
                <li>
                  <a
                    href="https://github.com/aaradhychinche-alt/WhatBreaks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link footer-link-external"
                    title="Official WhatBreaks GitHub Repository"
                  >
                    <span>GitHub</span>
                    <ExternalLink size={12} className="footer-ext-icon" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Ecosystem */}
            <div className="footer-nav-col">
              <span className="footer-nav-heading mono">GET IN TOUCH</span>
              <ul className="footer-nav-list">
                <li>
                  <a
                    href="mailto:aaradhy@whatbreaks.dev"
                    className="footer-link footer-link-highlight mono"
                  >
                    aaradhy@whatbreaks.dev
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/aaradhychinche-alt/WhatBreaks"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-link footer-link-external"
                  >
                    <span>GitHub ↗</span>
                  </a>
                </li>
                <li className="footer-nav-note text-dim mono">
                  <CheckCircle2 size={11} className="inline-icon text-healthy" /> Pre-merge cluster validation
                </li>
              </ul>
            </div>
          </nav>
        </div>

        {/* ================================================================
            BOTTOM BAR: COPYRIGHT & METADATA
            ================================================================ */}
        <div className="footer-bottom-bar">
          <div className="footer-copyright mono">
            © 2026 WhatBreaks, Inc. All rights reserved.
          </div>
          <div className="footer-status-indicator mono text-dim">
            <span className="status-dot healthy"></span>
            <span>Kubernetes V1 · Pre-deploy Resiliency Engine</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

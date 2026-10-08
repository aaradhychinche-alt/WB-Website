import { ArrowRight, ExternalLink } from 'lucide-react'
import { HeroDependencySimulation } from './HeroDependencySimulation'

export const HeroSection: React.FC = () => {
  const scrollToDashboard = () => {
    const el = document.getElementById('dashboard')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero-section" id="product">
      <div className="container hero-grid">
        {/* Left Column: Calm, Confident Editorial Typography */}
        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            <span className="mono">INFRASTRUCTURE IMPACT ANALYSIS</span>
          </div>

          <h1 className="hero-headline">
            Know what breaks<br />
            before you change it.
          </h1>

          <p className="hero-subhead">
            WhatBreaks analyzes your infrastructure dependencies and predicts the
            impact of your changes before they reach production.
          </p>

          <div className="hero-cta-group">
            <button
              type="button"
              className="btn btn-primary"
              onClick={scrollToDashboard}
            >
              <span>Analyze a change</span>
              <ArrowRight size={15} />
            </button>

            <a
              href="https://github.com/aaradhychinche-alt/WhatBreaks"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary"
            >
              <span>View on GitHub</span>
              <ExternalLink size={14} className="text-muted" />
            </a>
          </div>
        </div>

        {/* Right Column: The ONE continuously running dependency simulation */}
        <div className="hero-visual">
          <HeroDependencySimulation />
        </div>
      </div>
    </section>
  )
}


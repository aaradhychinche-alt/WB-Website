import React from 'react'

export const ChaosDistinctionSection: React.FC = () => {
  return (
    <section className="chaos-distinction-section" id="distinction">
      <div className="container">
        <div className="chaos-box panel">
          <div className="section-eyebrow mono" style={{ justifyContent: 'center' }}>
            PRODUCT PHILOSOPHY
          </div>

          <h2 className="chaos-title">
            Not another chaos experiment.
          </h2>

          <p className="chaos-intro text-secondary">
            WhatBreaks introduces a fundamental paradigm shift for infrastructure reliability.
          </p>

          <div className="chaos-comparison-grid">
            <div className="chaos-col chaos-col-legacy">
              <span className="mono text-muted chaos-col-tag">CHAOS ENGINEERING</span>
              <div className="chaos-question">
                “What happens if we break X?”
              </div>
              <p className="chaos-desc text-muted">
                Injects artificial latency, packet loss, or instance terminations into running staging or production
                environments to observe steady-state resilience after systems are already deployed.
              </p>
            </div>

            <div className="chaos-col-divider" aria-hidden="true" />

            <div className="chaos-col chaos-col-whatbreaks">
              <span className="mono text-primary chaos-col-tag">WHATBREAKS IMPACT ANALYSIS</span>
              <div className="chaos-question text-primary">
                “Before we change X, what depends on it and what could break?”
              </div>
              <p className="chaos-desc text-secondary">
                Deterministically models dependencies, configuration bindings, and protocol contracts before code is applied,
                preventing unmitigated blast radius before anything reaches production.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

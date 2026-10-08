import React, { useState } from 'react'
import { HOW_IT_WORKS_STEPS } from '../mockData'
import { CheckCircle2, ChevronRight } from 'lucide-react'

export const HowItWorksSection: React.FC = () => {
  const [selectedIdx, setSelectedIdx] = useState(0)
  const current = HOW_IT_WORKS_STEPS[selectedIdx]

  return (
    <section className="how-it-works-section" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow mono">SYSTEM ARCHITECTURE</div>
          <h2 className="section-title">How WhatBreaks works.</h2>
          <p className="section-subtitle">
            A deterministic, graph-theoretic pipeline that intercepts infrastructure
            changes at PR time and evaluates downstream blast radius before execution.
          </p>
        </div>

        <div className="how-it-works-grid">
          {/* Left Column: Interactive 5 Steps */}
          <div className="steps-list" role="tablist" aria-label="How WhatBreaks Works Steps">
            {HOW_IT_WORKS_STEPS.map((item, idx) => {
              const isActive = selectedIdx === idx
              return (
                <button
                  key={item.step}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`step-card ${isActive ? 'step-card-active' : ''}`}
                  onClick={() => setSelectedIdx(idx)}
                >
                  <div className="step-card-left">
                    <span className="step-number mono">{item.step}</span>
                  </div>
                  <div className="step-card-content">
                    <div className="step-card-title mono">{item.title}</div>
                    <div className="step-card-heading">{item.heading}</div>
                  </div>
                  <ChevronRight size={16} className={`step-card-arrow ${isActive ? 'text-primary' : 'text-dim'}`} />
                </button>
              )
            })}
          </div>

          {/* Right Column: Dynamic Deep-Dive Artifact Display */}
          <div className="step-display-panel panel" role="tabpanel">
            <div className="panel-header">
              <div className="step-panel-tag mono">
                <span>PHASE {current.step}</span>
                <span className="text-dim">/</span>
                <span className="text-secondary">{current.badgeText}</span>
              </div>
              <span className="badge badge-neutral mono">STEP 0{selectedIdx + 1} OF 05</span>
            </div>

            <div className="step-panel-body">
              <h3 className="step-panel-heading">{current.heading}</h3>
              <p className="step-panel-desc">{current.description}</p>

              {/* Realistic Technical Artifact Preview */}
              <div className="step-tech-box">
                <div className="step-tech-box-header">
                  <span className="mono text-muted" style={{ fontSize: '11px' }}>
                    {selectedIdx === 0 && 'TERRAFORM / MANIFEST DELTA'}
                    {selectedIdx === 1 && 'DEPENDENCY GRAPH TRAVERSAL'}
                    {selectedIdx === 2 && 'BLAST RADIUS & CONFLICT RULES'}
                    {selectedIdx === 3 && 'ACTIONABLE REMEDIATION & DIFFS'}
                    {selectedIdx === 4 && 'DEPLOYMENT VERIFICATION GATE'}
                  </span>
                </div>

                <div className="step-tech-code mono">
                  {selectedIdx === 0 && (
                    <pre>
{`~ resource "aws_rds_cluster" "primary" {
    engine         = "aurora-postgresql"
-   engine_version = "15.4"
+   engine_version = "16.1"
    apply_immediately = false
  }`}
                    </pre>
                  )}

                  {selectedIdx === 1 && (
                    <pre>
{`[Graph Traversal: PostgreSQL:16.1]
  Hop 1: auth-service (direct connection pool, pgx)
  Hop 2: redis (session cache write path)
  Hop 2: billing-service (transaction pool, pgbouncer)
  Hop 3: worker-service (asynchronous event consumer)`}
                    </pre>
                  )}

                  {selectedIdx === 2 && (
                    <pre>
{`[Conflict Rules Evaluated: 34 rules]
  FAIL: rule/pg-scram-sha256 (auth-service pg@8.7.1 incompatible)
  WARN: rule/pool-timeout-drift (billing-service timeout 5000ms < 6200ms)
  PASS: rule/ssl-cipher-suites (tls 1.3 negotiated successfully)`}
                    </pre>
                  )}

                  {selectedIdx === 3 && (
                    <pre>
{`[Remediation Plan]
  1. Upgrade client library in auth-service:
     npm i pg@^8.11.3 && npm test
  2. Increase connection pool timeout in billing-service:
     connectionTimeoutMillis: 5000 -> 10000`}
                    </pre>
                  )}

                  {selectedIdx === 4 && (
                    <pre>
{`WhatBreaks CI Gate: APPROVED
  ✓ All 3 blocking violations resolved
  ✓ Compatibility verified across 7 dependencies
  ✓ Safe to apply in production (us-east-1)`}
                    </pre>
                  )}
                </div>
              </div>

              {/* Technical Details Checklist */}
              <div className="step-tech-list">
                <div className="step-tech-list-title mono">TECHNICAL IMPLEMENTATION</div>
                {current.technicalDetails.map((detail, dIdx) => (
                  <div key={dIdx} className="step-tech-item">
                    <CheckCircle2 size={14} className="text-muted" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

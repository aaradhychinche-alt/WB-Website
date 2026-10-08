import React, { useState } from 'react'
import { ArrowDown, Database, GitBranch, AlertTriangle, ShieldAlert } from 'lucide-react'

export const ConnectedSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number>(0)

  const steps = [
    {
      id: 'change',
      label: 'CHANGE',
      icon: Database,
      title: 'PostgreSQL 15 → 16',
      sub: 'Proposed engine version bump in Terraform plan',
      detail: 'A minor or major database version upgrade introduces new SSL renegotiation standards, stricter timestamp casting, and updated default collation tables.'
    },
    {
      id: 'dependencies',
      label: 'DEPENDENCY MAPPING',
      icon: GitBranch,
      title: '7 dependencies traced',
      sub: 'Direct connection pools, read replicas, and pub/sub queues',
      detail: 'Traversing the live topology reveals 3 direct microservice connections, 2 replica streaming slots, 1 batch worker connection, and 1 caching layer interface.'
    },
    {
      id: 'affected',
      label: 'IMPACT EVALUATION',
      icon: AlertTriangle,
      title: '3 affected services',
      sub: 'Auth Service, Billing Service, Worker Service',
      detail: 'Auth Service uses an outdated database driver (pgx v4) lacking SCRAM-SHA-256 support. Billing Service pool settings are incompatible with new connection overhead.'
    },
    {
      id: 'risk',
      label: 'BLAST RADIUS',
      icon: ShieldAlert,
      title: '1 high-risk path',
      sub: 'Cascading login outage within 180s of cutover',
      detail: 'If applied unmitigated, Auth Service fails to authenticate incoming requests from API Gateway, dropping global login throughput to zero.'
    }
  ]

  return (
    <section className="connected-section" id="connected">
      <div className="container">
        <div className="connected-header">
          <div className="section-eyebrow mono">TOPOLOGY CASCADE</div>
          <h2 className="connected-title">Infrastructure is connected.</h2>
          <p className="connected-subtitle">
            A change to one resource can affect services, configurations, and
            dependencies far beyond the original change.
          </p>
        </div>

        {/* Visual Cascade Flow */}
        <div className="cascade-grid">
          {steps.map((step, idx) => {
            const Icon = step.icon
            const isSelected = activeStep === idx

            return (
              <div key={step.id} className="cascade-item-wrapper">
                <button
                  type="button"
                  className={`cascade-card ${isSelected ? 'cascade-card-active' : ''}`}
                  onClick={() => setActiveStep(idx)}
                >
                  <div className="cascade-card-top">
                    <span className="cascade-label mono">{step.label}</span>
                    <Icon size={16} className={isSelected ? 'text-primary' : 'text-muted'} />
                  </div>
                  <div className="cascade-card-title">{step.title}</div>
                  <div className="cascade-card-sub text-muted">{step.sub}</div>
                </button>

                {idx < steps.length - 1 && (
                  <div className="cascade-arrow" aria-hidden="true">
                    <ArrowDown size={14} className="text-muted" />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Dynamic Detail Panel */}
        <div className="cascade-detail-panel">
          <div className="cascade-detail-label mono">
            {steps[activeStep].label} ANALYSIS · STEP 0{activeStep + 1}
          </div>
          <p className="cascade-detail-text">
            {steps[activeStep].detail}
          </p>
        </div>
      </div>
    </section>
  )
}

import React from 'react'
import { Eye, GitCommit, ShieldCheck, Cpu } from 'lucide-react'

export const SecurityTrustSection: React.FC = () => {
  const pillars = [
    {
      icon: Eye,
      title: 'Understand changes before deployment',
      description: 'Infrastructure changes should never be a leap of faith. By simulating impact prior to applying changes, engineers replace guesswork with deterministic verification.'
    },
    {
      icon: GitCommit,
      title: 'Trace deep multi-hop dependencies',
      description: 'Modern architectures fail in the shadows between services. WhatBreaks surfaces implicit ties—from database connection limits to pub/sub protocol changes.'
    },
    {
      icon: ShieldCheck,
      title: 'Reduce unexpected blast radius',
      description: 'Isolate potential failures to known boundaries. Prevent single-resource modifications from cascading across unrelated customer-facing APIs.'
    },
    {
      icon: Cpu,
      title: 'Deploy infrastructure with confidence',
      description: 'Give platform teams and service owners a shared, reproducible language for evaluating change safety during pull request reviews.'
    }
  ]

  return (
    <section className="security-trust-section" id="security">
      <div className="container">
        <div className="trust-grid">
          <div className="trust-editorial">
            <div className="section-eyebrow mono">DESIGN PHILOSOPHY</div>
            <h2 className="trust-headline">
              Engineered for systems where downtime is unacceptable.
            </h2>
            <p className="trust-subhead">
              WhatBreaks operates offline and declaratively. It does not require invasive production
              daemons or write access to your cloud clusters. It reads your intended state, analyzes
              the topological consequences, and equips your team with actionable engineering insight.
            </p>
          </div>

          <div className="trust-cards-column">
            {pillars.map((pillar, idx) => {
              const Icon = pillar.icon
              return (
                <div key={idx} className="trust-card panel">
                  <div className="trust-card-header">
                    <Icon size={16} className="text-secondary" />
                    <h3 className="trust-card-title">{pillar.title}</h3>
                  </div>
                  <p className="trust-card-desc text-muted">{pillar.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

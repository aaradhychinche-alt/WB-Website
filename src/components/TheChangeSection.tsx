import React, { useState } from 'react'
import { ArrowRight, Database, GitBranch, AlertTriangle, ShieldAlert } from 'lucide-react'

export const TheChangeSection: React.FC = () => {
  const [activeItem, setActiveItem] = useState<number>(0)

  const items = [
    {
      id: 'change',
      stepNumber: '01',
      title: 'PostgreSQL 15 → 16',
      label: 'PROPOSED CHANGE',
      icon: Database,
      summary: 'Terraform plan upgrade on production primary database cluster',
      detail: 'An infrastructure pull request bumps the Aurora PostgreSQL engine version. While the change appears isolated to one RDS resource, the runtime protocol and authentication requirements ripple through connection pools across every dependent service.'
    },
    {
      id: 'dependencies',
      stepNumber: '02',
      title: '7 dependencies',
      label: 'DISCOVERED RELATIONSHIPS',
      icon: GitBranch,
      summary: 'Direct client connection pools, caching layers, and worker queues',
      detail: 'WhatBreaks walks the dependency graph to map 3 direct service connections (Auth, Billing, User), 2 streaming replica slots, 1 Redis session write pipeline, and 1 asynchronous queue consumer.'
    },
    {
      id: 'affected',
      stepNumber: '03',
      title: '3 affected services',
      label: 'IMPACT EVALUATION',
      icon: AlertTriangle,
      summary: 'Auth Service, Billing Service, Worker Service',
      detail: 'Auth Service uses an outdated database driver unable to negotiate SCRAM-SHA-256 passwords. Billing Service transaction pool timeouts conflict with the new database handshake overhead.'
    },
    {
      id: 'risk',
      stepNumber: '04',
      title: '1 high-risk path',
      label: 'CRITICAL PROPAGATION',
      icon: ShieldAlert,
      summary: 'Global authentication outage within 180s of deployment',
      detail: 'If deployed without updating the Auth Service client driver, login requests will fail globally, causing cascading timeouts upstream to API Gateway.'
    }
  ]

  return (
    <section className="the-change-section" id="change">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow mono">THE PROPAGATION PROBLEM</div>
          <h2 className="section-title">A change rarely stays where it starts.</h2>
          <p className="section-subtitle">
            A single version bump or configuration modification can affect services,
            connection pools, and dependencies far beyond the originating resource.
          </p>
        </div>

        {/* Change Flow Visualization */}
        <div className="the-change-flow">
          {items.map((item, idx) => {
            const Icon = item.icon
            const isSelected = activeItem === idx

            return (
              <React.Fragment key={item.id}>
                <button
                  type="button"
                  className={`the-change-card ${isSelected ? 'the-change-card-active' : ''}`}
                  onClick={() => setActiveItem(idx)}
                >
                  <div className="change-card-top">
                    <span className="mono text-muted" style={{ fontSize: '10px' }}>{item.label}</span>
                    <Icon size={15} className={isSelected ? 'text-primary' : 'text-dim'} />
                  </div>
                  <div className="change-card-title">{item.title}</div>
                  <div className="change-card-sub text-muted">{item.summary}</div>
                </button>

                {idx < items.length - 1 && (
                  <div className="the-change-arrow" aria-hidden="true">
                    <ArrowRight size={14} className="text-dim" />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>

        {/* Deep Dive Information Box */}
        <div className="the-change-detail panel">
          <div className="detail-tag mono">
            {items[activeItem].label} · ANALYSIS DETAIL
          </div>
          <p className="detail-text">
            {items[activeItem].detail}
          </p>
        </div>
      </div>
    </section>
  )
}

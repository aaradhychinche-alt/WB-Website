import React, { useState } from 'react'

interface BlastItem {
  id: string
  name: string
  type: string
  dependencyType: 'Origin' | 'Direct dependency' | 'Indirect dependency' | 'Upstream router'
  riskLevel: 'ORIGIN' | 'HIGH' | 'MEDIUM' | 'LOW' | 'HEALTHY'
  conflict: string | null
  failurePath: string
  callers: string
}

export const BlastRadiusSection: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string>('auth')

  const items: BlastItem[] = [
    {
      id: 'postgres',
      name: 'PostgreSQL 16.1',
      type: 'Database (Aurora)',
      dependencyType: 'Origin',
      riskLevel: 'ORIGIN',
      conflict: 'Major version upgrade: SCRAM-SHA-256 required, SSL renegotiation timeout adjusted',
      failurePath: 'Originating resource for the proposed infrastructure delta',
      callers: '3 direct connection pools, 2 replica streams'
    },
    {
      id: 'auth',
      name: 'Auth Service',
      type: 'Authentication (Node.js)',
      dependencyType: 'Direct dependency',
      riskLevel: 'HIGH',
      conflict: 'Client library pg@8.7.1 incompatible with PostgreSQL 16 default SCRAM handshake',
      failurePath: 'Direct database connection failure on startup; cascading 503 errors to API Gateway',
      callers: '1,420 rps from API Gateway / mobile clients'
    },
    {
      id: 'billing',
      name: 'Billing Service',
      type: 'Payments (Go)',
      dependencyType: 'Direct dependency',
      riskLevel: 'HIGH',
      conflict: 'Transaction pool timeout set to 5000ms; PG 16 cold connection SSL takes 6200ms',
      failurePath: 'Connection pool starvation during Stripe invoice reconciliation batches',
      callers: '380 rps from Stripe webhooks & worker queues'
    },
    {
      id: 'redis',
      name: 'Redis Cache',
      type: 'Cache Cluster',
      dependencyType: 'Indirect dependency',
      riskLevel: 'MEDIUM',
      conflict: 'Session key expiration synchronization mismatch during database retry storm',
      failurePath: 'Thundering herd on fallback query paths when PostgreSQL connections retry',
      callers: 'Auth Service session token read/write'
    },
    {
      id: 'worker',
      name: 'Worker Service',
      type: 'Background Workers (Python)',
      dependencyType: 'Indirect dependency',
      riskLevel: 'MEDIUM',
      conflict: 'Deprecated implicit timestamp string casting in batch reconciliation SQL',
      failurePath: 'Job retries overflow RabbitMQ dead-letter exchange',
      callers: 'Scheduled cron tasks & async queues'
    },
    {
      id: 'analytics',
      name: 'Analytics Service',
      type: 'Event Streaming (ClickHouse/Kafka)',
      dependencyType: 'Indirect dependency',
      riskLevel: 'LOW',
      conflict: 'Logical replication protocol slot renegotiation required',
      failurePath: 'Telemetry stream experiences 300s lag during replica promotion',
      callers: 'Internal metric ingestion'
    },
    {
      id: 'user',
      name: 'User Service',
      type: 'Directory (Rust)',
      dependencyType: 'Direct dependency',
      riskLevel: 'HEALTHY',
      conflict: null,
      failurePath: 'tokio-postgres client already uses SCRAM-SHA-256; zero breaking drift detected',
      callers: 'Internal microservice RPC calls'
    }
  ]

  const active = items.find((i) => i.id === selectedId) || items[1]

  return (
    <section className="blast-radius-section" id="blast-radius">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow mono">IMPACT DELINEATION</div>
          <h2 className="section-title">See what the change touches.</h2>
          <p className="section-subtitle">
            WhatBreaks differentiates direct dependencies from cascading downstream risks,
            identifying exactly which microservices, connection pools, and client drivers will be impacted.
          </p>
        </div>

        <div className="blast-layout panel">
          {/* Left: Interactive Topology List */}
          <div className="blast-topology-list">
            <div className="blast-list-header mono text-muted">
              <span>RESOURCE</span>
              <span>DEPENDENCY TYPE</span>
              <span>STATUS</span>
            </div>

            <div className="blast-items">
              {items.map((item) => {
                const isSelected = selectedId === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`blast-item-row ${isSelected ? 'blast-item-row-active' : ''}`}
                    onClick={() => setSelectedId(item.id)}
                  >
                    <div className="blast-item-name">
                      <strong>{item.name}</strong>
                      <span className="mono text-muted blast-item-type">{item.type}</span>
                    </div>

                    <div className="mono text-secondary blast-item-deptype">
                      {item.dependencyType}
                    </div>

                    <div>
                      <span
                        className={`badge ${
                          item.riskLevel === 'ORIGIN'
                            ? 'badge-warning'
                            : item.riskLevel === 'HIGH'
                            ? 'badge-risk'
                            : item.riskLevel === 'MEDIUM'
                            ? 'badge-warning'
                            : item.riskLevel === 'LOW'
                            ? 'badge-neutral'
                            : 'badge-healthy'
                        }`}
                      >
                        {item.riskLevel}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right: Focused Inspection Card */}
          <div className="blast-inspect-pane">
            <div className="blast-inspect-top">
              <div>
                <span className="mono text-muted" style={{ fontSize: '10px' }}>
                  {active.dependencyType.toUpperCase()}
                </span>
                <h3 className="blast-inspect-title">{active.name}</h3>
                <span className="mono text-secondary" style={{ fontSize: '12px' }}>
                  Type: {active.type}
                </span>
              </div>

              <span
                className={`badge ${
                  active.riskLevel === 'HIGH'
                    ? 'badge-risk'
                    : active.riskLevel === 'MEDIUM' || active.riskLevel === 'ORIGIN'
                    ? 'badge-warning'
                    : 'badge-healthy'
                }`}
                style={{ fontSize: '12px', padding: '6px 12px' }}
              >
                {active.riskLevel}
              </span>
            </div>

            <div className="blast-inspect-body">
              <div className="blast-detail-block">
                <span className="blast-detail-label mono">POTENTIAL FAILURE PATH</span>
                <p className="blast-detail-desc">{active.failurePath}</p>
              </div>

              <div className="blast-detail-block">
                <span className="blast-detail-label mono">CONFIGURATION CONFLICT</span>
                <p className="blast-detail-desc text-secondary">
                  {active.conflict || 'No configuration conflicts identified. Client compatibility verified.'}
                </p>
              </div>

              <div className="blast-detail-block">
                <span className="blast-detail-label mono">EXPOSED TRAFFIC VOLUME</span>
                <p className="blast-detail-desc mono">{active.callers}</p>
              </div>
            </div>

            <div className="blast-inspect-footer">
              <span className="mono text-muted" style={{ fontSize: '11px' }}>
                Select any resource to inspect relationship criticality and failure paths
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

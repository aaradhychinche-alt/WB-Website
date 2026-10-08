import React from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Network,
  ShieldAlert
} from 'lucide-react'
import { SCENARIOS } from '../../mockData'

interface BlastRadiusViewProps {
  selectedScenarioKey: string
  onSelectScenario: (scenarioKey: string) => void
  onNavigateToServices: () => void
  onNavigateToGraph: () => void
}

export const BlastRadiusView: React.FC<BlastRadiusViewProps> = ({
  selectedScenarioKey,
  onSelectScenario,
  onNavigateToServices,
  onNavigateToGraph
}) => {
  const scenario = SCENARIOS[selectedScenarioKey] || SCENARIOS['pg-15-16']

  return (
    <div className="blast-radius-workspace-root">
      {/* Workspace Header */}
      <div className="blast-workspace-header">
        <div className="blast-header-info">
          <div className="blast-header-eyebrow mono text-muted text-xs">
            <span>PROPAGATION DISTANCE ANALYSIS</span>
            <span className="dot-divider">/</span>
            <span>CLUSTER: prod-us-east-1</span>
            <span className="dot-divider">/</span>
            <span className="text-white">TARGET: {scenario.resource}</span>
          </div>
          <h2 className="blast-header-title">Blast Radius Propagation</h2>
          <p className="blast-header-subtitle text-secondary text-xs">
            How far does this change propagate? Traced through declarative Kubernetes manifests, service discovery, and runtime connection pools.
          </p>
        </div>

        {/* Change Scenario Switcher */}
        <div className="blast-scenario-pills">
          <button
            type="button"
            className={`scenario-pill ${selectedScenarioKey === 'pg-15-16' ? 'scenario-pill-active' : ''}`}
            onClick={() => onSelectScenario('pg-15-16')}
          >
            <span className="dot dot-risk" />
            <span>PostgreSQL 15.4 → 16.1</span>
            <span className="badge badge-risk mono" style={{ fontSize: '9px' }}>HIGH</span>
          </button>
          <button
            type="button"
            className={`scenario-pill ${selectedScenarioKey === 'redis-6-7' ? 'scenario-pill-active' : ''}`}
            onClick={() => onSelectScenario('redis-6-7')}
          >
            <span className="dot dot-warning" />
            <span>Redis 6.2 → 7.2</span>
            <span className="badge badge-warning mono" style={{ fontSize: '9px' }}>MED</span>
          </button>
          <button
            type="button"
            className={`scenario-pill ${selectedScenarioKey === 'envoy-minor' ? 'scenario-pill-active' : ''}`}
            onClick={() => onSelectScenario('envoy-minor')}
          >
            <span className="dot dot-healthy" />
            <span>API Gateway 1.27 → 1.28</span>
            <span className="badge badge-healthy mono" style={{ fontSize: '9px' }}>LOW</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div className="blast-kpi-strip panel">
        <div className="blast-kpi-item">
          <span className="kpi-label mono text-xs text-muted">AFFECTED SERVICES</span>
          <span className="kpi-value text-white font-semibold">
            {scenario.summary.affectedServices} services
          </span>
        </div>
        <div className="blast-kpi-item">
          <span className="kpi-label mono text-xs text-muted">CONFIG CONFLICTS</span>
          <span className="kpi-value text-warning font-semibold">
            {scenario.summary.configConflicts} detected
          </span>
        </div>
        <div className="blast-kpi-item">
          <span className="kpi-label mono text-xs text-muted">HIGH-RISK PATHS</span>
          <span className="kpi-value text-risk font-semibold">
            {scenario.summary.highRiskPaths} critical path
          </span>
        </div>
        <div className="blast-kpi-item">
          <span className="kpi-label mono text-xs text-muted">MAX PROPAGATION DEPTH</span>
          <span className="kpi-value text-white font-semibold">
            2 Tiers (Direct + 1-Hop)
          </span>
        </div>
      </div>

      {/* Layered Propagation Distance Diagram */}
      <div className="blast-propagation-flow">
        {/* TIER 0: THE SOURCE / ORIGIN */}
        {/* TIER 0: THE SOURCE / ORIGIN */}
        <div className="blast-tier-block">
          <div className="tier-badge-label mono text-xs">
            <span>TIER 0 · PROPOSED CHANGE ORIGIN</span>
          </div>

          <div className="source-origin-card panel">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {scenario.riskLevel.includes('HIGH') ? (
                  <ShieldAlert size={16} className="text-risk" />
                ) : scenario.riskLevel.includes('MEDIUM') ? (
                  <AlertTriangle size={16} className="text-warning" />
                ) : (
                  <CheckCircle2 size={16} className="text-healthy" />
                )}
                <h4 className="font-semibold text-white text-sm">
                  {scenario.resource}: {scenario.currentVersion} → {scenario.proposedVersion}
                </h4>
              </div>
              <span
                className={`badge ${
                  scenario.riskLevel.includes('HIGH')
                    ? 'badge-risk'
                    : scenario.riskLevel.includes('MEDIUM')
                    ? 'badge-warning'
                    : 'badge-healthy'
                } mono text-xs`}
              >
                {scenario.riskLevel.includes('HIGH')
                  ? 'SOURCE BREAKER'
                  : scenario.riskLevel.includes('MEDIUM')
                  ? 'MODERATE IMPACT ORIGIN'
                  : 'CONTAINED ORIGIN'}
              </span>
            </div>
            <p className="text-secondary text-xs" style={{ marginTop: 6 }}>
              {scenario.riskLevel.includes('HIGH')
                ? 'Primary transactional infrastructure upgrade initiating protocol and handshake changes.'
                : scenario.riskLevel.includes('MEDIUM')
                ? 'In-memory caching and session layer change with bounded operational degradation.'
                : 'Edge ingress proxy configuration update with contained blast boundary and backward-compatible protocols.'}
            </p>
          </div>
        </div>

        {/* Downward Propagation Vector */}
        <div className="propagation-vector-arrow">
          <div className="vector-line" />
          <div className="vector-badge mono text-xs">
            <ArrowDown size={12} />
            <span>DIRECT DEPENDENCY BLAST RADIUS (1-HOP)</span>
          </div>
          <div className="vector-line" />
        </div>

        {/* TIER 1: DIRECT IMPACT */}
        <div className="blast-tier-block">
          <div className="tier-badge-label mono text-xs">
            <span>TIER 1 · DIRECT IMPACT SERVICES ({scenario.riskLevel.includes('LOW') ? 'CONTAINED INTEGRATION' : 'DIRECT BREAKERS'})</span>
          </div>

          <div className="tier-services-grid">
            {scenario.affectedServices
              .filter((s) => s.dependencyType === 'Direct dependency')
              .map((svc) => (
                <div
                  key={svc.id}
                  className={`tier-service-card panel ${
                    svc.risk === 'HIGH'
                      ? 'tier-card-risk'
                      : svc.risk === 'MEDIUM'
                      ? 'tier-card-warning'
                      : 'tier-card-neutral'
                  }`}
                >
                  <div className="tier-service-header">
                    <div>
                      <span
                        className={`badge ${
                          svc.risk === 'HIGH'
                            ? 'badge-risk'
                            : svc.risk === 'MEDIUM'
                            ? 'badge-warning'
                            : 'badge-healthy'
                        } mono text-xs`}
                      >
                        {svc.risk} RISK
                      </span>
                      <h4 className="font-semibold text-white text-sm" style={{ marginTop: 4 }}>
                        {svc.name}
                      </h4>
                    </div>
                    <span className="mono text-muted text-xs">{svc.dependentCallers} req/s</span>
                  </div>

                  <p className="tier-failure-text text-secondary text-xs">
                    {svc.impactReason}
                  </p>

                  <div className="tier-service-footer mono text-xs text-muted">
                    <span>Component: {svc.component}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Downward Propagation Vector */}
        <div className="propagation-vector-arrow">
          <div className="vector-line" />
          <div className="vector-badge mono text-xs">
            <ArrowDown size={12} />
            <span>
              {scenario.affectedServices.some((s) => s.dependencyType === 'Indirect dependency')
                ? 'INDIRECT DEPENDENCY BLAST RADIUS (2-HOPS)'
                : 'INDIRECT BLAST PROPAGATION TERMINATED'}
            </span>
          </div>
          <div className="vector-line" />
        </div>

        {/* TIER 2: INDIRECT IMPACT */}
        <div className="blast-tier-block">
          <div className="tier-badge-label mono text-xs">
            <span>TIER 2 · DOWNSTREAM CONSUMERS & BUFFERS</span>
          </div>

          {scenario.affectedServices.filter((s) => s.dependencyType === 'Indirect dependency').length === 0 ? (
            <div className="panel" style={{ padding: '18px 20px', borderLeft: '3px solid var(--status-healthy)' }}>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-healthy" />
                <h4 className="font-semibold text-white text-sm">No Indirect Downstream Propagation</h4>
              </div>
              <p className="text-secondary text-xs" style={{ marginTop: 6, lineHeight: 1.5 }}>
                Change blast radius terminates at Tier 1 direct integration. 0 indirect downstream services or asynchronous worker queues are impacted.
              </p>
            </div>
          ) : (
            <div className="tier-services-grid">
              {scenario.affectedServices
                .filter((s) => s.dependencyType === 'Indirect dependency')
                .map((svc) => (
                  <div
                    key={svc.id}
                    className={`tier-service-card panel ${
                      svc.risk === 'MEDIUM' ? 'tier-card-warning' : 'tier-card-neutral'
                    }`}
                  >
                    <div className="tier-service-header">
                      <div>
                        <span
                          className={`badge ${
                            svc.risk === 'MEDIUM' ? 'badge-warning' : 'badge-healthy'
                          } mono text-xs`}
                        >
                          {svc.risk} RISK
                        </span>
                        <h4 className="font-semibold text-white text-sm" style={{ marginTop: 4 }}>
                          {svc.name}
                        </h4>
                      </div>
                      <span className="mono text-muted text-xs">{svc.dependentCallers} req/s</span>
                    </div>

                    <p className="tier-failure-text text-secondary text-xs">
                      {svc.impactReason}
                    </p>

                    <div className="tier-service-footer mono text-xs text-muted">
                      <span>Component: {svc.component}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions Footer */}
      <div className="blast-actions-footer panel">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNavigateToServices}
          >
            <span>Inspect All Affected Services Table</span>
            <ArrowRight size={13} />
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onNavigateToGraph}
          >
            <Network size={13} />
            <span>View Topology Graph</span>
          </button>
        </div>

        <span className="mono text-muted text-xs">
          Traced via WhatBreaks Engine V1 · Kubernetes Admission Verified
        </span>
      </div>
    </div>
  )
}

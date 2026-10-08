import React, { useState } from 'react'
import {
  CheckCircle2,
  Clock,
  Layers,
  Network,
  RefreshCw,
  Server,
  Settings,
  Terminal,
  X,
  Zap
} from 'lucide-react'

export const IntegrationsView: React.FC = () => {
  const [showK8sConfigModal, setShowK8sConfigModal] = useState(false)
  const [waitlistSuccess, setWaitlistSuccess] = useState<string | null>(null)

  // Configuration modal state
  const [k8sEndpoint, setK8sEndpoint] = useState('https://k8s-prod.us-east-1.internal:6443')
  const [k8sNamespaces, setK8sNamespaces] = useState('default, production, ingress-nginx')
  const [syncInterval, setSyncInterval] = useState('30s')
  const [admissionGate, setAdmissionGate] = useState(true)
  const [isTestingConnection, setIsTestingConnection] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)

  const handleTestConnection = () => {
    setIsTestingConnection(true)
    setTestResult(null)
    setTimeout(() => {
      setIsTestingConnection(false)
      setTestResult('Connection verified. 184 resources discovered across 3 namespaces.')
    }, 900)
  }

  const handleJoinWaitlist = (name: string) => {
    setWaitlistSuccess(`You've been added to the early access list for ${name}.`)
    setTimeout(() => setWaitlistSuccess(null), 3000)
  }

  return (
    <div className="integrations-workspace-root">
      {/* Workspace Header */}
      <div className="integrations-page-header">
        <div className="integrations-header-text">
          <div className="integrations-eyebrow mono">
            <span>DATA INGESTION PIPELINES</span>
            <span className="dot-divider">/</span>
            <span className="text-white">STATUS: 1 ACTIVE SOURCE</span>
          </div>
          <h2 className="integrations-title">Infrastructure sources</h2>
          <p className="integrations-subtitle">
            Connect WhatBreaks to the systems that define your infrastructure.
            WhatBreaks constructs live dependency graphs by ingesting declarative manifests and runtime cluster state.
          </p>
        </div>

        {waitlistSuccess && (
          <div className="download-toast-alert panel">
            <CheckCircle2 size={14} className="text-healthy" />
            <span className="mono text-xs">{waitlistSuccess}</span>
          </div>
        )}
      </div>

      {/* Prominent V1 Status Banner */}
      <div className="k8s-v1-hero-banner panel">
        <div className="k8s-v1-content">
          <div className="flex items-center gap-2">
            <span className="badge badge-healthy mono text-xs font-semibold">
              <span className="dot dot-healthy" />
              V1 AVAILABLE NOW
            </span>
            <span className="mono text-xs text-muted">PRIMARY ENGINE FOCUS</span>
          </div>
          <h3 className="k8s-banner-title">Kubernetes Topology Analysis</h3>
          <p className="k8s-banner-desc">
            WhatBreaks V1 focuses exclusively on Kubernetes infrastructure. It continuously syncs Deployments,
            StatefulSets, Services, Endpoints, ConfigMaps, and Ingress routes to trace cross-service blast radius.
            Other sources are currently in active private preview.
          </p>
          <div className="k8s-banner-tags mono text-xs">
            <span className="k8s-tag">K8s API 1.28+</span>
            <span className="k8s-tag">Helm v3</span>
            <span className="k8s-tag">Kustomize</span>
            <span className="k8s-tag">Validating Admission Webhooks</span>
          </div>
        </div>
      </div>

      {/* Grid of Integration Cards */}
      <div className="integrations-grid">
        {/* Kubernetes Card - Connected */}
        <div className="integration-card panel integration-card-active">
          <div className="integration-card-top">
            <div className="integration-icon-wrap k8s-icon-bg">
              <Server size={22} className="text-white" />
            </div>
            <div className="integration-status-pill">
              <span className="badge badge-healthy mono text-xs">
                <span className="dot dot-healthy" />
                AVAILABLE NOW · CONNECTED
              </span>
            </div>
          </div>

          <div className="integration-card-body">
            <h3 className="integration-name">Kubernetes</h3>
            <p className="integration-desc text-muted text-xs">
              Live API cluster agent ingesting objects from namespaces, tracing pod specs, env references, and Service discovery.
            </p>

            <div className="integration-specs-panel mono text-xs">
              <div className="spec-row">
                <span className="spec-label">Cluster</span>
                <span className="spec-val text-white font-semibold">prod-us-east-1</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Discovered</span>
                <span className="spec-val text-white font-semibold">184 resources</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Last Sync</span>
                <span className="spec-val text-healthy font-semibold">2m ago (Healthy)</span>
              </div>
              <div className="spec-row">
                <span className="spec-label">Webhook</span>
                <span className="spec-val text-white">Active (Dry-run)</span>
              </div>
            </div>
          </div>

          <div className="integration-card-footer">
            <button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={() => setShowK8sConfigModal(true)}
            >
              <Settings size={14} />
              <span>Configure Cluster</span>
            </button>
          </div>
        </div>

        {/* Terraform Card - Coming Soon */}
        <div className="integration-card panel integration-card-upcoming">
          <div className="integration-card-top">
            <div className="integration-icon-wrap">
              <Layers size={22} className="text-muted" />
            </div>
            <div className="integration-status-pill">
              <span className="badge badge-neutral mono text-xs">
                COMING SOON
              </span>
            </div>
          </div>

          <div className="integration-card-body">
            <h3 className="integration-name">Terraform & OpenTofu</h3>
            <p className="integration-desc text-muted text-xs">
              Parse HCL plan AST outputs before `terraform apply` to predict blast radius of VPC, RDS, and subnet changes.
            </p>

            <div className="upcoming-eta-box mono text-xs">
              <Clock size={12} className="text-muted" />
              <span>Target: Q1 2027 Preview</span>
            </div>
          </div>

          <div className="integration-card-footer">
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => handleJoinWaitlist('Terraform')}
            >
              <span>Join Waitlist</span>
            </button>
          </div>
        </div>

        {/* Docker Compose Card - Coming Soon */}
        <div className="integration-card panel integration-card-upcoming">
          <div className="integration-card-top">
            <div className="integration-icon-wrap">
              <Terminal size={22} className="text-muted" />
            </div>
            <div className="integration-status-pill">
              <span className="badge badge-neutral mono text-xs">
                COMING SOON
              </span>
            </div>
          </div>

          <div className="integration-card-body">
            <h3 className="integration-name">Docker Compose</h3>
            <p className="integration-desc text-muted text-xs">
              Local developer CLI command `whatbreaks compose` to preview local container dependency impacts before push.
            </p>

            <div className="upcoming-eta-box mono text-xs">
              <Clock size={12} className="text-muted" />
              <span>Target: Q1 2027 Preview</span>
            </div>
          </div>

          <div className="integration-card-footer">
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => handleJoinWaitlist('Docker Compose')}
            >
              <span>Join Waitlist</span>
            </button>
          </div>
        </div>

        {/* AWS Cloud Card - Coming Soon */}
        <div className="integration-card panel integration-card-upcoming">
          <div className="integration-card-top">
            <div className="integration-icon-wrap">
              <Network size={22} className="text-muted" />
            </div>
            <div className="integration-status-pill">
              <span className="badge badge-neutral mono text-xs">
                COMING SOON
              </span>
            </div>
          </div>

          <div className="integration-card-body">
            <h3 className="integration-name">Amazon Web Services (AWS)</h3>
            <p className="integration-desc text-muted text-xs">
              Cross-account IAM policy simulation, Security Group ingress modifications, and Aurora replica cutover prediction.
            </p>

            <div className="upcoming-eta-box mono text-xs">
              <Clock size={12} className="text-muted" />
              <span>Target: Q2 2027 Preview</span>
            </div>
          </div>

          <div className="integration-card-footer">
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => handleJoinWaitlist('AWS')}
            >
              <span>Join Waitlist</span>
            </button>
          </div>
        </div>

        {/* GitHub Card - Coming Soon */}
        <div className="integration-card panel integration-card-upcoming">
          <div className="integration-card-top">
            <div className="integration-icon-wrap">
              <Zap size={22} className="text-muted" />
            </div>
            <div className="integration-status-pill">
              <span className="badge badge-neutral mono text-xs">
                COMING SOON
              </span>
            </div>
          </div>

          <div className="integration-card-body">
            <h3 className="integration-name">GitHub Actions</h3>
            <p className="integration-desc text-muted text-xs">
              Automated PR comment bot that runs WhatBreaks on modified Helm or K8s YAML diffs and blocks risky PRs.
            </p>

            <div className="upcoming-eta-box mono text-xs">
              <Clock size={12} className="text-muted" />
              <span>Target: Q2 2027 Preview</span>
            </div>
          </div>

          <div className="integration-card-footer">
            <button
              type="button"
              className="btn btn-secondary"
              style={{ width: '100%' }}
              onClick={() => handleJoinWaitlist('GitHub Actions')}
            >
              <span>Join Waitlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kubernetes Configure Modal */}
      {showK8sConfigModal && (
        <div className="modal-backdrop" onClick={() => setShowK8sConfigModal(false)}>
          <div className="k8s-config-modal panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="mono text-xs text-muted">SOURCE CONFIGURATION</div>
                <h3 className="modal-title">Kubernetes Cluster Connection</h3>
                <p className="modal-meta mono text-xs text-muted">
                  Agent ID: k8s-agent-us-east-1 · Status: Active
                </p>
              </div>
              <button
                type="button"
                className="close-modal-btn"
                onClick={() => setShowK8sConfigModal(false)}
                aria-label="Close Modal"
              >
                <X size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-field">
                <label className="form-label mono">KUBERNETES APISERVER ENDPOINT</label>
                <input
                  type="text"
                  value={k8sEndpoint}
                  onChange={(e) => setK8sEndpoint(e.target.value)}
                  className="form-input mono"
                />
              </div>

              <div className="form-field">
                <label className="form-label mono">MONITORED NAMESPACES (COMMA-SEPARATED)</label>
                <input
                  type="text"
                  value={k8sNamespaces}
                  onChange={(e) => setK8sNamespaces(e.target.value)}
                  className="form-input mono"
                />
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label className="form-label mono">POLLING INTERVAL</label>
                  <select
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(e.target.value)}
                    className="form-select mono"
                  >
                    <option value="15s">15 seconds</option>
                    <option value="30s">30 seconds (Recommended)</option>
                    <option value="60s">60 seconds</option>
                    <option value="300s">5 minutes</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="form-label mono">ADMISSION WEBHOOK GATE</label>
                  <div
                    className="toggle-box panel"
                    onClick={() => setAdmissionGate(!admissionGate)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="mono text-xs text-white">
                      {admissionGate ? 'Enabled (Dry-run mode)' : 'Disabled'}
                    </span>
                    <span className={`dot ${admissionGate ? 'dot-healthy' : 'dot-risk'}`} />
                  </div>
                </div>
              </div>

              {testResult && (
                <div className="test-success-banner panel">
                  <CheckCircle2 size={14} className="text-healthy" />
                  <span className="mono text-xs text-healthy">{testResult}</span>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleTestConnection}
                disabled={isTestingConnection}
              >
                <RefreshCw size={13} className={isTestingConnection ? 'spin' : ''} />
                <span>{isTestingConnection ? 'Testing...' : 'Test Connection'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowK8sConfigModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowK8sConfigModal(false)}
                >
                  Save Configuration
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

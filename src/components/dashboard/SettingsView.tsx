import React, { useState } from 'react'
import {
  Bell,
  CheckCircle2,
  HardDrive,
  Moon,
  RefreshCw,
  Save,
  Shield,
  Sun
} from 'lucide-react'
import { useTheme } from '../../themeContext'

export const SettingsView: React.FC = () => {
  const { theme, setTheme } = useTheme()

  // Form states with local persistence simulation
  const [workspaceName, setWorkspaceName] = useState('prod-us-east-1')
  const [environment, setEnvironment] = useState<'Production' | 'Staging' | 'Development'>('Production')
  const [riskThreshold, setRiskThreshold] = useState<'STRICT' | 'HIGH' | 'MEDIUM'>('HIGH')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [emailAlerts, setEmailAlerts] = useState(true)
  const [slackAlerts, setSlackAlerts] = useState(true)
  const [pagerdutyAlerts, setPagerdutyAlerts] = useState(false)
  const [notificationEmail, setNotificationEmail] = useState('sre-alerts@company.internal')
  const [maxTraceDepth, setMaxTraceDepth] = useState('4')

  const [savedFeedback, setSavedFeedback] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSavedFeedback(true)
    setTimeout(() => setSavedFeedback(false), 3000)
  }

  return (
    <div className="settings-workspace-root">
      {/* Workspace Header */}
      <div className="settings-page-header">
        <div className="settings-header-text">
          <div className="settings-eyebrow mono">
            <span>PLATFORM CONFIGURATION</span>
            <span className="dot-divider">/</span>
            <span>WORKSPACE: {workspaceName}</span>
          </div>
          <h2 className="settings-title">Settings</h2>
          <p className="settings-subtitle">
            Configure analysis thresholds, environment defaults, automated CI gates, and notification policies.
          </p>
        </div>

        {savedFeedback && (
          <div className="download-toast-alert panel">
            <CheckCircle2 size={14} className="text-healthy" />
            <span className="mono text-xs">Configuration saved successfully.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="settings-form">
        {/* Section 1: Workspace */}
        <div className="settings-card panel">
          <div className="settings-card-header">
            <div className="flex items-center gap-2">
              <HardDrive size={16} className="text-white" />
              <h3 className="settings-card-title">Workspace</h3>
            </div>
            <span className="mono text-xs text-muted">ID: ws_01h8x9p3</span>
          </div>

          <div className="settings-fields-grid">
            <div className="form-field">
              <label className="form-label mono">WORKSPACE NAME</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="form-input mono"
                placeholder="e.g. prod-us-east-1"
                required
              />
              <span className="form-hint text-muted text-xs">
                Unique identifier used in CLI and CI/CD pipelines.
              </span>
            </div>

            <div className="form-field">
              <label className="form-label mono">TARGET ENVIRONMENT</label>
              <select
                value={environment}
                onChange={(e) => setEnvironment(e.target.value as any)}
                className="form-select mono"
              >
                <option value="Production">Production (Strict Gating)</option>
                <option value="Staging">Staging (Warning Permissive)</option>
                <option value="Development">Development (Advisory Only)</option>
              </select>
              <span className="form-hint text-muted text-xs">
                Controls the severity applied when evaluating pull request blockers.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Analysis Engine */}
        <div className="settings-card panel">
          <div className="settings-card-header">
            <div className="flex items-center gap-2">
              <Shield size={16} className="text-white" />
              <h3 className="settings-card-title">Analysis Engine</h3>
            </div>
            <span className="mono text-xs text-muted">ENGINE V1</span>
          </div>

          <div className="settings-fields-grid">
            <div className="form-field">
              <label className="form-label mono">DEFAULT RISK BLOCKING THRESHOLD</label>
              <div className="risk-threshold-options">
                <button
                  type="button"
                  className={`threshold-btn ${riskThreshold === 'HIGH' ? 'threshold-active' : ''}`}
                  onClick={() => setRiskThreshold('HIGH')}
                >
                  <div className="flex items-center gap-2">
                    <span className="dot dot-risk" />
                    <span className="font-semibold text-white text-xs">Block on High Risk</span>
                  </div>
                  <span className="text-muted text-xs" style={{ marginTop: 4, display: 'block' }}>
                    Fails CI check on cascading failures and protocol breaks.
                  </span>
                </button>

                <button
                  type="button"
                  className={`threshold-btn ${riskThreshold === 'MEDIUM' ? 'threshold-active' : ''}`}
                  onClick={() => setRiskThreshold('MEDIUM')}
                >
                  <div className="flex items-center gap-2">
                    <span className="dot dot-warning" />
                    <span className="font-semibold text-white text-xs">Block on Medium or High</span>
                  </div>
                  <span className="text-muted text-xs" style={{ marginTop: 4, display: 'block' }}>
                    Requires SRE override for latency or retry warnings.
                  </span>
                </button>

                <button
                  type="button"
                  className={`threshold-btn ${riskThreshold === 'STRICT' ? 'threshold-active' : ''}`}
                  onClick={() => setRiskThreshold('STRICT')}
                >
                  <div className="flex items-center gap-2">
                    <span className="dot dot-healthy" />
                    <span className="font-semibold text-white text-xs">Strict Zero-Warning Policy</span>
                  </div>
                  <span className="text-muted text-xs" style={{ marginTop: 4, display: 'block' }}>
                    Passes only if 100% of downstream dependencies are unaffected.
                  </span>
                </button>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-field">
                <label className="form-label mono">AUTOMATIC DEPENDENCY REFRESH</label>
                <div
                  className="toggle-box panel"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="toggle-box-text">
                    <div className="font-semibold text-white text-xs">
                      {autoRefresh ? 'Enabled' : 'Disabled'}
                    </div>
                    <div className="text-muted text-xs" style={{ marginTop: 2 }}>
                      Poll Kubernetes cluster every 30 seconds for live changes.
                    </div>
                  </div>
                  <span className={`dot ${autoRefresh ? 'dot-healthy' : 'dot-risk'}`} />
                </div>
              </div>

              <div className="form-field">
                <label className="form-label mono">MAX BLAST RADIUS RECURSION DEPTH</label>
                <div className="select-depth-box">
                  <select
                    value={maxTraceDepth}
                    onChange={(e) => setMaxTraceDepth(e.target.value)}
                    className="depth-select-clean mono"
                  >
                    <option value="2">2 Tiers (Direct + 1st hop)</option>
                    <option value="4">4 Tiers (Recommended default)</option>
                    <option value="6">6 Tiers (Deep Enterprise Mesh)</option>
                  </select>
                  <div className="text-muted text-xs" style={{ marginTop: 4 }}>
                    Maximum graph traversal distance for blast calculation.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Notifications */}
        <div className="settings-card panel">
          <div className="settings-card-header">
            <div className="flex items-center gap-2">
              <Bell size={16} className="text-white" />
              <h3 className="settings-card-title">Notifications & Incident Alerting</h3>
            </div>
            <span className="mono text-xs text-muted">WEBHOOKS & EMAIL</span>
          </div>

          <div className="settings-fields-grid">
            <div className="form-field">
              <label className="form-label mono">NOTIFICATION EMAIL</label>
              <input
                type="email"
                value={notificationEmail}
                onChange={(e) => setNotificationEmail(e.target.value)}
                className="form-input mono"
                required
              />
            </div>

            <div className="checkboxes-stack">
              <label className="checkbox-item panel">
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                />
                <div className="checkbox-content">
                  <span className="checkbox-title text-white font-medium text-xs">
                    Email Digest on High-Risk Analysis Detection
                  </span>
                  <span className="checkbox-sub text-muted text-xs">
                    Send full blast radius breakdown when a PR triggers high risk.
                  </span>
                </div>
              </label>

              <label className="checkbox-item panel">
                <input
                  type="checkbox"
                  checked={slackAlerts}
                  onChange={(e) => setSlackAlerts(e.target.checked)}
                />
                <div className="checkbox-content">
                  <span className="checkbox-title text-white font-medium text-xs">
                    Slack #infra-deployments Bot Integration
                  </span>
                  <span className="checkbox-sub text-muted text-xs">
                    Post interactive decision cards directly to the engineering channel.
                  </span>
                </div>
              </label>

              <label className="checkbox-item panel">
                <input
                  type="checkbox"
                  checked={pagerdutyAlerts}
                  onChange={(e) => setPagerdutyAlerts(e.target.checked)}
                />
                <div className="checkbox-content">
                  <span className="checkbox-title text-white font-medium text-xs">
                    PagerDuty Critical Incident Escalation
                  </span>
                  <span className="checkbox-sub text-muted text-xs">
                    Page the on-call engineer if an unauthorized breaking change merges.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Section 4: Appearance */}
        <div className="settings-card panel">
          <div className="settings-card-header">
            <div className="flex items-center gap-2">
              <Sun size={16} className="text-white" />
              <h3 className="settings-card-title">Appearance</h3>
            </div>
            <span className="mono text-xs text-muted">ACTIVE: {theme.toUpperCase()}</span>
          </div>

          <div className="appearance-theme-picker">
            <button
              type="button"
              className={`theme-card panel ${theme === 'dark' ? 'theme-card-selected' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <div className="theme-card-preview dark-preview">
                <div className="preview-topbar" />
                <div className="preview-content">
                  <div className="preview-sidebar" />
                  <div className="preview-body" />
                </div>
              </div>
              <div className="theme-card-label">
                <Moon size={14} className={theme === 'dark' ? 'text-white' : 'text-muted'} />
                <span className="text-white font-semibold text-xs">Dark Mode (Default)</span>
              </div>
              <span className="text-muted text-xs">
                Deep charcoal #171717 and graphite #202020.
              </span>
            </button>

            <button
              type="button"
              className={`theme-card panel ${theme === 'light' ? 'theme-card-selected' : ''}`}
              onClick={() => setTheme('light')}
            >
              <div className="theme-card-preview light-preview">
                <div className="preview-topbar" />
                <div className="preview-content">
                  <div className="preview-sidebar" />
                  <div className="preview-body" />
                </div>
              </div>
              <div className="theme-card-label">
                <Sun size={14} className={theme === 'light' ? 'text-white' : 'text-muted'} />
                <span className="text-white font-semibold text-xs">Light Mode</span>
              </div>
              <span className="text-muted text-xs">
                Warm off-white #F4F3EE and soft graphite borders.
              </span>
            </button>
          </div>
        </div>

        {/* Form Actions */}
        <div className="settings-actions-footer">
          <button type="submit" className="btn btn-primary">
            <Save size={14} />
            <span>Save Settings</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setWorkspaceName('prod-us-east-1')
              setEnvironment('Production')
              setRiskThreshold('HIGH')
              setAutoRefresh(true)
            }}
          >
            <RefreshCw size={14} />
            <span>Reset to Defaults</span>
          </button>
        </div>
      </form>
    </div>
  )
}

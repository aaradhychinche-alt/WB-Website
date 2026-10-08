import React, { useState } from 'react'
import {
  ChevronDown,
  ExternalLink,
  Layers,
  Menu,
  Network,
  Server,
  Settings,
  Sliders,
  Terminal,
  X
} from 'lucide-react'
import { SCENARIOS } from '../mockData'
import { OverviewView } from './dashboard/OverviewView'
import { ChangesView } from './dashboard/ChangesView'
import { ImpactGraphView } from './dashboard/ImpactGraphView'
import { BlastRadiusView } from './dashboard/BlastRadiusView'
import { AffectedServicesView } from './dashboard/AffectedServicesView'
import { ReportsView } from './dashboard/ReportsView'
import { IntegrationsView } from './dashboard/IntegrationsView'
import { SettingsView } from './dashboard/SettingsView'

export type DashboardNav =
  | 'overview'
  | 'changes'
  | 'graph'
  | 'blast-radius'
  | 'services'
  | 'reports'
  | 'integrations'
  | 'settings'

export const DashboardSection: React.FC = () => {
  const [activeNav, setActiveNav] = useState<DashboardNav>('overview')
  const [selectedScenarioKey, setSelectedScenarioKey] = useState<string>('pg-15-16')
  const [inspectedServiceId, setInspectedServiceId] = useState<string | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const scenario = SCENARIOS[selectedScenarioKey] || SCENARIOS['pg-15-16']

  const handleSelectScenario = (key: string) => {
    setSelectedScenarioKey(key)
    setInspectedServiceId(null)
  }

  const handleNavigate = (nav: string, serviceId?: string) => {
    setActiveNav(nav as DashboardNav)
    if (serviceId) {
      setInspectedServiceId(serviceId)
    }
    setIsMobileSidebarOpen(false)
  }

  return (
    <section className="dashboard-section" id="dashboard">
      <div className="container">
        {/* Section Heading */}
        <div className="section-header">
          <div className="section-eyebrow mono">PRODUCT PLATFORM</div>
          <h2 className="section-title">From change to clarity.</h2>
          <p className="section-subtitle">
            An actual interactive preview of the WhatBreaks impact-analysis platform.
            Every navigation view below is an independent, functional workspace designed for production infrastructure engineering.
          </p>
        </div>

        {/* Global Dashboard Application Shell */}
        <div className="dashboard-app-frame panel">
          {/* Top Bar */}
          <header className="dashboard-topbar">
            <div className="dashboard-topbar-left">
              {/* Mobile hamburger toggle */}
              <button
                type="button"
                className="dashboard-menu-toggle"
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                aria-label="Toggle navigation menu"
              >
                {isMobileSidebarOpen ? <X size={16} /> : <Menu size={16} />}
              </button>

              <span className="app-logo-badge mono">WHATBREAKS</span>
              <span className="topbar-divider">/</span>
              <span className="topbar-project mono">prod-us-east-1</span>
              <span className="topbar-divider">/</span>
              <span className="topbar-analysis mono">analysis-412</span>
              <span className="topbar-divider">/</span>
              <span className="topbar-branch mono">
                upgrade-{scenario.resource.toLowerCase().replace(/\s+/g, '-')}
              </span>
            </div>

            <div className="dashboard-topbar-right">
              <span className="badge badge-neutral mono topbar-env-badge">
                ENV: PRODUCTION
              </span>
              <span className="badge badge-neutral mono topbar-engine-badge">
                ENGINE: V1
              </span>

              {/* User / Workspace Menu */}
              <div className="user-menu-wrap">
                <button
                  type="button"
                  className="user-menu-btn mono text-xs"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-avatar-dot" />
                  <span className="user-name-text">alex.sre</span>
                  <ChevronDown size={11} className="text-muted" />
                </button>

                {userMenuOpen && (
                  <div className="user-menu-dropdown panel" onClick={() => setUserMenuOpen(false)}>
                    <div className="dropdown-user-info">
                      <div className="text-white font-semibold text-xs">alex.sre@company.internal</div>
                      <div className="text-muted mono text-xs">Role: Principal Infrastructure Engineer</div>
                    </div>
                    <div className="dropdown-divider" />
                    <button
                      type="button"
                      className="dropdown-item mono text-xs"
                      onClick={() => setActiveNav('settings')}
                    >
                      Workspace Settings
                    </button>
                    <button
                      type="button"
                      className="dropdown-item mono text-xs"
                      onClick={() => setActiveNav('integrations')}
                    >
                      Connected Sources
                    </button>
                    <div className="dropdown-divider" />
                    <div className="dropdown-item mono text-xs text-muted">
                      Cluster: prod-us-east-1 (v1.28.4)
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Layout: Left Sidebar + Dynamic Content */}
          <div className="dashboard-layout">
            {/* Sidebar Navigation */}
            <aside
              className={`dashboard-sidebar ${isMobileSidebarOpen ? 'sidebar-mobile-open' : ''}`}
              aria-label="Dashboard navigation"
            >
              <div className="sidebar-section-title mono">WORKSPACE</div>

              <button
                type="button"
                className={`sidebar-nav-item ${activeNav === 'overview' ? 'sidebar-nav-item-active' : ''}`}
                onClick={() => handleNavigate('overview')}
              >
                <Layers size={14} />
                <span>Overview</span>
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeNav === 'changes' ? 'sidebar-nav-item-active' : ''}`}
                onClick={() => handleNavigate('changes')}
              >
                <Sliders size={14} />
                <span>Changes</span>
                <span className="sidebar-count mono">3</span>
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeNav === 'graph' ? 'sidebar-nav-item-active' : ''}`}
                onClick={() => handleNavigate('graph')}
              >
                <Network size={14} />
                <span>Impact Graph</span>
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeNav === 'blast-radius' ? 'sidebar-nav-item-active' : ''}`}
                onClick={() => handleNavigate('blast-radius')}
              >
                <Layers size={14} />
                <span>Blast Radius</span>
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeNav === 'services' ? 'sidebar-nav-item-active' : ''}`}
                onClick={() => handleNavigate('services')}
              >
                <Server size={14} />
                <span>Affected Services</span>
                <span className="sidebar-count mono sidebar-count-risk">
                  {scenario.summary.affectedServices}
                </span>
              </button>

              <div className="sidebar-section-title mono" style={{ marginTop: 16 }}>
                ANALYSIS
              </div>

              <button
                type="button"
                className={`sidebar-nav-item ${activeNav === 'reports' ? 'sidebar-nav-item-active' : ''}`}
                onClick={() => handleNavigate('reports')}
              >
                <Terminal size={14} />
                <span>Reports</span>
                <span className="sidebar-count mono">4</span>
              </button>

              <div className="sidebar-section-title mono" style={{ marginTop: 16 }}>
                PLATFORM
              </div>

              <button
                type="button"
                className={`sidebar-nav-item ${activeNav === 'integrations' ? 'sidebar-nav-item-active' : ''}`}
                onClick={() => handleNavigate('integrations')}
              >
                <ExternalLink size={14} />
                <span>Integrations</span>
                <span className="k8s-v1-pill mono">V1</span>
              </button>

              <button
                type="button"
                className={`sidebar-nav-item ${activeNav === 'settings' ? 'sidebar-nav-item-active' : ''}`}
                onClick={() => handleNavigate('settings')}
              >
                <Settings size={14} />
                <span>Settings</span>
              </button>

              {/* Sidebar Footer System Status */}
              <div className="sidebar-footer-card panel">
                <div className="sidebar-footer-status">
                  <span className="dot dot-healthy" />
                  <span className="sidebar-footer-title mono">Cluster Synced</span>
                </div>
                <div className="sidebar-footer-sub mono">
                  184 resources · 2m ago
                </div>
              </div>
            </aside>

            {/* Mobile backdrop for drawer */}
            {isMobileSidebarOpen && (
              <div
                className="sidebar-backdrop"
                onClick={() => setIsMobileSidebarOpen(false)}
              />
            )}

            {/* Main Interactive Workspace Area */}
            <main className="dashboard-main-view" role="region" aria-label="Dashboard view content">
              {activeNav === 'overview' && (
                <OverviewView
                  onSelectScenario={handleSelectScenario}
                  onNavigate={handleNavigate}
                />
              )}

              {activeNav === 'changes' && (
                <ChangesView
                  selectedScenarioKey={selectedScenarioKey}
                  onSelectScenario={handleSelectScenario}
                  onNavigateToGraph={() => setActiveNav('graph')}
                  onNavigateToServices={() => setActiveNav('services')}
                />
              )}

              {activeNav === 'graph' && (
                <ImpactGraphView
                  selectedScenarioKey={selectedScenarioKey}
                  onSelectScenario={handleSelectScenario}
                  onInspectService={(serviceId) => {
                    setInspectedServiceId(serviceId)
                    setActiveNav('services')
                  }}
                />
              )}

              {activeNav === 'blast-radius' && (
                <BlastRadiusView
                  selectedScenarioKey={selectedScenarioKey}
                  onSelectScenario={handleSelectScenario}
                  onNavigateToServices={() => setActiveNav('services')}
                  onNavigateToGraph={() => setActiveNav('graph')}
                />
              )}

              {activeNav === 'services' && (
                <AffectedServicesView
                  selectedScenarioKey={selectedScenarioKey}
                  onSelectScenario={handleSelectScenario}
                  onNavigateToGraph={(svcId) => {
                    if (svcId) setInspectedServiceId(svcId)
                    setActiveNav('graph')
                  }}
                  initialSelectedServiceId={inspectedServiceId}
                />
              )}

              {activeNav === 'reports' && (
                <ReportsView
                  onSelectScenario={handleSelectScenario}
                  onNavigateToChanges={() => setActiveNav('changes')}
                />
              )}

              {activeNav === 'integrations' && (
                <IntegrationsView />
              )}

              {activeNav === 'settings' && (
                <SettingsView />
              )}
            </main>
          </div>
        </div>
      </div>
    </section>
  )
}

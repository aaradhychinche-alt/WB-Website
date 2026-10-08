import React from 'react'
import { CheckCircle2, Clock } from 'lucide-react'

interface IntegrationItem {
  name: string
  category: string
  description: string
  status: 'AVAILABLE NOW' | 'EXPANDING'
}

export const IntegrationsSection: React.FC = () => {
  const primaryIntegration = {
    name: 'Kubernetes',
    category: 'Container Orchestration',
    description: 'V1 is live. Parses manifests, Ingress definitions, ConfigMaps, Secrets, and Custom Resource Definitions to calculate blast radius before apply.',
    status: 'AVAILABLE NOW' as const
  }

  const upcomingIntegrations: IntegrationItem[] = [
    { name: 'Terraform', category: 'Infrastructure as Code', description: 'Parse terraform plan JSON outputs to trace cloud resource dependencies before apply.', status: 'EXPANDING' },
    { name: 'Helm & Kustomize', category: 'Package Management', description: 'Evaluate template values drift and chart dependency version requirements.', status: 'EXPANDING' },
    { name: 'Docker Compose', category: 'Container Workloads', description: 'Inspect local and staging container environment variable bindings and port mapping.', status: 'EXPANDING' },
    { name: 'AWS Cloud', category: 'Cloud Infrastructure', description: 'Map IAM roles, RDS clusters, ElastiCache instances, and SQS/SNS event triggers.', status: 'EXPANDING' },
    { name: 'GitHub Actions', category: 'CI/CD Gate', description: 'Native pull request action that posts blast radius comments and blocks risky merges.', status: 'EXPANDING' },
    { name: 'GitLab CI', category: 'CI/CD Gate', description: 'Pipeline check stages that evaluate policy conformance on merge requests.', status: 'EXPANDING' },
    { name: 'Argo CD', category: 'GitOps Controller', description: 'Pre-sync hooks that validate cluster state impact before automated synchronization.', status: 'EXPANDING' },
    { name: 'Prometheus & Grafana', category: 'Telemetry & Observability', description: 'Correlate live traffic telemetry rates with dependency criticality tiers.', status: 'EXPANDING' }
  ]

  return (
    <section className="integrations-section" id="integrations">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow mono">ECOSYSTEM COVERAGE</div>
          <h2 className="section-title">Built for modern infrastructure.</h2>
          <p className="section-subtitle">
            WhatBreaks V1 is available now for Kubernetes, with dependency analysis
            actively expanding across declarative cloud and infrastructure tooling.
          </p>
        </div>

        {/* Featured Available Now Hero Card */}
        <div className="integration-featured panel">
          <div className="featured-badge-row">
            <span className="badge badge-healthy mono">
              <CheckCircle2 size={12} />
              <span>{primaryIntegration.status}</span>
            </span>
            <span className="mono text-muted" style={{ fontSize: '11px' }}>
              CORE V1 PLATFORM ENGINE
            </span>
          </div>

          <div className="featured-content">
            <h3 className="featured-name">{primaryIntegration.name}</h3>
            <p className="featured-desc text-secondary">{primaryIntegration.description}</p>
          </div>
        </div>

        {/* Expanding Across Ecosystem Grid */}
        <div className="integrations-expanding-header mono text-muted">
          <Clock size={12} />
          <span>EXPANDING ACROSS DECLARATIVE TOOLING</span>
        </div>

        <div className="integrations-grid">
          {upcomingIntegrations.map((item) => (
            <div key={item.name} className="integration-card panel">
              <div className="integration-card-top">
                <span className="integration-name">{item.name}</span>
                <span className="badge badge-neutral mono" style={{ fontSize: '9px' }}>
                  {item.status}
                </span>
              </div>
              <p className="integration-desc text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

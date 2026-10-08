export type RiskLevel = 'HEALTHY' | 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | 'IMPACTED' | 'CONFLICT' | 'DEGRADED'

export interface InfraNode {
  id: string
  name: string
  type: 'gateway' | 'service' | 'database' | 'cache' | 'queue' | 'worker'
  version?: string
  status: 'healthy' | 'warning' | 'risk' | 'offline'
  directDependentsCount: number
  description: string
  tier: number // for layout / depth
  x: number // normalized or 3D coordinate
  y: number
  z?: number
}

export interface InfraEdge {
  id: string
  source: string
  target: string
  protocol: 'gRPC' | 'TCP' | 'HTTP/2' | 'AMQP' | 'Redis'
  criticality: 'critical' | 'standard' | 'low'
  activeTrace?: boolean
  impacted?: boolean
}

export interface AffectedService {
  id: string
  name: string
  risk: 'HIGH' | 'MEDIUM' | 'LOW'
  dependencyType: 'Direct dependency' | 'Indirect dependency'
  component: string
  impactReason: string
  failureMode: string
  affectedEndpoints: string[]
  dependentCallers: number
}

export interface ConfigConflict {
  id: string
  title: string
  severity: 'HIGH' | 'MEDIUM' | 'LOW'
  resource: string
  reason: string
  recommendation: string
  diff?: {
    current: string
    required: string
  }
}

export interface Recommendation {
  step: string
  title: string
  description: string
  action: string
  codeSnippet?: string
  status: 'REQUIRED' | 'RECOMMENDED' | 'INFORMATIONAL'
}

export interface ScenarioRiskFactors {
  affectedServicesText: string
  conflictsText: string
  pathsText: string
  footprintText: string
  justificationText: string
}

export interface ChangeScenario {
  id: string
  resource: string
  currentVersion: string
  proposedVersion: string
  riskLevel: 'HIGH RISK' | 'MEDIUM RISK' | 'LOW RISK' | 'CRITICAL BREAK'
  summary: {
    affectedServices: number
    configConflicts: number
    highRiskPaths: number
    totalDependencies: number
  }
  affectedServices: AffectedService[]
  configConflicts: ConfigConflict[]
  recommendations: Recommendation[]
  whyRiskExplanation?: string
  riskFactors?: ScenarioRiskFactors
}

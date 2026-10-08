import { ChangeScenario, InfraNode, InfraEdge, ScenarioRiskFactors } from './types'

export const HERO_NODES: InfraNode[] = [
  {
    id: 'api-gateway',
    name: 'API Gateway',
    type: 'gateway',
    version: 'Envoy 1.28',
    status: 'healthy',
    directDependentsCount: 3,
    description: 'Edge reverse proxy routing public traffic to microservices.',
    tier: 1,
    x: 0,
    y: 1.8,
    z: 0
  },
  {
    id: 'auth-service',
    name: 'Auth Service',
    type: 'service',
    version: 'v2.14.0',
    status: 'healthy',
    directDependentsCount: 2,
    description: 'OAuth2 & session authentication service using JWT and mTLS.',
    tier: 2,
    x: -1.8,
    y: 0.6,
    z: -0.5
  },
  {
    id: 'user-service',
    name: 'User Service',
    type: 'service',
    version: 'v3.1.2',
    status: 'healthy',
    directDependentsCount: 2,
    description: 'Core identity, profile directory, and permissions service.',
    tier: 2,
    x: 0,
    y: 0.6,
    z: 0.5
  },
  {
    id: 'billing-service',
    name: 'Billing Service',
    type: 'service',
    version: 'v1.9.4',
    status: 'healthy',
    directDependentsCount: 2,
    description: 'Subscription billing, Stripe webhooks, and invoice generation.',
    tier: 2,
    x: 1.8,
    y: 0.6,
    z: -0.5
  },
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    type: 'database',
    version: '15.4',
    status: 'healthy',
    directDependentsCount: 4,
    description: 'Primary transactional cluster (Aurora Multi-AZ replica).',
    tier: 3,
    x: -0.9,
    y: -0.8,
    z: -0.8
  },
  {
    id: 'redis',
    name: 'Redis',
    type: 'cache',
    version: '7.0.11',
    status: 'healthy',
    directDependentsCount: 2,
    description: 'In-memory session token store and rate-limiting cache.',
    tier: 3,
    x: -2.2,
    y: -0.8,
    z: 0.8
  },
  {
    id: 'queue',
    name: 'Queue (RabbitMQ)',
    type: 'queue',
    version: '3.12',
    status: 'healthy',
    directDependentsCount: 2,
    description: 'AMQP broker for asynchronous background event processing.',
    tier: 3,
    x: 0.9,
    y: -0.8,
    z: 0.8
  },
  {
    id: 'worker',
    name: 'Worker Service',
    type: 'worker',
    version: 'v2.6.0',
    status: 'healthy',
    directDependentsCount: 2,
    description: 'Background consumers for scheduled tasks and event ingestion.',
    tier: 4,
    x: 0.2,
    y: -2.0,
    z: 0.2
  },
  {
    id: 'analytics',
    name: 'Analytics Service',
    type: 'service',
    version: 'v1.11.0',
    status: 'healthy',
    directDependentsCount: 1,
    description: 'Telemetry aggregation and business event streaming engine.',
    tier: 4,
    x: 2.1,
    y: -1.9,
    z: -0.6
  }
]

export const HERO_EDGES: InfraEdge[] = [
  { id: 'e1', source: 'api-gateway', target: 'auth-service', protocol: 'HTTP/2', criticality: 'critical' },
  { id: 'e2', source: 'api-gateway', target: 'user-service', protocol: 'HTTP/2', criticality: 'critical' },
  { id: 'e3', source: 'api-gateway', target: 'billing-service', protocol: 'HTTP/2', criticality: 'critical' },
  { id: 'e4', source: 'auth-service', target: 'redis', protocol: 'Redis', criticality: 'critical' },
  { id: 'e5', source: 'auth-service', target: 'postgresql', protocol: 'TCP', criticality: 'critical' },
  { id: 'e6', source: 'user-service', target: 'postgresql', protocol: 'TCP', criticality: 'critical' },
  { id: 'e7', source: 'user-service', target: 'queue', protocol: 'AMQP', criticality: 'standard' },
  { id: 'e8', source: 'billing-service', target: 'postgresql', protocol: 'TCP', criticality: 'critical' },
  { id: 'e9', source: 'billing-service', target: 'analytics', protocol: 'gRPC', criticality: 'low' },
  { id: 'e10', source: 'queue', target: 'worker', protocol: 'AMQP', criticality: 'standard' },
  { id: 'e11', source: 'worker', target: 'postgresql', protocol: 'TCP', criticality: 'standard' },
  { id: 'e12', source: 'worker', target: 'analytics', protocol: 'gRPC', criticality: 'low' }
]

export const SCENARIOS: Record<string, ChangeScenario> = {
  'pg-15-16': {
    id: 'pg-15-16',
    resource: 'PostgreSQL',
    currentVersion: '15.4',
    proposedVersion: '16.1',
    riskLevel: 'HIGH RISK',
    summary: {
      affectedServices: 3,
      configConflicts: 2,
      highRiskPaths: 1,
      totalDependencies: 7
    },
    affectedServices: [
      {
        id: 'auth-service',
        name: 'Auth Service',
        risk: 'HIGH',
        dependencyType: 'Direct dependency',
        component: 'pgx / node-pg connection client',
        impactReason: 'Authentication failure: PostgreSQL 16 enforces SCRAM-SHA-256 password hashing by default. Legacy client in auth-service expects md5 fallback.',
        failureMode: 'Cascading login timeouts; token refresh failures across all clients.',
        affectedEndpoints: ['/oauth/token', '/auth/login', '/auth/verify'],
        dependentCallers: 1420
      },
      {
        id: 'billing-service',
        name: 'Billing Service',
        risk: 'HIGH',
        dependencyType: 'Indirect dependency',
        component: 'Transaction pooler / pgbouncer',
        impactReason: 'Connection pool timeout mismatch: max_connections reserved for billing pool exceeds PostgreSQL 16 memory limits under current container cgroups.',
        failureMode: 'Deadlock during Stripe webhook reconciliation; delayed invoices.',
        affectedEndpoints: ['/webhooks/stripe', '/subscriptions/charge', '/invoices/generate'],
        dependentCallers: 380
      },
      {
        id: 'worker-service',
        name: 'Worker Service',
        risk: 'MEDIUM',
        dependencyType: 'Indirect dependency',
        component: 'Batch event processor',
        impactReason: 'Deprecation of implicit timestamp casting in SQL queries executing bulk event writes.',
        failureMode: 'Queue backlog accumulates in RabbitMQ dead-letter exchange.',
        affectedEndpoints: ['queue:events.drain', 'cron:reconciliation'],
        dependentCallers: 85
      },
      {
        id: 'analytics-service',
        name: 'Analytics Service',
        risk: 'LOW',
        dependencyType: 'Indirect dependency',
        component: 'Read replica sync pipeline',
        impactReason: 'Logical replication protocol bump requires re-establishing streaming slots.',
        failureMode: 'Dashboard telemetry displays 300s staleness during cutover.',
        affectedEndpoints: ['/metrics/ingest', '/reports/aggregate'],
        dependentCallers: 42
      }
    ],
    configConflicts: [
      {
        id: 'conf-1',
        title: 'PostgreSQL client driver compatibility',
        severity: 'HIGH',
        resource: 'auth-service (package.json / pg@8.7.1)',
        reason: 'Client library pg@8.7.1 lacks support for SCRAM-SHA-256 channel binding introduced in PG 16 server handshake.',
        recommendation: 'Upgrade pg to ^8.11.3 or higher in auth-service before applying database migration.',
        diff: {
          current: '"pg": "^8.7.1"',
          required: '"pg": "^8.11.3"'
        }
      },
      {
        id: 'conf-2',
        title: 'Connection timeout configuration mismatch',
        severity: 'MEDIUM',
        resource: 'billing-service (helm/values-prod.yaml)',
        reason: 'Pool timeout set to 5000ms. PostgreSQL 16 cold connection SSL renegotiation takes 6200ms on initial spin-up.',
        recommendation: 'Increase connectionTimeoutMillis to 10000ms and set idle_in_transaction_session_timeout to 60000ms.',
        diff: {
          current: 'connectionTimeoutMillis: 5000',
          required: 'connectionTimeoutMillis: 10000'
        }
      },
      {
        id: 'conf-3',
        title: 'Deprecated schema timestamp casting',
        severity: 'LOW',
        resource: 'analytics-pipeline (db/migrations/2024_events.sql)',
        reason: 'Implicit cast from text to timestamp without timezone is disallowed under PG 16 strict sql standard flags.',
        recommendation: 'Update migration scripts to use explicit ::timestamptz cast expressions.',
        diff: {
          current: 'SELECT event_time::timestamp FROM raw_logs',
          required: 'SELECT event_time::timestamptz FROM raw_logs'
        }
      }
    ],
    recommendations: [
      {
        step: '01',
        title: 'Update connection driver in Auth Service',
        description: 'Upgrade the database client library in auth-service to prevent authentication negotiation failures.',
        action: 'npm install pg@8.11.3 --save in services/auth-service',
        codeSnippet: 'npm i pg@^8.11.3 && npm test -- --runInBand auth.test.ts',
        status: 'REQUIRED'
      },
      {
        step: '02',
        title: 'Check service compatibility & test suites',
        description: 'Execute integration tests against an ephemeral PostgreSQL 16 container in CI before deploying.',
        action: 'whatbreaks verify --target postgresql:16.1 --suite integration',
        codeSnippet: 'whatbreaks verify --target postgresql:16.1 --suite integration',
        status: 'REQUIRED'
      },
      {
        step: '03',
        title: 'Review database schema changes and casting',
        description: 'Lint all migration files for deprecated timestamp conversions and altered default collation parameters.',
        action: 'Run pg-strict-linter on db/migrations/*.sql',
        codeSnippet: 'whatbreaks lint --dialect postgres:16 ./migrations',
        status: 'RECOMMENDED'
      },
      {
        step: '04',
        title: 'Validate zero-downtime migration strategy',
        description: 'Ensure blue/green replica cutover is configured with read-only traffic redirection during catalog upgrade.',
        action: 'Review Terraform aurora_cluster maintenance window and failover priority.',
        codeSnippet: 'terraform plan -target=aws_rds_cluster.primary -out=tfplan',
        status: 'RECOMMENDED'
      }
    ],
    whyRiskExplanation:
      'This change affects 3 services (Auth Service, Billing Service, Worker Service) with 2 blocking configuration conflicts and 1 high-risk dependency path across an extensive 7-dependency footprint. The proposed database upgrade enforces SCRAM-SHA-256 authentication and strict connection pooling timeouts that legacy client drivers cannot negotiate. Because unpatched callers face immediate authentication rejection and connection starvation across critical transactional paths, this multi-tier blast radius justifies the HIGH RISK classification.',
    riskFactors: {
      affectedServicesText: '3 services impacted (Auth, Billing, Worker)',
      conflictsText: '2 blocking configuration conflicts detected',
      pathsText: '1 critical high-risk path (Auth DB connection)',
      footprintText: 'Extensive footprint (7 total dependencies)',
      justificationText: 'Breaking authentication and pool timeout mismatches across critical transactional tiers'
    }
  },
  'redis-6-7': {
    id: 'redis-6-7',
    resource: 'Redis Cluster',
    currentVersion: '6.2.14',
    proposedVersion: '7.2.4',
    riskLevel: 'MEDIUM RISK',
    summary: {
      affectedServices: 2,
      configConflicts: 1,
      highRiskPaths: 0,
      totalDependencies: 4
    },
    affectedServices: [
      {
        id: 'auth-service',
        name: 'Auth Service',
        risk: 'MEDIUM',
        dependencyType: 'Direct dependency',
        component: 'ioredis token cache',
        impactReason: 'ACL username default syntax change causes permission denied on session flush keyspace.',
        failureMode: 'Session cache falls back to PostgreSQL; increased query latency by 45ms.',
        affectedEndpoints: ['/oauth/session', '/auth/revoke'],
        dependentCallers: 1420
      },
      {
        id: 'api-gateway',
        name: 'API Gateway',
        risk: 'LOW',
        dependencyType: 'Indirect dependency',
        component: 'Rate limit filter',
        impactReason: 'RESP3 protocol negotiation handshake requires filter reconfiguration in Envoy.',
        failureMode: 'Rate limit counter bypass for 120s during Redis cluster reboot.',
        affectedEndpoints: ['/*'],
        dependentCallers: 5000
      }
    ],
    configConflicts: [
      {
        id: 'conf-redis-1',
        title: 'Redis ACL default user permissions',
        severity: 'MEDIUM',
        resource: 'k8s/secrets/redis-credentials.yaml',
        reason: 'Redis 7 requires explicit command category permissions for ACL users.',
        recommendation: 'Update Redis ACL config to grant +@read +@write +@connection categories.',
        diff: {
          current: 'user default on nopass ~* +@all',
          required: 'user default on >${SECRET} ~* +@all -@dangerous'
        }
      }
    ],
    recommendations: [
      {
        step: '01',
        title: 'Update ioredis client config',
        description: 'Configure RESP2 compatibility flag to prevent unsolicited protocol downgrade.',
        action: 'Set protocolVersion: 2 in cache/redis.ts',
        codeSnippet: 'const redis = new Redis({ host, port, protocolVersion: 2 });',
        status: 'REQUIRED'
      },
      {
        step: '02',
        title: 'Validate Sentinel failover timeout',
        description: 'Adjust failover timeout to prevent premature split-brain detection.',
        action: 'Set sentinel failover-timeout to 30000ms',
        codeSnippet: 'redis-cli sentinel set mymaster failover-timeout 30000',
        status: 'RECOMMENDED'
      }
    ],
    whyRiskExplanation:
      'This change affects 2 services (Auth Service, API Gateway) with 1 configuration conflict in Redis ACL permissions, but 0 high-risk dependency paths across a moderate 4-dependency footprint. While the RESP3 protocol negotiation upgrade requires client library adjustments to avoid token cache misses, session lookups safely fall back to the primary database with minimal query latency overhead (+45ms). Because the blast radius is bounded and does not disrupt core connectivity, this combination justifies the MEDIUM RISK classification.',
    riskFactors: {
      affectedServicesText: '2 services affected (Auth Service, API Gateway)',
      conflictsText: '1 configuration conflict (Redis ACL syntax)',
      pathsText: '0 high-risk dependency paths',
      footprintText: 'Moderate footprint (4 total dependencies)',
      justificationText: 'Bounded operational degradation with active fallback cache mechanisms'
    }
  },
  'envoy-minor': {
    id: 'envoy-minor',
    resource: 'API Gateway (Envoy)',
    currentVersion: '1.27.0',
    proposedVersion: '1.28.2',
    riskLevel: 'LOW RISK',
    summary: {
      affectedServices: 1,
      configConflicts: 0,
      highRiskPaths: 0,
      totalDependencies: 1
    },
    affectedServices: [
      {
        id: 'auth-service',
        name: 'Auth Service',
        risk: 'LOW',
        dependencyType: 'Direct dependency',
        component: 'ext_authz filter',
        impactReason: 'Minor protobuf header normalization; backward compatible.',
        failureMode: 'Contained edge verification; zero breaking changes observed in synthetic traffic test.',
        affectedEndpoints: ['/ext-auth/*'],
        dependentCallers: 2100
      }
    ],
    configConflicts: [],
    recommendations: [
      {
        step: '01',
        title: 'Rolling restart with canary pod',
        description: 'Deploy 1 canary replica to verify header preservation before full cluster rollout.',
        action: 'kubectl rollout restart deployment/envoy-gateway -n ingress',
        codeSnippet: 'kubectl rollout status deployment/envoy-gateway -n ingress',
        status: 'RECOMMENDED'
      }
    ],
    whyRiskExplanation:
      'This change affects 1 service (Auth Service) with 0 configuration conflicts and 0 high-risk dependency paths across a limited dependency footprint of 1 downstream link. The proposed Envoy proxy update introduces backward-compatible header handling without altering request routing contracts. With zero breaking conflicts and no upstream propagating paths, this represents a contained, testable change that can be safely verified with a canary rollout, fully justifying the LOW RISK classification.',
    riskFactors: {
      affectedServicesText: '1 service evaluated (Auth Service)',
      conflictsText: '0 configuration conflicts detected',
      pathsText: '0 high-risk dependency paths',
      footprintText: 'Limited footprint (1 downstream integration)',
      justificationText: 'Contained, testable change with fully backward-compatible protocols'
    }
  },
  'ingress-patch': {
    id: 'ingress-patch',
    resource: 'Ingress NGINX',
    currentVersion: '1.12.0',
    proposedVersion: '1.13.0',
    riskLevel: 'LOW RISK',
    summary: {
      affectedServices: 1,
      configConflicts: 0,
      highRiskPaths: 0,
      totalDependencies: 2
    },
    affectedServices: [
      {
        id: 'api-gateway',
        name: 'API Gateway',
        risk: 'LOW',
        dependencyType: 'Direct dependency',
        component: 'Ingress controller routing',
        impactReason: 'Annotation schema and TLS termination verification; backward compatible.',
        failureMode: 'None detected; standard rolling reload candidate.',
        affectedEndpoints: ['/*'],
        dependentCallers: 12400
      }
    ],
    configConflicts: [],
    recommendations: [
      {
        step: '01',
        title: 'Rolling restart with pod readiness check',
        description: 'Execute rolling upgrade on ingress-nginx daemonset and inspect ingress controller readiness probes.',
        action: 'kubectl rollout restart daemonset/ingress-nginx -n ingress-nginx',
        codeSnippet: 'kubectl rollout status daemonset/ingress-nginx -n ingress-nginx',
        status: 'RECOMMENDED'
      }
    ],
    whyRiskExplanation:
      'This change affects 1 service (API Gateway) with 0 configuration conflicts and 0 high-risk dependency paths across a narrow 2-dependency footprint. The minor ingress controller patch preserves all ingress annotations, TLS termination parameters, and routing paths. Because the modification is strictly localized and introduces no protocol or credential alterations, it represents a contained, testable change that justifies the LOW RISK classification.',
    riskFactors: {
      affectedServicesText: '1 service evaluated (API Gateway)',
      conflictsText: '0 configuration conflicts detected',
      pathsText: '0 high-risk dependency paths',
      footprintText: 'Narrow footprint (2 total dependencies)',
      justificationText: 'Contained, testable change with verified backward-compatible ingress rules'
    }
  }
}

/**
 * Dynamically derives a scenario risk explanation based on actual scenario data.
 * Answers all 5 required questions:
 * 1. How many services are affected?
 * 2. Are there configuration conflicts?
 * 3. Are there high-risk dependency paths?
 * 4. How large is the dependency footprint?
 * 5. Why does that combination justify HIGH / MEDIUM / LOW?
 *
 * Strict safety rule: NEVER uses phrases such as:
 * - cascading failure
 * - immediate cascading timeouts
 * - critical incompatibility
 * - widespread outage
 * - breaking downstream services
 * inside a LOW RISK explanation.
 */
export function generateScenarioRiskExplanation(scenario: ChangeScenario): string {
  if (scenario.whyRiskExplanation) {
    return scenario.whyRiskExplanation
  }

  const affectedCount = scenario.summary.affectedServices
  const conflictsCount = scenario.summary.configConflicts
  const highRiskPathsCount = scenario.summary.highRiskPaths
  const footprintCount = scenario.summary.totalDependencies
  const risk = scenario.riskLevel.toUpperCase()

  const serviceNames = scenario.affectedServices.map((s) => s.name).slice(0, 3).join(', ')
  const servicesPart =
    affectedCount === 0
      ? '0 services are affected'
      : affectedCount === 1
      ? `1 service is affected${serviceNames ? ` (${serviceNames})` : ''}`
      : `${affectedCount} services are affected${serviceNames ? ` (${serviceNames}${scenario.affectedServices.length > 3 ? ', etc.' : ''})` : ''}`

  const conflictsPart =
    conflictsCount === 0
      ? '0 configuration conflicts'
      : conflictsCount === 1
      ? '1 configuration conflict'
      : `${conflictsCount} configuration conflicts`

  const pathsPart =
    highRiskPathsCount === 0
      ? '0 high-risk dependency paths'
      : highRiskPathsCount === 1
      ? '1 high-risk dependency path'
      : `${highRiskPathsCount} high-risk dependency paths`

  const footprintPart =
    footprintCount <= 2
      ? `a limited dependency footprint of ${footprintCount} total ${footprintCount === 1 ? 'dependency' : 'dependencies'}`
      : footprintCount <= 5
      ? `a moderate dependency footprint of ${footprintCount} total dependencies`
      : `a broad dependency footprint of ${footprintCount} total dependencies`

  if (risk.includes('LOW')) {
    return `This change affects ${servicesPart} with ${conflictsPart} and ${pathsPart} across ${footprintPart}. Because there are no breaking configuration conflicts and the scope is strictly isolated, this upgrade represents a contained, testable change that can be safely verified via canary deployment without impacting downstream services, fully justifying the LOW RISK classification.`
  }

  if (risk.includes('MEDIUM')) {
    return `This change affects ${servicesPart} with ${conflictsPart} and ${pathsPart} across ${footprintPart}. While configuration or protocol adjustments are required for dependent components, operational degradation is bounded by active fallback mechanisms. This moderate blast radius warrants pre-release staging validation, justifying the MEDIUM RISK classification.`
  }

  return `This change affects ${servicesPart} with ${conflictsPart} and ${pathsPart} across ${footprintPart}. Critical protocol or credential mismatches prevent normal service communication along primary operational paths. This combination of breaking dependencies and wide blast radius requires pre-deployment remediation, justifying the HIGH RISK classification.`
}

export function getScenarioRiskFactors(scenario: ChangeScenario): ScenarioRiskFactors {
  if (scenario.riskFactors) {
    return scenario.riskFactors
  }

  const affectedCount = scenario.summary.affectedServices
  const conflictsCount = scenario.summary.configConflicts
  const highRiskPathsCount = scenario.summary.highRiskPaths
  const footprintCount = scenario.summary.totalDependencies
  const risk = scenario.riskLevel.toUpperCase()

  return {
    affectedServicesText:
      affectedCount === 1
        ? `1 service affected (${scenario.affectedServices[0]?.name || 'Direct dependency'})`
        : `${affectedCount} services affected`,
    conflictsText:
      conflictsCount === 0
        ? '0 configuration conflicts detected'
        : `${conflictsCount} configuration ${conflictsCount === 1 ? 'conflict' : 'conflicts'} detected`,
    pathsText:
      highRiskPathsCount === 0
        ? '0 high-risk dependency paths'
        : `${highRiskPathsCount} high-risk dependency ${highRiskPathsCount === 1 ? 'path' : 'paths'}`,
    footprintText:
      footprintCount <= 2
        ? `Limited footprint (${footprintCount} ${footprintCount === 1 ? 'dependency' : 'dependencies'})`
        : footprintCount <= 5
        ? `Moderate footprint (${footprintCount} dependencies)`
        : `Extensive footprint (${footprintCount} dependencies)`,
    justificationText: risk.includes('LOW')
      ? 'Contained, testable change with fully backward-compatible protocols'
      : risk.includes('MEDIUM')
      ? 'Bounded operational impact with graceful fallback mechanisms'
      : 'Breaking protocol mismatches across critical operational tiers'
  }
}

export const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'CHANGE',
    heading: 'Detect the infrastructure change',
    description: 'WhatBreaks intercepts infrastructure change requests at the pull request or Terraform plan phase. Whether it is an Aurora engine upgrade, a Kubernetes manifest edit, or a Redis configuration tweak, WhatBreaks captures the proposed delta before any bytes hit production.',
    technicalDetails: [
      'Native integration with git webhooks, Terraform Cloud, and Helm CI pipelines',
      'Parses HCL plans, Kubernetes YAML, Docker Compose, and cloud provider manifests',
      'Normalizes proposed state changes into a canonical infrastructure delta spec'
    ],
    badgeText: 'INFRASTRUCTURE DELTA'
  },
  {
    step: '02',
    title: 'TRACE',
    heading: 'Trace direct and indirect dependencies',
    description: 'Starting from the resource undergoing modification, WhatBreaks walks the dependency graph recursively. It distinguishes between direct callers, downstream consumers, asynchronous queue listeners, and cascading failover paths.',
    technicalDetails: [
      'Recursive graph traversal evaluating protocol compatibility at each hop',
      'Tracks blast propagation through synchronous HTTP/gRPC and asynchronous pub/sub',
      'Calculates dependency criticality weights based on traffic volume and tiering'
    ],
    badgeText: 'DEPENDENCY TRAVERSAL'
  },
  {
    step: '03',
    title: 'ANALYZE',
    heading: 'Calculate potential impact and blast radius',
    description: 'WhatBreaks cross-references client driver versions, authentication schemes, timeout configurations, and schema compatibility rules against the target resource version to surface breaking changes before deployment.',
    technicalDetails: [
      'Deterministic rule engine detects incompatible client libraries (e.g. pgx, ioredis)',
      'Identifies connection pool starvation and timeout misconfigurations',
      'Quantifies exact blast radius: affected services, endpoints, and callers'
    ],
    badgeText: 'BLAST RADIUS ENGINE'
  },
  {
    step: '04',
    title: 'REVIEW',
    heading: 'Review affected resources and recommendations',
    description: 'Engineers receive concise, unambiguous feedback directly in their pull requests, terminal, or WhatBreaks dashboard. Instead of mysterious 3 AM production outages, teams get precise remediation steps, exact config diffs, and confidence.',
    technicalDetails: [
      'Surfaces exact configuration diffs across downstream services',
      'Generates automated remediation runbooks and client upgrade commands',
      'Coordinates multi-service migration windows with zero downtime'
    ],
    badgeText: 'ACTIONABLE REMEDIATION'
  },
  {
    step: '05',
    title: 'DEPLOY',
    heading: 'Make the change with confidence',
    description: 'Once all compatibility gates pass and recommendations are verified, the deployment proceeds smoothly. Platform teams and service owners know exactly how the infrastructure will respond under production traffic.',
    technicalDetails: [
      'Validates canary rollouts against expected dependency behavior',
      'Ensures connection pool parameters withstand live traffic cutover',
      'Eliminates unmitigated cascading outages from infrastructure changes'
    ],
    badgeText: 'CONFIDENT DEPLOYMENT'
  }
]

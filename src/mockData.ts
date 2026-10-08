import { ChangeScenario, InfraNode, InfraEdge } from './types'

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
    ]
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
    ]
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
      totalDependencies: 9
    },
    affectedServices: [
      {
        id: 'auth-service',
        name: 'Auth Service',
        risk: 'LOW',
        dependencyType: 'Direct dependency',
        component: 'ext_authz filter',
        impactReason: 'Minor protobuf header normalization; backward compatible.',
        failureMode: 'None detected in automated synthetic traffic test.',
        affectedEndpoints: ['/ext-auth/*'],
        dependentCallers: 2100
      }
    ],
    configConflicts: [],
    recommendations: [
      {
        step: '01',
        title: 'Rolling restart with canary canary pod',
        description: 'Deploy 1 canary replica to verify header preservation before full cluster rollout.',
        action: 'kubectl rollout restart deployment/envoy-gateway -n ingress',
        codeSnippet: 'kubectl rollout status deployment/envoy-gateway -n ingress',
        status: 'RECOMMENDED'
      }
    ]
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

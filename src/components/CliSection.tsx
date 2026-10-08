import { useState } from 'react'
import { Copy, CheckCircle2 } from 'lucide-react'

export const CliSection: React.FC = () => {
  const [activeCommand, setActiveCommand] = useState<'analyze' | 'blast' | 'gate'>('analyze')
  const [copied, setCopied] = useState(false)

  const commands = {
    analyze: {
      cmd: '$ whatbreaks analyze ./change.yaml',
      output: `Analyzing infrastructure...

✓ Dependency graph loaded
✓ 184 resources discovered
✓ 731 relationships traced
✓ 12 potential impacts found

RISK     RESOURCE            REASON
----------------------------------------------------------------------
HIGH     auth-service        SCRAM-SHA-256 handshake mismatch (pg@8.7.1)
HIGH     payment-service     Connection pool starvation on 6200ms cold start
MED      worker-service      Implicit timestamp casting removed in PG 16
LOW      analytics-pipeline  Streaming replication slot protocol bump

Analysis complete. 1 blocking violation found.`
    },
    blast: {
      cmd: '$ whatbreaks blast-radius --resource postgresql:16',
      output: `Evaluating downstream blast propagation from [postgresql:16]...

Direct Downstream (Depth 1):
  - auth-service (tier 1, critical)
  - billing-service (tier 1, critical)
  - user-service (tier 1, standard)

Indirect Downstream (Depth 2):
  - redis-session-cache (via auth-service)
  - rabbitmq-queue (via user-service)

Indirect Downstream (Depth 3):
  - worker-service (via rabbitmq-queue)
  - analytics-service (via billing-service)

Blast Radius Summary: 7 total services · 3 critical paths · Max hop depth: 3`
    },
    gate: {
      cmd: '$ whatbreaks gate --pr=412 --strict',
      output: `Evaluating CI deployment gate for PR #412...

Target Environment: production (us-east-1)
Change Origin:      aws_rds_cluster.primary (engine_version 15.4 -> 16.1)

[RULE: no-unmitigated-high-risk]   FAILED
  -> auth-service client driver must be upgraded to pg@^8.11.3

[RULE: pool-timeout-conformance]   WARNING
  -> billing-service pool timeout 5000ms < 6200ms

Gate Decision: REJECTED (Exit Code 1)
Deployment blocked until high-risk violations are resolved.`
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(commands[activeCommand].cmd)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section className="cli-section" id="cli">
      <div className="container">
        <div className="section-header">
          <div className="section-eyebrow mono">TERMINAL NATIVE</div>
          <h2 className="section-title">Impact analysis from your terminal.</h2>
          <p className="section-subtitle">
            Integrate directly into your local CLI, git pre-commit hooks, or continuous integration pipelines.
            Fast, deterministic, and scriptable.
          </p>
        </div>

        <div className="cli-terminal-window panel">
          {/* Terminal Title Bar */}
          <div className="terminal-titlebar">
            <div className="terminal-dots">
              <span className="term-dot" />
              <span className="term-dot" />
              <span className="term-dot" />
            </div>

            <div className="terminal-tabs">
              <button
                type="button"
                className={`term-tab ${activeCommand === 'analyze' ? 'term-tab-active' : ''}`}
                onClick={() => setActiveCommand('analyze')}
              >
                analyze
              </button>
              <button
                type="button"
                className={`term-tab ${activeCommand === 'blast' ? 'term-tab-active' : ''}`}
                onClick={() => setActiveCommand('blast')}
              >
                blast-radius
              </button>
              <button
                type="button"
                className={`term-tab ${activeCommand === 'gate' ? 'term-tab-active' : ''}`}
                onClick={() => setActiveCommand('gate')}
              >
                ci-gate
              </button>
            </div>

            <div className="terminal-actions">
              <button type="button" className="terminal-copy-btn mono" onClick={handleCopy}>
                {copied ? (
                  <>
                    <CheckCircle2 size={12} className="text-healthy" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={12} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="terminal-body mono">
            <div className="terminal-cmd-line">
              <span className="term-prompt">$</span>
              <span className="term-cmd-text">{commands[activeCommand].cmd.replace('$ ', '')}</span>
            </div>

            <pre className="terminal-output-text">
              {commands[activeCommand].output}
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

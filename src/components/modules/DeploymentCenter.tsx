import React, { useState } from 'react';
import {
  Rocket,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  ShieldCheck,
  Server,
  Activity,
  Layers,
  Clock,
  ExternalLink,
  Lock,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { DeploymentRecord, UserProfile, CodeReview, TestReport } from '../../types';

interface DeploymentCenterProps {
  deployments: DeploymentRecord[];
  user: UserProfile;
  review: CodeReview;
  testReport: TestReport;
  onDeployProduction: () => void;
  onRollback: (depId: string) => void;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const DeploymentCenter: React.FC<DeploymentCenterProps> = ({
  deployments,
  user,
  review,
  testReport,
  onDeployProduction,
  onRollback,
  onAddLog,
}) => {
  const [selectedEnv, setSelectedEnv] = useState<'production' | 'staging'>('production');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  const criticalSecurityCount = review.findings.filter(
    f => (f.severity === 'critical' || f.severity === 'high') && f.status === 'open'
  ).length;

  const canDeploy = criticalSecurityCount === 0 && testReport.executionSummary.failed === 0;

  const handleDeploy = () => {
    if (!canDeploy) {
      alert('Deployment blocked: All critical security issues must be resolved and test suite must be 100% passing.');
      return;
    }

    setIsDeploying(true);
    onAddLog(`Deployment Agent triggered for Azure Container Apps (${selectedEnv}). Human approval: ${user.name} (${user.role})`, 'deployment', 'AGENT');

    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      onDeployProduction();
      onAddLog(`Release v1.4.1 deployed successfully to Azure Container Apps. Health probes reporting 200 OK.`, 'deployment', 'INFO');
      setTimeout(() => setDeploySuccess(false), 5000);
    }, 2500);
  };

  const currentDeploy = deployments.find(d => d.environment === selectedEnv) || deployments[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Rocket className="w-5 h-5 text-purple-400" />
            <span>Azure Container Apps Deployment Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Zero-downtime containerized release orchestration, health verification probes, and human approval gates.
          </p>
        </div>

        {/* Environment Selector */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button
            onClick={() => setSelectedEnv('production')}
            className={`px-3 py-1.5 rounded-md transition font-medium ${
              selectedEnv === 'production' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            Production (East US 2)
          </button>
          <button
            onClick={() => setSelectedEnv('staging')}
            className={`px-3 py-1.5 rounded-md transition font-medium ${
              selectedEnv === 'staging' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            QA / Staging
          </button>
        </div>
      </div>

      {/* Deployment Verification Gate Banner */}
      <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Pre-Flight Gate Validation
            </span>
            {canDeploy ? (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                Gate: Passed
              </span>
            ) : (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold border border-rose-500/30">
                Gate: Blocked
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Pytest & Vitest: {testReport.executionSummary.passed}/{testReport.executionSummary.total} Passing</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>OWASP SAST: {criticalSecurityCount} Blockers</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Approval Role: {user.role}</span>
            </span>
          </div>
        </div>

        <button
          onClick={handleDeploy}
          disabled={!canDeploy || isDeploying}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold tracking-wide transition flex items-center gap-2 shadow-lg ${
            !canDeploy
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
              : isDeploying
              ? 'bg-purple-600/40 text-purple-200 cursor-wait'
              : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-500/25 active:scale-95'
          }`}
        >
          {isDeploying ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Building Container & Deploying...</span>
            </>
          ) : (
            <>
              <Rocket className="w-4 h-4" />
              <span>Authorize Production Release</span>
            </>
          )}
        </button>
      </div>

      {deploySuccess && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between font-mono animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Azure Container App deployed and responding healthy. Traffic redirected 100%.</span>
          </div>
          <span className="font-bold">STATUS: 200 OK</span>
        </div>
      )}

      {/* Live Telemetry Gauges */}
      {currentDeploy && (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1 font-mono">
            <div className="text-[10px] uppercase font-bold text-slate-400">Target Environment</div>
            <div className="text-sm font-bold text-white uppercase">{currentDeploy.environment}</div>
            <div className="text-[11px] text-slate-500 truncate">{currentDeploy.targetPlatform}</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1 font-mono">
            <div className="text-[10px] uppercase font-bold text-slate-400">p99 Latency</div>
            <div className="text-xl font-bold text-emerald-400">{currentDeploy.metrics.p99Latency}</div>
            <div className="text-[11px] text-slate-500">Live Health Probes</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1 font-mono">
            <div className="text-[10px] uppercase font-bold text-slate-400">Memory Utilization</div>
            <div className="text-xl font-bold text-blue-400">{currentDeploy.metrics.memoryUsage}</div>
            <div className="text-[11px] text-slate-500">1.0 GiB Allocated</div>
          </div>

          <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1 font-mono">
            <div className="text-[10px] uppercase font-bold text-slate-400">Service Uptime</div>
            <div className="text-xl font-bold text-purple-400">{currentDeploy.metrics.uptime}</div>
            <div className="text-[11px] text-slate-500">Zero Unplanned Downtime</div>
          </div>
        </div>
      )}

      {/* Release History & Rollback Controls */}
      <div className="rounded-xl bg-[#0d121f] border border-slate-800 p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-purple-400" />
            <span>Verified Release History & Rollback Records</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">Azure Container Apps Blue-Green</span>
        </div>

        <div className="space-y-3">
          {deployments.map(dep => (
            <div
              key={dep.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{dep.version}</span>
                  <span className="text-slate-500">•</span>
                  <span className="text-blue-400">Commit {dep.commitSha}</span>
                  <span className="text-slate-500">•</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold uppercase">
                    {dep.status}
                  </span>
                </div>
                <div className="text-slate-400 text-[11px] font-sans">
                  Deployed to {dep.targetPlatform} • Approved by {dep.approvedBy || 'CI/CD'}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-slate-500 text-[11px]">{dep.deployedAt}</span>
                <button
                  onClick={() => onRollback(dep.id)}
                  className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1 font-sans"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Rollback to this version</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

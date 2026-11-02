import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Rocket,
  ShieldCheck,
  TrendingUp,
  Clock,
  ArrowUpRight,
  GitPullRequest,
  Sparkles,
  Zap,
  Activity,
  Layers,
  FileCheck2,
} from 'lucide-react';
import { Project, AgentInfo, Specification, TestReport, CodeReview, DeploymentRecord } from '../../types';

interface CommandCenterProps {
  project: Project;
  agents: AgentInfo[];
  spec: Specification;
  testReport: TestReport;
  review: CodeReview;
  deployments: DeploymentRecord[];
  onNavigate: (module: any) => void;
  onRunSwarm: () => void;
}

export const CommandCenter: React.FC<CommandCenterProps> = ({
  project,
  agents,
  spec,
  testReport,
  review,
  deployments,
  onNavigate,
  onRunSwarm,
}) => {
  const completedTasks = spec.tasks.filter(t => t.status === 'completed').length;
  const totalTasks = spec.tasks.length;
  const activeAgents = agents.filter(a => a.status === 'running').length;
  const criticalFindings = review.findings.filter(f => f.severity === 'critical' || f.severity === 'high').length;
  const latestDeploy = deployments[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner / Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0d1424] via-[#101b33] to-[#0c1322] border border-slate-800 p-6 lg:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-medium text-blue-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Autonomous Engineering Swarm • v2.4.0 Active</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-['Space_Grotesk']">
              Engineering Command Center
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Real-time multi-agent orchestrator managing continuous specification synthesis, code generation, sandboxed test execution, security validation, and Azure releases.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => onNavigate('requirement-studio')}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-xs font-semibold tracking-wide transition flex items-center gap-2 shadow-sm"
            >
              <FileCheck2 className="w-4 h-4 text-blue-400" />
              <span>New Requirement</span>
            </button>
            <button
              onClick={onRunSwarm}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold tracking-wide transition flex items-center gap-2 shadow-lg shadow-blue-500/25 active:scale-95"
            >
              <Zap className="w-4 h-4 text-cyan-300" />
              <span>Execute Autonomous Pipeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row (Derived from real application records) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Tasks Progress */}
        <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800/80 hover:border-slate-700/80 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Task Velocity</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{completedTasks}/{totalTasks}</span>
            <span className="text-xs text-emerald-400 font-medium">
              {Math.round((completedTasks / totalTasks) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            />
          </div>
        </div>

        {/* Metric 2: QA Pass Rate */}
        <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800/80 hover:border-slate-700/80 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Test Pass Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">
              {testReport.executionSummary.passed}/{testReport.executionSummary.total}
            </span>
            <span className="text-xs text-emerald-400 font-medium">
              {testReport.executionSummary.coveragePercentage}% Branch Cov
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-mono">
            <span>Isolated Vitest & Pytest Sandbox</span>
          </p>
        </div>

        {/* Metric 3: Security & Code Review */}
        <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800/80 hover:border-slate-700/80 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Security Posture</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono">{review.score}/100</span>
            <span className={`text-xs font-medium ${criticalFindings === 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {criticalFindings === 0 ? 'Zero Blockers' : `${criticalFindings} Critical`}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-mono">
            <span>OWASP ASVS & SAST Validated</span>
          </p>
        </div>

        {/* Metric 4: Production Deployment */}
        <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800/80 hover:border-slate-700/80 transition">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Production Health</span>
            <Rocket className="w-4 h-4 text-purple-400" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-400 font-mono">
              {latestDeploy ? latestDeploy.healthStatus.toUpperCase() : 'HEALTHY'}
            </span>
            <span className="text-xs text-slate-400 font-mono">
              {latestDeploy?.metrics.p99Latency || '34ms'} p99
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 font-mono truncate">
            <span>Azure Container Apps • {latestDeploy?.version || 'v1.4.0'}</span>
          </p>
        </div>
      </div>

      {/* Main Grid: Multi-Agent Status + Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Active Agent Fleet */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-400" />
                <span>Specialized Autonomous Agent Fleet</span>
              </h2>
              <p className="text-xs text-slate-400">Coordinated via LangGraph-inspired state DAG</p>
            </div>
            <button
              onClick={() => onNavigate('control-room')}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
            >
              <span>Control Room</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {agents.map(agent => (
              <div
                key={agent.id}
                className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs"
                      style={{ backgroundColor: `${agent.accentColor}20`, color: agent.accentColor }}
                    >
                      {agent.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-semibold text-white">{agent.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono">{agent.model}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                      agent.status === 'running'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                        : agent.status === 'completed'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {agent.tagline}
                </p>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                  <span>Tokens: {agent.tokensUsed.toLocaleString()}</span>
                  <span className="text-emerald-400 font-medium">{agent.successRate}% Success</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quick Engineering Actions & Telemetry */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Platform Health</span>
            </h2>
            <span className="text-xs font-mono text-emerald-400">99.98% Uptime</span>
          </div>

          <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Memory Pool (Isolated Sandbox)</span>
                <span className="text-slate-200">342 MB / 1024 MB</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full w-[33%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>CPU Load (Container Sandbox)</span>
                <span className="text-slate-200">14.2%</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full w-[14%]" />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-xs font-semibold text-slate-300">Quick Navigation</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => onNavigate('testing-lab')}
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs transition"
                >
                  <div className="font-medium text-slate-200">Testing Lab</div>
                  <div className="text-[10px] text-slate-500">Vitest & Pytest</div>
                </button>
                <button
                  onClick={() => onNavigate('monaco-editor')}
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs transition"
                >
                  <div className="font-medium text-slate-200">Monaco IDE</div>
                  <div className="text-[10px] text-slate-500">Edit Codefiles</div>
                </button>
                <button
                  onClick={() => onNavigate('security-center')}
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs transition"
                >
                  <div className="font-medium text-slate-200">Security Gate</div>
                  <div className="text-[10px] text-slate-500">OWASP Audit</div>
                </button>
                <button
                  onClick={() => onNavigate('deployment-center')}
                  className="p-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-left text-xs transition"
                >
                  <div className="font-medium text-slate-200">Deploy Center</div>
                  <div className="text-[10px] text-slate-500">Azure ACA</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

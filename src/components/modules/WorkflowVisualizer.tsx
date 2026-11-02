import React, { useState } from 'react';
import {
  GitFork,
  Cpu,
  FileCode2,
  Code2,
  FlaskConical,
  Eye,
  ShieldAlert,
  GitPullRequest,
  Rocket,
  ArrowRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Terminal
} from 'lucide-react';
import { AgentInfo } from '../../types';

interface WorkflowVisualizerProps {
  agents: AgentInfo[];
  onTriggerSwarm: () => void;
}

interface WorkflowNode {
  id: string;
  label: string;
  agentId?: string;
  type: 'orchestrator' | 'spec' | 'tasks' | 'code' | 'sandbox' | 'test' | 'review' | 'security' | 'pr' | 'deploy';
  status: 'idle' | 'running' | 'completed' | 'failed';
  description: string;
  inputs: string;
  outputs: string;
}

export const WorkflowVisualizer: React.FC<WorkflowVisualizerProps> = ({
  agents,
  onTriggerSwarm,
}) => {
  const [selectedNode, setSelectedNode] = useState<string>('code');

  const nodes: WorkflowNode[] = [
    {
      id: 'orch',
      label: 'Orchestrator Agent',
      agentId: 'orchestrator',
      type: 'orchestrator',
      status: 'completed',
      description: 'Coordinates state graph, resolves dependency DAG, and supervises swarm execution.',
      inputs: 'Natural language requirements, project configuration, repo standards',
      outputs: 'Decomposed execution graph, agent dispatch events',
    },
    {
      id: 'spec',
      label: 'Specification Agent',
      agentId: 'specification',
      type: 'spec',
      status: 'completed',
      description: 'Transforms requirements into RFC 2119 technical specs, API endpoints, and schemas.',
      inputs: 'Raw product requirements, domain models',
      outputs: 'Architectural specification, DB schema, acceptance criteria',
    },
    {
      id: 'dev',
      label: 'Developer Agent',
      agentId: 'developer',
      type: 'code',
      status: 'completed',
      description: 'Synthesizes clean FastAPI backend endpoints, PostgreSQL models, and React UI.',
      inputs: 'Approved specification, task requirements, repository file tree',
      outputs: 'Generated code files, database migrations, explanatory commit',
    },
    {
      id: 'test',
      label: 'Testing Agent & QA Sandbox',
      agentId: 'testing',
      type: 'test',
      status: 'completed',
      description: 'Generates Vitest, Pytest, and Playwright tests. Runs tests in isolated sandbox containers.',
      inputs: 'Generated source code files, acceptance criteria',
      outputs: 'Pass/fail test report, coverage metrics, failure diagnostics',
    },
    {
      id: 'loop',
      label: 'Self-Correction Loop',
      type: 'sandbox',
      status: 'idle',
      description: 'Automatically patches code failures reported by Testing Agent up to 3 retries without human intervention.',
      inputs: 'Pytest/Vitest stack traces and assertion failures',
      outputs: 'Code diffs, regression test confirmation',
    },
    {
      id: 'review',
      label: 'Code Reviewer Agent',
      agentId: 'reviewer',
      type: 'review',
      status: 'completed',
      description: 'Performs static analysis, code smell detection, and cyclomatic complexity auditing.',
      inputs: 'Generated code diffs, testing reports',
      outputs: 'Code review score, actionable improvement findings',
    },
    {
      id: 'security',
      label: 'Security Gatekeeper',
      agentId: 'reviewer',
      type: 'security',
      status: 'completed',
      description: 'Scans for OWASP Top 10 (SQLi, XSS, Hardcoded Secrets). Blocks deployment on critical findings.',
      inputs: 'AST syntax tree, environment variables, dependency graph',
      outputs: 'CWE findings table, deployment clearance certificate',
    },
    {
      id: 'pr',
      label: 'GitHub PR Generator',
      agentId: 'deployment',
      type: 'pr',
      status: 'completed',
      description: 'Creates professional GitHub Pull Requests with objectives, test evidence, and commit summaries.',
      inputs: 'Approved code changes, test report, security signoff',
      outputs: 'GitHub Pull Request #842 on feature/autonomous-scaffold',
    },
    {
      id: 'deploy',
      label: 'Deployment Agent (Azure ACA)',
      agentId: 'deployment',
      type: 'deploy',
      status: 'running',
      description: 'Coordinates multi-stage Docker build, CI/CD verification, and deployment to Azure Container Apps.',
      inputs: 'Merged PR commit, Dockerfile, Azure Bicep template',
      outputs: 'Live container endpoint, liveness probe monitoring',
    },
  ];

  const activeNode = nodes.find(n => n.id === selectedNode) || nodes[0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <GitFork className="w-5 h-5 text-blue-400" />
            <span>Multi-Agent Workflow Visualizer</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Interactive state machine representing the autonomous software engineering pipeline and self-correction cycles.
          </p>
        </div>

        <button
          onClick={onTriggerSwarm}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
        >
          <Sparkles className="w-4 h-4 text-cyan-200" />
          <span>Execute Full Pipeline DAG</span>
        </button>
      </div>

      {/* Visual Workflow Canvas */}
      <div className="p-6 rounded-2xl bg-[#090d16] border border-slate-800 shadow-2xl overflow-x-auto relative">
        <div className="min-w-[900px] flex flex-col items-center py-6 space-y-8">
          {/* Stage 1: Planning */}
          <div className="flex items-center gap-8">
            <NodeCard node={nodes[0]} isSelected={selectedNode === 'orch'} onSelect={setSelectedNode} />
            <ArrowConnector label="Plan & Graph" />
            <NodeCard node={nodes[1]} isSelected={selectedNode === 'spec'} onSelect={setSelectedNode} />
            <ArrowConnector label="Decompose" />
            <NodeCard node={nodes[2]} isSelected={selectedNode === 'dev'} onSelect={setSelectedNode} />
          </div>

          {/* Bidirectional Testing & Self-Correction Feedback Loop */}
          <div className="flex items-center gap-8 pl-24">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-mono text-cyan-400 pb-1">▼ Synthesized Code</span>
              <NodeCard node={nodes[3]} isSelected={selectedNode === 'test'} onSelect={setSelectedNode} />
            </div>

            {/* Loop Arrow */}
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-slate-900/80 border border-amber-500/30 text-amber-300 text-xs font-mono">
              <RotateCcw className="w-5 h-5 text-amber-400 animate-spin" />
              <span className="text-[10px] mt-1 font-semibold">Self-Correction Loop</span>
              <span className="text-[9px] text-slate-400">Retry Failed Tests</span>
            </div>

            <ArrowConnector label="Verified Green" />
            <NodeCard node={nodes[5]} isSelected={selectedNode === 'review'} onSelect={setSelectedNode} />
          </div>

          {/* Stage 3: Security & Release */}
          <div className="flex items-center gap-8">
            <NodeCard node={nodes[6]} isSelected={selectedNode === 'security'} onSelect={setSelectedNode} />
            <ArrowConnector label="Zero Blockers" />
            <NodeCard node={nodes[7]} isSelected={selectedNode === 'pr'} onSelect={setSelectedNode} />
            <ArrowConnector label="User Approval" />
            <NodeCard node={nodes[8]} isSelected={selectedNode === 'deploy'} onSelect={setSelectedNode} />
          </div>
        </div>
      </div>

      {/* Node Inspector Drawer */}
      <div className="p-6 rounded-xl bg-[#0d121f] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 uppercase">
              Pipeline Stage Inspector
            </span>
            <h3 className="text-base font-bold text-white tracking-tight mt-1">{activeNode.label}</h3>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Status: {activeNode.status}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeNode.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-slate-400">Inbound State & Context</div>
            <div className="text-slate-200">{activeNode.inputs}</div>
          </div>
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <div className="text-[10px] uppercase font-bold text-emerald-400">Outbound State & Artifacts</div>
            <div className="text-slate-200">{activeNode.outputs}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NodeCard: React.FC<{ node: WorkflowNode; isSelected: boolean; onSelect: (id: string) => void }> = ({
  node,
  isSelected,
  onSelect,
}) => {
  return (
    <div
      onClick={() => onSelect(node.id)}
      className={`w-52 p-3.5 rounded-xl border cursor-pointer transition-all ${
        isSelected
          ? 'bg-blue-950/40 border-blue-400 shadow-lg shadow-blue-500/20 scale-105'
          : 'bg-[#0f1526] border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
        <span className="text-[10px] font-mono text-slate-400 uppercase">{node.type}</span>
        <span
          className={`w-2 h-2 rounded-full ${
            node.status === 'running'
              ? 'bg-amber-400 animate-ping'
              : node.status === 'completed'
              ? 'bg-emerald-400'
              : 'bg-slate-600'
          }`}
        />
      </div>
      <h4 className="text-xs font-bold text-white mt-2 leading-tight">{node.label}</h4>
      <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{node.description}</p>
    </div>
  );
};

const ArrowConnector: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex flex-col items-center justify-center space-y-1 px-1">
    <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">{label}</span>
    <ArrowRight className="w-4 h-4 text-slate-600" />
  </div>
);

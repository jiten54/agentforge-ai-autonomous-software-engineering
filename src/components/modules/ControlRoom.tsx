import React, { useState } from 'react';
import {
  Users2,
  Cpu,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertOctagon,
  Clock,
  Sparkles,
  Zap,
  Radio,
  FileCode2,
  Activity,
  Layers,
  ArrowRight,
  RefreshCw,
  Terminal
} from 'lucide-react';
import { AgentInfo, AgentRole } from '../../types';

interface ControlRoomProps {
  agents: AgentInfo[];
  onTriggerAgent: (role: AgentRole) => void;
  onResetAgents: () => void;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const ControlRoom: React.FC<ControlRoomProps> = ({
  agents,
  onTriggerAgent,
  onResetAgents,
  onAddLog,
}) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo>(agents[0]);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users2 className="w-5 h-5 text-indigo-400" />
            <span>Multi-Agent Swarm Control Room</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time execution telemetry, task allocation, state synchronization, and agent-to-agent communication.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onResetAgents}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition flex items-center gap-1.5 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Agent Telemetry</span>
          </button>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {agents.map(agent => {
          const isSelected = selectedAgent.id === agent.id;
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgent(agent)}
              className={`p-5 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#101728] border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                  : 'bg-[#0d121f] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between pb-3 border-b border-slate-800/80">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shadow-inner"
                    style={{ backgroundColor: `${agent.accentColor}20`, color: agent.accentColor }}
                  >
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{agent.name}</h3>
                    <span className="text-[10px] text-slate-400 font-mono">{agent.model}</span>
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

              <div className="py-3 space-y-2">
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {agent.role}
                </p>

                {agent.currentTask && (
                  <div className="p-2 rounded bg-slate-900/80 border border-slate-800/80 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 truncate">
                    <Activity className="w-3.5 h-3.5 text-cyan-400 shrink-0 animate-spin" />
                    <span className="truncate">{agent.currentTask}</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 py-2 text-center text-xs font-mono bg-slate-950/40 rounded-lg border border-slate-800/50">
                <div>
                  <div className="text-[10px] text-slate-500">Latency</div>
                  <div className="text-slate-200 font-medium">{agent.durationMs}ms</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Tokens</div>
                  <div className="text-slate-200 font-medium">{(agent.tokensUsed / 1000).toFixed(1)}k</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500">Success</div>
                  <div className="text-emerald-400 font-medium">{agent.successRate}%</div>
                </div>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">Retries: {agent.retryCount}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTriggerAgent(agent.id);
                  }}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 transition flex items-center gap-1"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Dispatch Agent</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Inspector Drawer / Card */}
      <div className="p-6 rounded-xl bg-[#0d121f] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
              style={{ backgroundColor: `${selectedAgent.accentColor}20`, color: selectedAgent.accentColor }}
            >
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Agent Inspector: {selectedAgent.name}</h3>
              <p className="text-xs text-slate-400">{selectedAgent.tagline}</p>
            </div>
          </div>
          <span className="text-xs font-mono text-slate-400">ID: {selectedAgent.id}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-2 p-4 bg-slate-950/60 rounded-xl border border-slate-800 font-mono">
            <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider">Operational Directives</span>
            <p className="text-slate-300 leading-relaxed font-sans">{selectedAgent.role}</p>
            <div className="pt-2 text-slate-500 space-y-1">
              <div>• Runtime Target: Node.js 22 / Python 3.12 Isolated Container</div>
              <div>• Security Clearance: Non-Root Sandboxed Execution</div>
              <div>• LLM Model Binding: {selectedAgent.model}</div>
            </div>
          </div>

          <div className="space-y-2 p-4 bg-slate-950/60 rounded-xl border border-slate-800 font-mono">
            <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">Swarm Communication Bus</span>
            <div className="text-[11px] text-slate-300 space-y-2">
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span>Inbound Channel:</span>
                <span className="text-blue-400">queue.tasks.orchestration</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span>Outbound Dispatch:</span>
                <span className="text-emerald-400">bus.events.{selectedAgent.id}.completed</span>
              </div>
              <div className="p-2 rounded bg-slate-900 border border-slate-800 flex items-center justify-between">
                <span>Self-Correction Retry Gate:</span>
                <span className="text-amber-400">max_retries = 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

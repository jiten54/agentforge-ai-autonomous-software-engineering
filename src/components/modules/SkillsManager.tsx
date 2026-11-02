import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Cpu,
  Save,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  Terminal,
  Layers,
  Sparkles
} from 'lucide-react';
import { AgentInfo } from '../../types';

interface SkillsManagerProps {
  agents: AgentInfo[];
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const SkillsManager: React.FC<SkillsManagerProps> = ({ agents, onAddLog }) => {
  const [selectedAgent, setSelectedAgent] = useState<AgentInfo>(agents[0]);
  const [systemPrompt, setSystemPrompt] = useState<string>(
    `You are the ${selectedAgent.name} in AgentForge AI.
Your directive is to produce production-ready engineering artifacts adhering to PEP 8, strict TypeScript 5+, and OWASP ASVS v4.0 standards.
Never introduce placeholders, TODO comments, or unverified stub implementations. Verify types, AST syntax, and test boundaries before returning outputs.`
  );
  const [saved, setSaved] = useState(false);

  const [toolClearances, setToolClearances] = useState<Record<string, boolean>>({
    ast_syntax_validator: true,
    isolated_docker_sandbox: true,
    cwe_vulnerability_scanner: true,
    git_signed_commit_engine: true,
    azure_arm_bicep_provisioner: true,
    playwright_headless_browser: true,
  });

  const handleSave = () => {
    setSaved(true);
    onAddLog(`Updated system instruction & skill profile for ${selectedAgent.name}`, selectedAgent.id, 'INFO');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-indigo-400" />
            <span>Agent Skills & Instruction Directives</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure system prompts, tool execution capabilities, thinking budgets, and safety guardrails per agent.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Directives Saved</span>
            </span>
          )}

          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Agent Directives</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Agent Selector + Directives Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Agent Selector */}
        <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider pb-2 border-b border-slate-800">
            Select Agent to Configure
          </div>

          <div className="space-y-1.5">
            {agents.map(a => {
              const isSelected = selectedAgent.id === a.id;
              return (
                <button
                  key={a.id}
                  onClick={() => {
                    setSelectedAgent(a);
                    setSystemPrompt(
                      `You are the ${a.name} in AgentForge AI.
Your directive is to produce production-ready engineering artifacts adhering to PEP 8, strict TypeScript 5+, and OWASP ASVS v4.0 standards.
Never introduce placeholders, TODO comments, or unverified stub implementations. Verify types, AST syntax, and test boundaries before returning outputs.`
                    );
                  }}
                  className={`w-full text-left p-2.5 rounded-lg text-xs font-medium flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-indigo-400" />
                    <span>{a.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">{a.model}</span>
                </button>
              );
            })}
          </div>

          {/* Model Hyperparameters */}
          <div className="pt-4 border-t border-slate-800 space-y-3 text-xs font-mono">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Hyperparameters</div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>Model Engine:</span>
                <span className="text-blue-400">gemini-3.8-flash</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Thinking Level:</span>
                <span className="text-emerald-400">ThinkingLevel.MEDIUM</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Max Self-Correction Retries:</span>
                <span className="text-amber-400">3 Attempts</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: System Prompt & Tool Capabilities */}
        <div className="lg:col-span-2 space-y-4">
          {/* System Instruction Box */}
          <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>System Instruction: {selectedAgent.name}</span>
              </h3>
              <span className="text-[11px] font-mono text-slate-500">Injected into LLM context</span>
            </div>

            <textarea
              rows={8}
              value={systemPrompt}
              onChange={e => setSystemPrompt(e.target.value)}
              className="w-full p-3.5 bg-slate-900 border border-slate-700 rounded-xl text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Tool Capabilities / Permissions */}
          <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Wrench className="w-4 h-4 text-cyan-400" />
                <span>Authorized Tool Clearances</span>
              </h3>
              <span className="text-xs font-mono text-emerald-400">Zero-Trust Sandboxed</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              {Object.entries(toolClearances).map(([tool, enabled]) => (
                <div
                  key={tool}
                  onClick={() => setToolClearances({ ...toolClearances, [tool]: !enabled })}
                  className={`p-3 rounded-lg border cursor-pointer flex items-center justify-between transition ${
                    enabled
                      ? 'bg-cyan-950/20 border-cyan-500/30 text-cyan-300'
                      : 'bg-slate-900/40 border-slate-800 text-slate-500'
                  }`}
                >
                  <span className="truncate">{tool}</span>
                  <input
                    type="checkbox"
                    checked={enabled}
                    readOnly
                    className="rounded bg-slate-800 border-slate-700 text-cyan-500"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  UserCheck,
  Save,
  CheckCircle2,
  Server,
  Cpu,
  Key,
  Lock,
  Sparkles,
  Info
} from 'lucide-react';
import { UserProfile, Project } from '../../types';

interface SettingsAndRbacProps {
  user: UserProfile;
  project: Project;
  onUpdateUserRole: (role: UserProfile['role']) => void;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const SettingsAndRbac: React.FC<SettingsAndRbacProps> = ({
  user,
  project,
  onUpdateUserRole,
  onAddLog,
}) => {
  const [selectedModel, setSelectedModel] = useState<'gemini-3.8-flash' | 'gemini-4-argon'>('gemini-3.8-flash');
  const [sandboxTimeout, setSandboxTimeout] = useState<number>(30);
  const [networkIsolation, setNetworkIsolation] = useState<boolean>(true);
  const [saved, setSaved] = useState(false);

  const roles = [
    {
      role: 'Principal Architect' as const,
      desc: 'Full administrative clearance. Can approve specifications, override security findings, and authorize production releases.',
      perms: ['All Clearances', 'Spec Approval', 'Code Synthesis', 'Security Override', 'Production Deploy'],
    },
    {
      role: 'Senior Full-Stack Dev' as const,
      desc: 'Core development focus. Can trigger code synthesis, edit files in IDE, and create pull requests.',
      perms: ['Code Synthesis', 'IDE Direct Edits', 'Test Execution', 'Pull Request Dispatch'],
    },
    {
      role: 'Lead QA Engineer' as const,
      desc: 'Quality assurance focus. Can execute tests, trigger self-correction cycles, and configure test runners.',
      perms: ['Test Suite Execution', 'Self-Correction Trigger', 'Playwright Config', 'QA Signoff'],
    },
    {
      role: 'Security Lead' as const,
      desc: 'Zero-trust governance. Has exclusive override authority on OWASP SAST blockers and secret scanning.',
      perms: ['Security Audit Execution', 'CWE Override', 'Rulebook Modification', 'Audit Verification'],
    },
    {
      role: 'DevOps Lead' as const,
      desc: 'Release engineering. Can authorize Azure Container Apps deployments, manage rollbacks, and configure CI/CD.',
      perms: ['Container Builds', 'Azure ACA Deploy', 'Rollback Execution', 'Bicep Templates'],
    },
  ];

  const handleSave = () => {
    setSaved(true);
    onAddLog(`Updated project settings and container sandbox policies. Model: ${selectedModel}`, 'orchestrator', 'INFO');
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-400" />
            <span>Identity, RBAC & Platform Configuration</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Role-based access controls (RBAC), LLM model routing, containerized execution sandboxing, and cloud targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Settings Applied</span>
            </span>
          )}

          <button
            onClick={handleSave}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Apply Configuration</span>
          </button>
        </div>
      </div>

      {/* RBAC Identity Section (Module 19) */}
      <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-indigo-400" />
              <span>Module 19: Role-Based Access Control (RBAC)</span>
            </h3>
            <p className="text-xs text-slate-400">Current Active Session: {user.name} ({user.email})</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
            Active: {user.role}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {roles.map(r => {
            const isCurrent = user.role === r.role;
            return (
              <div
                key={r.role}
                onClick={() => onUpdateUserRole(r.role)}
                className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-indigo-950/30 border-indigo-500/50 shadow-md shadow-indigo-500/10'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{r.role}</h4>
                    {isCurrent && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{r.desc}</p>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-800/80 flex flex-wrap gap-1">
                  {r.perms.map(p => (
                    <span key={p} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Settings & API Configuration (Module 20) */}
      <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-4">
        <div className="pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span>Module 20: AI Model Routing & Sandboxing Security</span>
          </h3>
          <p className="text-xs text-slate-400">Underlying LLM SDK integration and isolated execution boundary policies.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
          {/* Left Column: LLM Provider Model */}
          <div className="space-y-3">
            <label className="text-slate-300 font-semibold block">Primary LLM Orchestration Engine</label>
            <div className="space-y-2">
              <label
                onClick={() => setSelectedModel('gemini-3.8-flash')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  selectedModel === 'gemini-3.8-flash'
                    ? 'bg-blue-950/20 border-blue-500/40 text-blue-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <div className="font-bold">gemini-3.8-flash (Recommended)</div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                    High throughput, sub-second latency, optimal for real-time autonomous multi-agent coordination.
                  </div>
                </div>
                <input
                  type="radio"
                  name="model"
                  checked={selectedModel === 'gemini-3.8-flash'}
                  readOnly
                  className="text-blue-500"
                />
              </label>

              <label
                onClick={() => setSelectedModel('gemini-4-argon')}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                  selectedModel === 'gemini-4-argon'
                    ? 'bg-blue-950/20 border-blue-500/40 text-blue-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400'
                }`}
              >
                <div>
                  <div className="font-bold">gemini-4-argon (Advanced Reasoning)</div>
                  <div className="text-[10px] text-slate-500 font-sans mt-0.5">
                    Extended thinking mode for complex mathematical proofs, deep refactoring, and kernel algorithms.
                  </div>
                </div>
                <input
                  type="radio"
                  name="model"
                  checked={selectedModel === 'gemini-4-argon'}
                  readOnly
                  className="text-blue-500"
                />
              </label>
            </div>
          </div>

          {/* Right Column: Execution Sandbox Guardrails */}
          <div className="space-y-3">
            <label className="text-slate-300 font-semibold block">Isolated Disposable Container Sandboxing</label>
            
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 text-slate-300">
              <div className="flex items-center justify-between">
                <span>Network Egress Restriction:</span>
                <span className="text-emerald-400 font-bold">Enabled (No WAN Access)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Container Execution Timeout:</span>
                <span className="text-cyan-400 font-bold">{sandboxTimeout} Seconds</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Sandbox Memory Quota:</span>
                <span className="text-purple-400 font-bold">1024 MB Maximum</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Root Privilege Drop (CWE-250):</span>
                <span className="text-emerald-400 font-bold">appuser (UID 1001)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

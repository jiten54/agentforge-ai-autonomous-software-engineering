import React, { useState } from 'react';
import {
  FileCode2,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Send,
  Layers,
  Database,
  ShieldCheck,
  Terminal,
  Code2,
  FileCheck2,
  Clock,
  ExternalLink,
  Edit3
} from 'lucide-react';
import { Specification, DevTask } from '../../types';
import { agentApi } from '../../services/api';

interface RequirementStudioProps {
  currentSpec: Specification;
  onUpdateSpec: (spec: Specification) => void;
  onApproveSpec: (spec: Specification) => void;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

const PRESET_REQUIREMENTS = [
  {
    title: "Enterprise Auth & RBAC",
    text: "Build a customer authentication system with registration, email verification, password reset, and role-based access control (Admin, Developer, Auditor) using PostgreSQL and FastAPI."
  },
  {
    title: "Distributed Task Queue & Dead-Letter Queue",
    text: "Implement an asynchronous background job processing system with Redis-backed priority queues, exponential backoff retries, and dead-letter queue inspection."
  },
  {
    title: "Stripe Billing & Metered Usage Microservice",
    text: "Create a subscription billing engine handling Stripe webhook signatures, idempotent transaction logs, and metered API usage tracking."
  }
];

export const RequirementStudio: React.FC<RequirementStudioProps> = ({
  currentSpec,
  onUpdateSpec,
  onApproveSpec,
  onAddLog,
}) => {
  const [requirementText, setRequirementText] = useState(
    "Build a customer authentication system with registration, email verification, password reset and role-based access control."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'api' | 'database' | 'criteria' | 'tasks'>('architecture');
  const [isApproved, setIsApproved] = useState(false);

  const handleSynthesizeSpec = async () => {
    if (!requirementText.trim()) return;
    setIsGenerating(true);
    setIsApproved(false);
    onAddLog(`Specification Agent triggered with requirement: "${requirementText.slice(0, 60)}..."`, 'specification', 'AGENT');

    try {
      const generatedSpec = await agentApi.generateSpecification(requirementText);
      onUpdateSpec(generatedSpec);
      onAddLog(`Specification generated successfully: ${generatedSpec.title}`, 'specification', 'INFO');
    } catch (err: any) {
      console.error(err);
      onAddLog(`Specification synthesis error: ${err.message}`, 'specification', 'ERROR');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = () => {
    setIsApproved(true);
    onApproveSpec(currentSpec);
    onAddLog(`Specification approved by user. Decomposed into ${currentSpec.tasks.length} development tasks.`, 'orchestrator', 'AGENT');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-cyan-400" />
            <span>Requirement-to-Specification Studio</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Converts natural-language product requests into exhaustive RFC-compliant technical specifications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isApproved ? (
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>Specification Approved</span>
            </span>
          ) : (
            <button
              onClick={handleApprove}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold tracking-wide transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve & Dispatch Tasks</span>
            </button>
          )}
        </div>
      </div>

      {/* Requirement Input Area */}
      <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Describe Software Requirements (Natural Language)</span>
          </label>
          <span className="text-[11px] text-slate-500 font-mono">Agent: Specification Agent (Gemini 3.8 Flash)</span>
        </div>

        <textarea
          rows={3}
          value={requirementText}
          onChange={e => setRequirementText(e.target.value)}
          placeholder="e.g., Build a customer authentication system with registration, email verification, password reset and role-based access control..."
          className="w-full p-3.5 bg-slate-900 border border-slate-700/80 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-cyan-500 transition leading-relaxed resize-y font-mono"
        />

        {/* Presets and Submit */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">Presets:</span>
            {PRESET_REQUIREMENTS.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => setRequirementText(preset.text)}
                className="text-[11px] px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                {preset.title}
              </button>
            ))}
          </div>

          <button
            onClick={handleSynthesizeSpec}
            disabled={isGenerating || !requirementText}
            className={`px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-2 ${
              isGenerating
                ? 'bg-cyan-600/30 text-cyan-200 cursor-wait'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 active:scale-95'
            }`}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-300" />
                <span>Synthesizing Technical Spec...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Generate Technical Spec</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Generated Specification Preview */}
      <div className="rounded-xl bg-[#0d121f] border border-slate-800 overflow-hidden shadow-xl">
        {/* Spec Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/60 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Generated Architecture Spec
            </span>
            <h3 className="text-base font-bold text-white tracking-tight">{currentSpec.title}</h3>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3 py-1 rounded-md transition ${activeTab === 'architecture' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Architecture
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`px-3 py-1 rounded-md transition ${activeTab === 'api' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              API Endpoints
            </button>
            <button
              onClick={() => setActiveTab('database')}
              className={`px-3 py-1 rounded-md transition ${activeTab === 'database' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              DB Schema
            </button>
            <button
              onClick={() => setActiveTab('criteria')}
              className={`px-3 py-1 rounded-md transition ${activeTab === 'criteria' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Acceptance
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={`px-3 py-1 rounded-md transition ${activeTab === 'tasks' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
            >
              Tasks ({currentSpec.tasks.length})
            </button>
          </div>
        </div>

        {/* Spec Tab Contents */}
        <div className="p-6">
          {/* Summary Box */}
          <div className="mb-6 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80">
            <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">Executive Summary</div>
            <p className="text-xs text-slate-300 leading-relaxed font-mono">{currentSpec.summary}</p>
          </div>

          {/* Tab 1: Architecture */}
          {activeTab === 'architecture' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
                    <Code2 className="w-4 h-4" />
                    <span>Frontend Architecture</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">{currentSpec.architecture.frontend}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
                    <Terminal className="w-4 h-4" />
                    <span>Backend Microservices</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">{currentSpec.architecture.backend}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-400">
                    <Database className="w-4 h-4" />
                    <span>PostgreSQL Database & Relational Schema</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">{currentSpec.architecture.database}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Zero-Trust Security & RBAC</span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">{currentSpec.architecture.security}</p>
                </div>
              </div>

              {/* Functional & Non-Functional Requirements */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Functional Requirements</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentSpec.functionalRequirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-blue-400">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">Non-Functional Requirements</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {currentSpec.nonFunctionalRequirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-400">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: API Endpoints */}
          {activeTab === 'api' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-3">Method</th>
                    <th className="p-3">Endpoint Path</th>
                    <th className="p-3">Description</th>
                    <th className="p-3">Auth Scope</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentSpec.apiEndpoints.map((ep, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/40">
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            ep.method === 'GET'
                              ? 'bg-blue-500/20 text-blue-400'
                              : ep.method === 'POST'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : ep.method === 'DELETE'
                              ? 'bg-rose-500/20 text-rose-400'
                              : 'bg-amber-500/20 text-amber-400'
                          }`}
                        >
                          {ep.method}
                        </span>
                      </td>
                      <td className="p-3 font-semibold text-slate-200">{ep.path}</td>
                      <td className="p-3 text-slate-400 font-sans">{ep.description}</td>
                      <td className="p-3">
                        {ep.auth ? (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                            Bearer Token
                          </span>
                        ) : (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            Public
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Tab 3: Database Schema */}
          {activeTab === 'database' && (
            <div className="space-y-4">
              {currentSpec.databaseSchema.map((table, tIdx) => (
                <div key={tIdx} className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3 font-mono">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-sm font-bold text-cyan-400 flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      <span>Table: {table.table}</span>
                    </span>
                    <span className="text-[11px] text-slate-500">PostgreSQL 16 Engine</span>
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Columns & Types:</div>
                    <ul className="text-xs text-slate-300 space-y-1 pl-3 border-l-2 border-cyan-500/30">
                      {table.fields.map((f, fIdx) => (
                        <li key={fIdx}>{f}</li>
                      ))}
                    </ul>
                  </div>

                  {table.indexes && table.indexes.length > 0 && (
                    <div className="space-y-1 pt-2">
                      <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Indexes & Constraints:</div>
                      <ul className="text-xs text-amber-300/80 space-y-1 pl-3 border-l-2 border-amber-500/30">
                        {table.indexes.map((idxStr, iIdx) => (
                          <li key={iIdx}>{idxStr}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Tab 4: Acceptance Criteria */}
          {activeTab === 'criteria' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">RFC Acceptance Verification Suite</h4>
              <div className="space-y-2">
                {currentSpec.acceptanceCriteria.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-relaxed">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 5: Tasks Breakdown */}
          {activeTab === 'tasks' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Decomposed Engineering Work Items</h4>
                <span className="text-xs font-mono text-slate-400">{currentSpec.tasks.length} Atomic Tasks</span>
              </div>
              <div className="space-y-2">
                {currentSpec.tasks.map((task) => (
                  <div key={task.id} className="p-3 bg-slate-900/60 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 font-semibold">
                        {task.id}
                      </span>
                      <span className="text-xs font-medium text-slate-200">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono text-[10px]">
                        Complexity: {task.complexity}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono text-[10px]">
                        {task.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

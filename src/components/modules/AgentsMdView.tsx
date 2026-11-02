import React, { useState } from 'react';
import {
  FileSignature,
  Sparkles,
  Copy,
  CheckCircle2,
  RefreshCw,
  Download,
  BookOpen,
  Edit3
} from 'lucide-react';
import { Project } from '../../types';
import { agentApi } from '../../services/api';

interface AgentsMdViewProps {
  project: Project;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const AgentsMdView: React.FC<AgentsMdViewProps> = ({ project, onAddLog }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [content, setContent] = useState<string>(`# AGENTS.md — Autonomous Engineering Protocol for ${project.name}

Welcome, Agent. This repository is governed by **AgentForge AI** autonomous software engineering standards. All agent executions must strictly comply with the following instructions.

---

## 1. AGENT ROLES & CLEARANCE

| Agent Name | Scope & Clearances | Execution Constraints |
|:---|:---|:---|
| **Orchestrator Agent** | Task planning, dependency resolution, execution graphs | Never writes code directly; coordinates swarm. |
| **Specification Agent** | Technical specs, acceptance criteria, schema definition | Output must follow RFC 2119 keyword standards. |
| **Developer Agent** | Code generation, architectural modules, migrations | Must adhere to repository design system & type safety. |
| **Testing Agent** | Unit, integration & Playwright E2E test generation | Must run tests in sandboxed container; never skips failures. |
| **Code Reviewer Agent**| Static analysis, OWASP scanning, PR signoff | Must block deployments on Critical or High CVEs. |
| **Deployment Agent** | Container builds, Azure Container Apps & CI/CD | Requires verified build pass and user confirmation. |

---

## 2. CODING & ARCHITECTURAL STANDARDS

### Python / FastAPI Backend
- **Type Annotations**: 100% type hints on all functions and async endpoints.
- **Validation**: Enforce \`pydantic.BaseModel\` with \`Field(..., min_length=..., max_length=...)\`.
- **Async First**: Use \`async def\` for I/O operations and database transactions.
- **SQL Injection**: NEVER concatenate raw SQL strings. Always utilize SQLAlchemy ORM parameterized statements.

### TypeScript / React Frontend
- **No Any**: Avoid \`any\` under all circumstances. Use generics and discriminated unions.
- **Styling**: Use utility classes (Tailwind CSS v4). Avoid ad-hoc inline styles.
- **State**: Prefer local state or optimistic UI dispatch with explicit error boundaries.

---

## 3. TESTING & VERIFICATION PROTOCOL
1. **Zero-Flake Policy**: Playwright tests must use \`waitForSelector\` or web assertions, never arbitrary sleep calls.
2. **Self-Correction Loop**: When a test fails, the Testing Agent captures the exact failure log and passes it to the Developer Agent for automated remediation up to 3 retry attempts.

---

## 4. SECURITY & COMPLIANCE RULES
- **Secret Scanning**: Never commit \`.env\`, passwords, private keys, or credentials.
- **CORS**: Never deploy with wildcard \`*\` origins in production configurations.
- **Audit Logging**: Every mutating API action must record an immutable audit log entry.
`);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    onAddLog('Synthesizing repository AGENTS.md rulebook with latest engineering guidelines...', 'orchestrator', 'AGENT');

    try {
      const res = await agentApi.generateAgentsMd(project.name, project.framework);
      setContent(res.content);
      onAddLog('AGENTS.md generated and validated against Spektra Systems autonomous engineering standards.', 'orchestrator', 'INFO');
    } catch (err: any) {
      console.error(err);
      onAddLog(`Failed to regenerate AGENTS.md: ${err.message}`, 'orchestrator', 'ERROR');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AGENTS.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileSignature className="w-5 h-5 text-indigo-400" />
            <span>AGENTS.md Intelligent Instructions Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Repository-level governance contract defining autonomous agent behaviors, safety bounds, and architectural rules.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
              isGenerating
                ? 'bg-indigo-600/30 text-indigo-200 cursor-wait'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {isGenerating ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>Regenerate AGENTS.md</span>
          </button>

          <button
            onClick={handleDownload}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export AGENTS.md</span>
          </button>
        </div>
      </div>

      {/* Editor & Content View */}
      <div className="rounded-xl bg-[#0d121f] border border-slate-800 overflow-hidden flex flex-col">
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 font-mono">
            <span>/AGENTS.md</span>
            <span className="text-slate-600">•</span>
            <span className="text-emerald-400">RFC Governance Contract</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Render Markdown' : 'Edit Source'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs flex items-center gap-1 transition"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <div className="p-6 bg-[#080c14] min-h-[480px]">
          {isEditMode ? (
            <textarea
              rows={22}
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-blue-500 resize-y"
            />
          ) : (
            <div className="prose prose-invert max-w-none text-slate-200 text-xs font-mono leading-relaxed whitespace-pre-wrap">
              {content}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

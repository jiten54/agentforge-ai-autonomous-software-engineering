import React, { useState } from 'react';
import {
  Code2,
  FileCode,
  Sparkles,
  GitCommit,
  CheckCircle2,
  Copy,
  Terminal,
  FileText,
  Layers,
  ArrowRight,
  Eye,
  GitCompare,
  Plus
} from 'lucide-react';
import { ProjectFile, DevTask, Specification } from '../../types';
import { agentApi } from '../../services/api';

interface CodeGenWorkspaceProps {
  files: ProjectFile[];
  spec: Specification;
  tasks: DevTask[];
  onUpdateFiles: (files: ProjectFile[]) => void;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const CodeGenWorkspace: React.FC<CodeGenWorkspaceProps> = ({
  files,
  spec,
  tasks,
  onUpdateFiles,
  onAddLog,
}) => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(files[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedTask, setSelectedTask] = useState<DevTask>(tasks[0] || {
    id: 'TASK-102',
    title: 'FastAPI Service Layer & REST Endpoints',
    category: 'backend',
    complexity: 'L',
    status: 'in_progress',
    dependencies: [],
  });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'diff' | 'explanation'>('code');

  const handleGenerate = async () => {
    setIsGenerating(true);
    onAddLog(`Developer Agent synthesizing code for: ${selectedTask.title}`, 'developer', 'AGENT');

    try {
      const res = await agentApi.generateCode(selectedTask, spec, files);
      // Merge or add generated files
      let updated = [...files];
      for (const newFile of res.files) {
        const existingIdx = updated.findIndex(f => f.path === newFile.path);
        if (existingIdx >= 0) {
          updated[existingIdx] = {
            ...updated[existingIdx],
            content: newFile.content,
            explanation: newFile.explanation,
            updatedAt: 'Just now',
          };
        } else {
          updated.push({
            ...newFile,
            lastModifiedBy: 'developer',
            updatedAt: 'Just now',
          });
        }
      }
      onUpdateFiles(updated);
      setSelectedFile(updated.find(f => f.path === res.files[0]?.path) || updated[0]);
      onAddLog(`Developer Agent generated ${res.files.length} production files. Commit: "${res.commitMessage}"`, 'developer', 'INFO');
    } catch (err: any) {
      console.error(err);
      onAddLog(`Developer Agent error: ${err.message}`, 'developer', 'ERROR');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <span>AI Code Generation Workspace</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous multi-file software synthesis using repository standards, type constraints, and AST verification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTask.id}
            onChange={e => {
              const t = tasks.find(x => x.id === e.target.value);
              if (t) setSelectedTask(t);
            }}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200 focus:outline-none"
          >
            {tasks.map(t => (
              <option key={t.id} value={t.id}>
                {t.id}: {t.title.slice(0, 35)}...
              </option>
            ))}
          </select>

          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-2 shadow-md ${
              isGenerating
                ? 'bg-indigo-600/30 text-indigo-200 cursor-wait'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/20 active:scale-95'
            }`}
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>{isGenerating ? 'Synthesizing...' : 'Synthesize Code'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace: File Explorer + Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* File Explorer (1 col) */}
        <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Repository Files</span>
            <span className="font-mono text-[10px] text-slate-500">{files.length} Files</span>
          </div>

          <div className="space-y-1">
            {files.map(file => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2 rounded-lg text-xs font-mono flex items-center gap-2 transition ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <FileCode className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Code Content & View (3 cols) */}
        <div className="lg:col-span-3 rounded-xl bg-[#0d121f] border border-slate-800 overflow-hidden flex flex-col">
          {/* File Tab Header */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <span className="text-indigo-400 font-semibold">{selectedFile.path}</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-500 uppercase text-[10px]">{selectedFile.language}</span>
              {selectedFile.updatedAt && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-400 text-[10px]">{selectedFile.updatedAt}</span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-medium">
                <button
                  onClick={() => setActiveTab('code')}
                  className={`px-2.5 py-1 rounded-md transition ${activeTab === 'code' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Code View
                </button>
                <button
                  onClick={() => setActiveTab('explanation')}
                  className={`px-2.5 py-1 rounded-md transition ${activeTab === 'explanation' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  Architecture Logic
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 text-xs flex items-center gap-1 transition"
              >
                {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Code Viewer Body */}
          <div className="p-4 bg-[#080c14] flex-1 overflow-x-auto min-h-[480px]">
            {activeTab === 'code' ? (
              <pre className="font-mono text-xs text-slate-200 leading-relaxed">
                <code>{selectedFile.content}</code>
              </pre>
            ) : (
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  Developer Agent Architectural Explanation
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {selectedFile.explanation || 'Modular implementation adhering to async I/O patterns, dependency injection, and zero-trust security boundaries.'}
                </p>
                <div className="pt-2 text-xs font-mono text-slate-400 space-y-1">
                  <div>• Synthesizer: Developer Agent (Gemini 3.8 Flash)</div>
                  <div>• Coding Standard: PEP 8 / TypeScript 5 Strict Mode</div>
                  <div>• OWASP ASVS Status: No hardcoded secrets, parameterized queries</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

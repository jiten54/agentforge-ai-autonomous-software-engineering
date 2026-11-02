import React, { useState } from 'react';
import {
  FileText,
  GitPullRequest,
  CheckCircle2,
  Copy,
  ExternalLink,
  Sparkles,
  GitBranch,
  ShieldCheck,
  Tag,
  RefreshCw,
  Edit3
} from 'lucide-react';
import { PullRequest, Specification, TestReport, CodeReview } from '../../types';
import { agentApi } from '../../services/api';

interface PullRequestGeneratorProps {
  pullRequest: PullRequest;
  spec: Specification;
  testReport: TestReport;
  review: CodeReview;
  onUpdatePullRequest: (pr: PullRequest) => void;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const PullRequestGenerator: React.FC<PullRequestGeneratorProps> = ({
  pullRequest,
  spec,
  testReport,
  review,
  onUpdatePullRequest,
  onAddLog,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [markdownContent, setMarkdownContent] = useState(pullRequest.markdown);
  const [prCreatedNotice, setPrCreatedNotice] = useState(false);

  const handleRegenerate = async () => {
    setIsGenerating(true);
    onAddLog('Deployment Agent generating updated Pull Request documentation with full test & security audit summary...', 'deployment', 'AGENT');

    try {
      const pr = await agentApi.generatePullRequest(
        spec,
        spec.tasks[0],
        testReport.executionSummary,
        review,
        pullRequest.branch
      );
      onUpdatePullRequest(pr);
      setMarkdownContent(pr.markdown);
      onAddLog(`Generated GitHub Pull Request #${pr.number}: ${pr.title}`, 'deployment', 'INFO');
    } catch (err: any) {
      console.error(err);
      onAddLog(`PR generation error: ${err.message}`, 'deployment', 'ERROR');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSubmit = () => {
    setPrCreatedNotice(true);
    onAddLog(`Pull Request #${pullRequest.number} submitted to GitHub remote repository (Base: ${pullRequest.base} <- Head: ${pullRequest.branch})`, 'deployment', 'INFO');
    setTimeout(() => setPrCreatedNotice(false), 4000);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <span>Autonomous Pull Request Generator</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise pull request compiler containing technical specifications, test validation metrics, and security audits.
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
            <span>Regenerate PR</span>
          </button>

          <button
            onClick={handleSimulateSubmit}
            className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <GitPullRequest className="w-4 h-4" />
            <span>Submit to GitHub</span>
          </button>
        </div>
      </div>

      {/* Submitted Notice */}
      {prCreatedNotice && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between font-mono animate-fadeIn">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Pull Request #{pullRequest.number} dispatched to repository. CI/CD checks started!</span>
          </div>
          <span className="font-bold">STATUS: OPEN</span>
        </div>
      )}

      {/* PR Metadata Card */}
      <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-blue-400 font-mono">#{pullRequest.number}</span>
            <h3 className="text-base font-bold text-white tracking-tight">{pullRequest.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{pullRequest.status.toUpperCase()}</span>
            </span>
          </div>
        </div>

        {/* Branch Flow and Labels */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <GitBranch className="w-3.5 h-3.5 text-slate-500" />
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-blue-400">{pullRequest.base}</span>
            <span className="text-slate-500">←</span>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">{pullRequest.branch}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            {pullRequest.labels.map(label => (
              <span key={label} className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* PR Markdown Body Preview & Editor */}
      <div className="rounded-xl bg-[#0d121f] border border-slate-800 overflow-hidden flex flex-col">
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
            <span>Pull Request Description (Markdown)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className="px-2.5 py-1 text-xs rounded bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition flex items-center gap-1"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditMode ? 'Preview' : 'Edit'}</span>
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

        <div className="p-6 bg-[#080c14] min-h-[420px]">
          {isEditMode ? (
            <textarea
              rows={18}
              value={markdownContent}
              onChange={e => setMarkdownContent(e.target.value)}
              className="w-full p-4 bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-xs font-mono leading-relaxed focus:outline-none focus:border-blue-500 resize-y"
            />
          ) : (
            <div className="prose prose-invert max-w-none text-slate-200 text-xs font-sans leading-relaxed whitespace-pre-wrap font-mono">
              {markdownContent}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

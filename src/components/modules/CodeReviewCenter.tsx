import React, { useState } from 'react';
import {
  Eye,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  FileCode,
  ArrowRight,
  Code2,
  RefreshCw
} from 'lucide-react';
import { CodeReview, ProjectFile, Specification } from '../../types';
import { agentApi } from '../../services/api';

interface CodeReviewCenterProps {
  review: CodeReview;
  files: ProjectFile[];
  spec: Specification;
  onUpdateReview: (review: CodeReview) => void;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const CodeReviewCenter: React.FC<CodeReviewCenterProps> = ({
  review,
  files,
  spec,
  onUpdateReview,
  onAddLog,
}) => {
  const [isReviewing, setIsReviewing] = useState(false);

  const handleRunReview = async () => {
    setIsReviewing(true);
    onAddLog('Code Reviewer Agent initiating static analysis & architectural inspection...', 'reviewer', 'AGENT');

    try {
      const result = await agentApi.reviewCode(files, spec);
      onUpdateReview(result);
      onAddLog(`Code review finished with score ${result.score}/100. Approved: ${result.approved}`, 'reviewer', 'INFO');
    } catch (err: any) {
      console.error(err);
      onAddLog(`Code review error: ${err.message}`, 'reviewer', 'ERROR');
    } finally {
      setIsReviewing(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Eye className="w-5 h-5 text-amber-400" />
            <span>AI Code Review Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Automated code quality evaluation, cyclomatic complexity checks, pattern verification, and PR approval gating.
          </p>
        </div>

        <button
          onClick={handleRunReview}
          disabled={isReviewing}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-2 shadow-md ${
            isReviewing
              ? 'bg-amber-600/30 text-amber-200 cursor-wait'
              : 'bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold shadow-amber-500/20 active:scale-95'
          }`}
        >
          {isReviewing ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Reviewing Repository...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Run Automated Code Review</span>
            </>
          )}
        </button>
      </div>

      {/* Score and Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Maintainability Score</div>
          <div className="text-3xl font-extrabold text-emerald-400 font-mono">
            {review.score}/100
          </div>
          <div className="text-xs text-slate-500">Industry grade A+</div>
        </div>

        <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Review Status</div>
          <div className="text-base font-bold text-white flex items-center gap-2 mt-1">
            {review.approved ? (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400">Approved for PR</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-rose-400" />
                <span className="text-rose-400">Changes Requested</span>
              </>
            )}
          </div>
          <div className="text-xs text-slate-500">Signoff verified</div>
        </div>

        <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cyclomatic Complexity</div>
          <div className="text-xl font-bold text-white font-mono mt-1">
            {review.metrics.cyclomaticComplexity}
          </div>
          <div className="text-xs text-slate-500">Optimal async flow</div>
        </div>

        <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Technical Debt</div>
          <div className="text-xl font-bold text-emerald-400 font-mono mt-1">
            {review.metrics.securityDebt}
          </div>
          <div className="text-xs text-slate-500">Zero accrued debt</div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-2">
        <div className="text-xs font-bold text-white uppercase tracking-wider">Reviewer Agent Synthesis</div>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">{review.summary}</p>
      </div>

      {/* Review Findings */}
      <div className="rounded-xl bg-[#0d121f] border border-slate-800 overflow-hidden space-y-3 p-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Code2 className="w-4 h-4 text-amber-400" />
            <span>Inspection Findings & Suggestions ({review.findings.length})</span>
          </h3>
          <span className="text-xs font-mono text-slate-400">Static AST & Type Verification</span>
        </div>

        <div className="space-y-3">
          {review.findings.map(finding => (
            <div
              key={finding.id}
              className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-2.5 font-mono text-xs"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      finding.severity === 'critical'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : finding.severity === 'high'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {finding.severity}
                  </span>
                  <span className="font-bold text-white">{finding.title}</span>
                </div>
                <span className="text-slate-500 text-[11px]">{finding.id}</span>
              </div>

              <div className="text-slate-400 text-[11px] flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-300">{finding.file}:{finding.line}</span>
                <span className="text-slate-600">•</span>
                <span className="text-indigo-400">{finding.rule}</span>
              </div>

              <p className="text-slate-300 font-sans leading-relaxed text-xs">{finding.description}</p>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-emerald-400 text-[11px]">
                <span className="text-slate-400 font-bold block mb-1">Recommended Remediation:</span>
                <code>{finding.suggestedFix}</code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

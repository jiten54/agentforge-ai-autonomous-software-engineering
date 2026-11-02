import React, { useState } from 'react';
import {
  FlaskConical,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Terminal,
  Activity,
  Layers,
  Sparkles,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { TestReport, TestResultItem, ProjectFile, Specification } from '../../types';
import { agentApi } from '../../services/api';

interface TestingLabProps {
  testReport: TestReport;
  files: ProjectFile[];
  spec: Specification;
  onUpdateReport: (report: TestReport) => void;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const TestingLab: React.FC<TestingLabProps> = ({
  testReport,
  files,
  spec,
  onUpdateReport,
  onAddLog,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isSelfCorrecting, setIsSelfCorrecting] = useState(false);
  const [selectedResult, setSelectedResult] = useState<TestResultItem | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'unit' | 'integration' | 'e2e'>('all');

  const handleRunTests = async (simulateFailure: boolean = false) => {
    setIsRunning(true);
    onAddLog(`Testing Agent initiating test execution in isolated sandbox (Simulate failure: ${simulateFailure})...`, 'testing', 'AGENT');

    try {
      const report = await agentApi.runTests(files, spec, simulateFailure);
      onUpdateReport(report);
      onAddLog(
        `Tests finished: ${report.executionSummary.passed}/${report.executionSummary.total} passed in ${report.executionSummary.durationMs}ms (${report.executionSummary.coveragePercentage}% coverage).`,
        'testing',
        report.executionSummary.failed > 0 ? 'WARN' : 'INFO'
      );

      if (report.selfCorrectionRequired) {
        setSelectedResult(report.results.find(r => r.status === 'failed') || null);
      }
    } catch (err: any) {
      console.error(err);
      onAddLog(`Test execution failed: ${err.message}`, 'testing', 'ERROR');
    } finally {
      setIsRunning(false);
    }
  };

  const handleTriggerSelfCorrection = async () => {
    setIsSelfCorrecting(true);
    onAddLog('Self-Correction Loop triggered: Testing Agent dispatching failure diagnostic to Developer Agent...', 'testing', 'AGENT');

    setTimeout(async () => {
      onAddLog('Developer Agent generated hotfix patch addressing boundary rate-limiting issue.', 'developer', 'AGENT');
      
      try {
        const cleanReport = await agentApi.runTests(files, spec, false);
        onUpdateReport(cleanReport);
        setSelectedResult(null);
        onAddLog('Testing Agent re-executed test suite. All tests are now GREEN (100% pass rate). Acceptance criteria satisfied!', 'testing', 'INFO');
      } catch (err: any) {
        onAddLog(`Self-correction error: ${err.message}`, 'developer', 'ERROR');
      } finally {
        setIsSelfCorrecting(false);
      }
    }, 1800);
  };

  const filteredResults = filterType === 'all'
    ? testReport.results
    : testReport.results.filter(r => r.type === filterType);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-emerald-400" />
            <span>Automated Testing Laboratory & QA Sandbox</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Isolated container execution of Unit (Pytest), Integration (FastAPI), and E2E (Playwright) suites with automated self-correction loops.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Simulate Failure Button for demonstration */}
          <button
            onClick={() => handleRunTests(true)}
            disabled={isRunning || isSelfCorrecting}
            className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Simulate Failure Case</span>
          </button>

          {/* Normal Test Run */}
          <button
            onClick={() => handleRunTests(false)}
            disabled={isRunning || isSelfCorrecting}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-2 shadow-md ${
              isRunning
                ? 'bg-emerald-600/30 text-emerald-200 cursor-wait'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20 active:scale-95'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-300" />
                <span>Executing In Sandbox...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute Test Suite</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Test Pass Rate</div>
          <div className="text-2xl font-bold text-white font-mono flex items-center gap-2">
            <span>{testReport.executionSummary.passed} / {testReport.executionSummary.total}</span>
            {testReport.executionSummary.failed === 0 ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-400" />
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Branch Coverage</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {testReport.executionSummary.coveragePercentage}%
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Execution Latency</div>
          <div className="text-2xl font-bold text-blue-400 font-mono">
            {testReport.executionSummary.durationMs}ms
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 space-y-1">
          <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Isolation Mode</div>
          <div className="text-sm font-bold text-purple-300 font-mono flex items-center gap-1.5 mt-1">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            <span>Disposable Container</span>
          </div>
        </div>
      </div>

      {/* Self-Correction Banner if failure exists */}
      {testReport.selfCorrectionRequired && (
        <div className="p-5 rounded-xl bg-amber-950/30 border border-amber-500/40 shadow-lg space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <span>Self-Correction Loop Active: 1 Test Failure Detected</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300">
              Retry Attempt 1/3
            </span>
          </div>
          <p className="text-xs text-slate-300 font-sans leading-relaxed">
            The Testing Agent identified a regression in rate limiter boundary handling. The Developer Agent can autonomously analyze the error stack trace, synthesize a patch, and rerun verification.
          </p>
          <div className="pt-2">
            <button
              onClick={handleTriggerSelfCorrection}
              disabled={isSelfCorrecting}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition flex items-center gap-2 ${
                isSelfCorrecting
                  ? 'bg-amber-600/30 text-amber-200 cursor-wait'
                  : 'bg-amber-600 hover:bg-amber-500 text-slate-900 font-extrabold shadow-md'
              }`}
            >
              {isSelfCorrecting ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Developer Agent Patching & Rerunning...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Trigger Automated Self-Correction Loop</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Test Results Table */}
      <div className="rounded-xl bg-[#0d121f] border border-slate-800 overflow-hidden">
        {/* Table Filter Tabs */}
        <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Test Executions</span>
            <span className="text-xs font-mono text-slate-500">({filteredResults.length} Cases)</span>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
            {(['all', 'unit', 'integration', 'e2e'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-2.5 py-1 rounded-md uppercase text-[10px] font-mono transition ${
                  filterType === type ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="divide-y divide-slate-800/60">
          {filteredResults.map((item, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedResult(item)}
              className={`p-3.5 hover:bg-slate-900/40 cursor-pointer transition flex items-center justify-between ${
                selectedResult?.name === item.name ? 'bg-slate-900/80' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                {item.status === 'passed' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0 animate-pulse" />
                )}
                <div>
                  <div className="text-xs font-mono font-semibold text-slate-200">{item.name}</div>
                  <div className="text-[11px] text-slate-500 font-mono capitalize">{item.type} test case</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="text-slate-400">{item.duration}</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    item.status === 'passed'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Failure / Test Diagnostic Modal / Drawer */}
      {selectedResult && (
        <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-700 space-y-3 font-mono text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="font-bold text-white flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span>Inspection: {selectedResult.name}</span>
            </span>
            <button
              onClick={() => setSelectedResult(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <div>
              <span className="text-slate-500">Framework: </span>
              <span className="text-slate-300">{selectedResult.type === 'e2e' ? 'Playwright' : 'Pytest'}</span>
            </div>
            {selectedResult.error && (
              <div className="p-3 bg-rose-950/40 rounded-lg border border-rose-500/30 text-rose-300">
                <div className="font-bold mb-1">Stack Trace Error:</div>
                <div>{selectedResult.error}</div>
              </div>
            )}
            {selectedResult.failureDetail && (
              <div className="p-3 bg-amber-950/40 rounded-lg border border-amber-500/30 text-amber-300">
                <div className="font-bold mb-1">Testing Agent Diagnostic:</div>
                <div>{selectedResult.failureDetail}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

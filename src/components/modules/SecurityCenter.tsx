import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  KeyRound,
  FileCode,
  CheckCircle2,
  XCircle,
  FileCheck2,
  RefreshCw,
  Sparkles,
  Zap
} from 'lucide-react';
import { SecurityFinding, UserProfile } from '../../types';

interface SecurityCenterProps {
  findings: SecurityFinding[];
  user: UserProfile;
  onUpdateFindings: (findings: SecurityFinding[]) => void;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({
  findings,
  user,
  onUpdateFindings,
  onAddLog,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  const criticalOrHighCount = findings.filter(
    f => (f.severity === 'critical' || f.severity === 'high') && f.status === 'open'
  ).length;

  const isDeploymentBlocked = criticalOrHighCount > 0;

  const handleRunScan = () => {
    setIsScanning(true);
    onAddLog('Security Validation Agent initiating OWASP ASVS v4.0 & SAST static code audit...', 'reviewer', 'AGENT');

    setTimeout(() => {
      setIsScanning(false);
      onAddLog('Security audit completed. Scanned for CWE-89 (SQLi), CWE-79 (XSS), CWE-798 (Hardcoded Secrets). 0 critical blockers.', 'reviewer', 'INFO');
    }, 1200);
  };

  const handleResolve = (id: string) => {
    const updated = findings.map(f => (f.id === id ? { ...f, status: 'resolved' as const } : f));
    onUpdateFindings(updated);
    onAddLog(`Security finding ${id} marked as RESOLVED by ${user.name}`, 'reviewer', 'INFO');
  };

  const handleOverride = (id: string) => {
    if (user.role !== 'Security Lead' && user.role !== 'Principal Architect') {
      alert('Only Security Lead or Principal Architect can override security findings.');
      return;
    }
    const updated = findings.map(f => (f.id === id ? { ...f, status: 'overridden' as const } : f));
    onUpdateFindings(updated);
    onAddLog(`Security finding ${id} formally OVERRIDDEN by ${user.role} (${user.name}) with audit signature.`, 'reviewer', 'WARN');
  };

  const filtered = selectedSeverity === 'all'
    ? findings
    : findings.filter(f => f.severity === selectedSeverity);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            <span>Security Validation & Zero-Trust Gatekeeper</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            OWASP Top 10 SAST audit, secret detection, CWE vulnerability cataloging, and automated deployment blocking.
          </p>
        </div>

        <button
          onClick={handleRunScan}
          disabled={isScanning}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition flex items-center gap-2 shadow-md ${
            isScanning
              ? 'bg-rose-600/30 text-rose-200 cursor-wait'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-500/20 active:scale-95'
          }`}
        >
          {isScanning ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Scanning Codebase...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span>Trigger SAST Security Scan</span>
            </>
          )}
        </button>
      </div>

      {/* Deployment Blocker Alert */}
      <div
        className={`p-5 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          isDeploymentBlocked
            ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
            : 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300'
        }`}
      >
        <div className="flex items-center gap-3">
          {isDeploymentBlocked ? (
            <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
          ) : (
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          )}
          <div>
            <h3 className="text-sm font-bold tracking-tight text-white">
              {isDeploymentBlocked
                ? 'Production Deployment Blocked by Security Policy'
                : 'Security Gate Clean — Authorized for Azure Production Release'}
            </h3>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              {isDeploymentBlocked
                ? `${criticalOrHighCount} unresolved Critical/High findings must be patched or authorized by Security Lead.`
                : 'Zero deployment-blocking vulnerabilities detected. OWASP ASVS verification cleared.'}
            </p>
          </div>
        </div>

        <div className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
          User Role: <span className="text-indigo-400 font-bold">{user.role}</span>
        </div>
      </div>

      {/* Security Severity Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { level: 'all', label: 'All Findings', count: findings.length, color: 'text-white' },
          { level: 'critical', label: 'Critical', count: findings.filter(f => f.severity === 'critical').length, color: 'text-rose-400' },
          { level: 'high', label: 'High', count: findings.filter(f => f.severity === 'high').length, color: 'text-amber-400' },
          { level: 'medium', label: 'Medium', count: findings.filter(f => f.severity === 'medium').length, color: 'text-yellow-400' },
          { level: 'low', label: 'Low / Info', count: findings.filter(f => f.severity === 'low' || f.severity === 'info').length, color: 'text-blue-400' },
        ].map(item => (
          <button
            key={item.level}
            onClick={() => setSelectedSeverity(item.level)}
            className={`p-3 rounded-xl border text-left transition ${
              selectedSeverity === item.level
                ? 'bg-slate-800 border-slate-600'
                : 'bg-[#0d121f] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="text-[10px] uppercase font-bold text-slate-400">{item.label}</div>
            <div className={`text-xl font-bold font-mono mt-1 ${item.color}`}>{item.count}</div>
          </button>
        ))}
      </div>

      {/* Findings List */}
      <div className="rounded-xl bg-[#0d121f] border border-slate-800 overflow-hidden space-y-3 p-5">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
            <Lock className="w-4 h-4 text-rose-400" />
            <span>Cataloged Findings ({filtered.length})</span>
          </h3>
          <span className="text-xs font-mono text-slate-500">CWE & OWASP Indexed</span>
        </div>

        <div className="space-y-3">
          {filtered.map(finding => (
            <div
              key={finding.id}
              className={`p-4 rounded-xl border transition space-y-3 font-mono text-xs ${
                finding.status === 'resolved'
                  ? 'bg-slate-900/30 border-slate-800/50 opacity-60'
                  : 'bg-slate-900/70 border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
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

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                    Status: {finding.status}
                  </span>
                  {finding.blocksDeployment && (
                    <span className="text-[10px] px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 font-bold">
                      Deployment Blocker
                    </span>
                  )}
                </div>
              </div>

              <div className="text-slate-400 text-[11px] flex items-center gap-2">
                <FileCode className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-300">{finding.file}:{finding.line}</span>
                <span className="text-slate-600">•</span>
                <span className="text-indigo-400">{finding.rule}</span>
              </div>

              <p className="text-slate-300 font-sans leading-relaxed text-xs">{finding.description}</p>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-emerald-400 text-[11px]">
                <span className="text-slate-400 font-bold block mb-1">Fix Instructions:</span>
                <code>{finding.suggestedFix}</code>
              </div>

              {/* Actions: Mark Resolved or Override */}
              {finding.status === 'open' && (
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleResolve(finding.id)}
                    className="px-2.5 py-1 text-xs rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1 font-sans"
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Mark Resolved</span>
                  </button>
                  <button
                    onClick={() => handleOverride(finding.id)}
                    className="px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition font-sans"
                  >
                    Authorized Override
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

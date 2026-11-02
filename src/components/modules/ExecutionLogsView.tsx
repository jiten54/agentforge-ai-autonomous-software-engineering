import React, { useState } from 'react';
import {
  ScrollText,
  Terminal,
  Search,
  Download,
  Trash2,
  Filter,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Cpu,
  Layers
} from 'lucide-react';
import { ExecutionLog } from '../../types';

interface ExecutionLogsViewProps {
  logs: ExecutionLog[];
  onClearLogs: () => void;
}

export const ExecutionLogsView: React.FC<ExecutionLogsViewProps> = ({ logs, onClearLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  const filteredLogs = logs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAgent = selectedAgent === 'all' || log.agent === selectedAgent;
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel;
    return matchesSearch && matchesAgent && matchesLevel;
  });

  const handleDownload = () => {
    const text = logs.map(l => `[${l.timestamp}] [${l.level}] [${l.agent || 'SYSTEM'}] ${l.message}`).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentforge-logs-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 pb-12 h-[calc(100vh-7rem)] flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-800 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-cyan-400" />
            <span>Execution Logs & Multi-Agent Event Bus</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time event stream capturing orchestration graphs, AST validations, sandbox runs, and CI telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Logs</span>
          </button>
          <button
            onClick={onClearLogs}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#0d121f] rounded-xl border border-slate-800 shrink-0 text-xs">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search logs by keyword..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Agent Filter */}
          <select
            value={selectedAgent}
            onChange={e => setSelectedAgent(e.target.value)}
            className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:outline-none font-mono text-[11px]"
          >
            <option value="all">All Agents</option>
            <option value="orchestrator">Orchestrator</option>
            <option value="specification">Specification</option>
            <option value="developer">Developer</option>
            <option value="testing">Testing</option>
            <option value="reviewer">Reviewer</option>
            <option value="deployment">Deployment</option>
          </select>

          {/* Level Filter */}
          <select
            value={selectedLevel}
            onChange={e => setSelectedLevel(e.target.value)}
            className="px-2.5 py-1 bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:outline-none font-mono text-[11px]"
          >
            <option value="all">All Levels</option>
            <option value="AGENT">AGENT</option>
            <option value="INFO">INFO</option>
            <option value="WARN">WARN</option>
            <option value="ERROR">ERROR</option>
          </select>
        </div>
      </div>

      {/* Terminal Log Console */}
      <div className="flex-1 rounded-xl bg-[#080c14] border border-slate-800/80 overflow-y-auto p-4 font-mono text-xs space-y-1.5 terminal-scan">
        {filteredLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-600">
            No execution logs match the active filter criteria.
          </div>
        ) : (
          filteredLogs.map(log => {
            const isAgent = log.level === 'AGENT';
            const isWarn = log.level === 'WARN';
            const isError = log.level === 'ERROR';

            return (
              <div
                key={log.id}
                className="flex items-start gap-2.5 leading-relaxed hover:bg-slate-900/40 p-1 rounded transition"
              >
                <span className="text-slate-600 shrink-0 text-[11px]">{log.timestamp}</span>

                <span
                  className={`shrink-0 text-[10px] font-bold px-1.5 py-0.2 rounded uppercase ${
                    isError
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      : isWarn
                      ? 'bg-amber-500/20 text-amber-300'
                      : isAgent
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {log.level}
                </span>

                {log.agent && (
                  <span className="text-blue-400 font-semibold shrink-0 text-[11px]">
                    [{log.agent}]
                  </span>
                )}

                <span
                  className={`flex-1 break-words ${
                    isError ? 'text-rose-300' : isWarn ? 'text-amber-200' : isAgent ? 'text-slate-100' : 'text-slate-300'
                  }`}
                >
                  {log.message}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

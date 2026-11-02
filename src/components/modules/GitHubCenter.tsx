import React, { useState } from 'react';
import {
  GitPullRequest,
  GitBranch,
  GitCommit,
  Github,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  FolderGit2,
  Clock,
  ArrowRight,
  Terminal,
  Activity,
  Plus
} from 'lucide-react';
import { Project, PullRequest } from '../../types';

interface GitHubCenterProps {
  project: Project;
  pullRequest: PullRequest;
  onNavigateToPr: () => void;
  onAddLog: (message: string, agent?: any, level?: any) => void;
}

export const GitHubCenter: React.FC<GitHubCenterProps> = ({
  project,
  pullRequest,
  onNavigateToPr,
  onAddLog,
}) => {
  const [commits, setCommits] = useState([
    {
      sha: '9a4c8f2',
      message: 'feat(core): implement autonomous scaffold with FastAPI and React 19',
      author: 'AgentForge Swarm (Developer Agent)',
      time: '18 minutes ago',
      verified: true,
    },
    {
      sha: '7b2e10a',
      message: 'test(qa): add isolated pytest and playwright browser suites',
      author: 'AgentForge Swarm (Testing Agent)',
      time: '24 minutes ago',
      verified: true,
    },
    {
      sha: '3f990cd',
      message: 'chore(docker): configure Azure Container Apps bicep template and multi-stage Dockerfile',
      author: 'AgentForge Swarm (Deployment Agent)',
      time: '35 minutes ago',
      verified: true,
    },
  ]);

  const [newBranchName, setNewBranchName] = useState('');
  const [currentBranch, setCurrentBranch] = useState(project.branch);

  const handleCreateBranch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBranchName) return;
    setCurrentBranch(newBranchName);
    onAddLog(`Created and checked out new Git branch: ${newBranchName}`, 'orchestrator', 'INFO');
    setNewBranchName('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Github className="w-5 h-5 text-slate-200" />
            <span>GitHub Integration Center</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise OAuth link, repository synchronizer, branch management, commit ledger, and GitHub Actions telemetry.
          </p>
        </div>

        <button
          onClick={onNavigateToPr}
          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
        >
          <GitPullRequest className="w-4 h-4" />
          <span>Open PR Generator</span>
        </button>
      </div>

      {/* Integration Status Banner */}
      <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center">
            <Github className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-mono">{project.repository}</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>OAuth Connected</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Permissions: <span className="text-slate-300">repo, workflow, write:packages, read:org</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs font-mono">
            <div className="text-slate-400">Current Tracking Branch</div>
            <div className="text-blue-400 font-bold">{currentBranch}</div>
          </div>
        </div>
      </div>

      {/* Branch & Commit Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Branch Switcher & Create */}
        <div className="p-5 rounded-xl bg-[#0d121f] border border-slate-800 space-y-4">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-blue-400" />
            <span>Branch Controller</span>
          </h3>

          <div className="space-y-2">
            <label className="text-xs text-slate-400">Active Branches in Repo</label>
            <div className="space-y-1.5 font-mono text-xs">
              {[currentBranch, 'main', 'staging', 'release/v1.4.0'].map(b => (
                <button
                  key={b}
                  onClick={() => {
                    setCurrentBranch(b);
                    onAddLog(`Switched branch context to: ${b}`, 'orchestrator', 'INFO');
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition ${
                    currentBranch === b
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'bg-slate-900/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="truncate">{b}</span>
                  {currentBranch === b && <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleCreateBranch} className="pt-2 border-t border-slate-800 space-y-2">
            <label className="text-xs text-slate-400">Create Feature Branch</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="feature/..."
                value={newBranchName}
                onChange={e => setNewBranchName(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-200 font-mono focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
              >
                Create
              </button>
            </div>
          </form>
        </div>

        {/* Right Column: Commit History & GitHub Actions */}
        <div className="lg:col-span-2 space-y-4">
          {/* GitHub Actions CI Status */}
          <div className="p-4 rounded-xl bg-[#0d121f] border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="text-xs font-bold text-white">GitHub Actions CI/CD Pipeline</h4>
                <p className="text-[11px] text-slate-400 font-mono">Workflow: .github/workflows/ci.yml (Passing)</p>
              </div>
            </div>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              Build #148: Green
            </span>
          </div>

          {/* Commit Ledger */}
          <div className="rounded-xl bg-[#0d121f] border border-slate-800 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <GitCommit className="w-4 h-4 text-indigo-400" />
                <span>Verified Agent Commit History</span>
              </h3>
              <span className="text-xs font-mono text-slate-500">GPG Signed</span>
            </div>

            <div className="space-y-3">
              {commits.map(commit => (
                <div
                  key={commit.sha}
                  className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-1 font-mono text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-blue-400 font-bold">{commit.sha}</span>
                    <span className="text-slate-500 text-[11px]">{commit.time}</span>
                  </div>
                  <div className="text-slate-200 font-sans font-medium">{commit.message}</div>
                  <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                    <span>Author: {commit.author}</span>
                    <span className="text-emerald-400">✓ Verified Signature</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { 
  Play, 
  GitBranch, 
  FolderKanban, 
  Cpu, 
  ShieldCheck, 
  UserCheck, 
  Sparkles,
  Terminal,
  Activity
} from 'lucide-react';
import { Project, UserProfile, AgentInfo } from '../../types';

interface HeaderProps {
  project: Project;
  user: UserProfile;
  agents: AgentInfo[];
  isSwarmRunning: boolean;
  onRunSwarm: () => void;
  onOpenQuickTerminal: () => void;
  onUserRoleChange: (role: UserProfile['role']) => void;
}

export const Header: React.FC<HeaderProps> = ({
  project,
  user,
  agents,
  isSwarmRunning,
  onRunSwarm,
  onOpenQuickTerminal,
  onUserRoleChange,
}) => {
  const activeAgentCount = agents.filter(a => a.status === 'running').length;

  return (
    <header className="h-16 bg-[#0b0f17]/95 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-6 flex items-center justify-between">
      {/* Brand & Project Identification */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-blue-500/20">
            <div className="w-full h-full bg-[#0d1322] rounded-[7px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-base text-white tracking-tight flex items-center gap-1.5 font-['Space_Grotesk']">
                AgentForge <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">AI</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Autonomous
              </span>
            </div>
            <p className="text-[11px] text-slate-400 truncate max-w-[200px] sm:max-w-xs">
              Spektra Systems AI-Native Engine
            </p>
          </div>
        </div>

        <div className="hidden md:block h-5 w-[1px] bg-slate-800" />

        {/* Project Selector Badge */}
        <div className="hidden sm:flex items-center space-x-2 text-xs bg-slate-900/80 px-2.5 py-1.5 rounded-lg border border-slate-800">
          <FolderKanban className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-slate-200 font-medium truncate max-w-[160px]">{project.name}</span>
          <span className="text-slate-600">•</span>
          <GitBranch className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-mono text-[11px]">{project.branch}</span>
        </div>
      </div>

      {/* Swarm Status & Global Actions */}
      <div className="flex items-center space-x-3">
        {/* Swarm Live Indicator */}
        <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs">
          <div className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${isSwarmRunning ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'}`} />
            <span className="text-slate-300 font-medium">
              {isSwarmRunning ? `Swarm Active (${activeAgentCount} Running)` : '6 Agents Standby'}
            </span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400 font-mono text-[11px]">96% Health</span>
        </div>

        {/* User Role Switcher */}
        <div className="relative group">
          <button className="flex items-center space-x-1.5 text-xs bg-slate-900 hover:bg-slate-800 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-800 transition">
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden xl:inline text-slate-400">Role:</span>
            <span className="font-medium text-slate-200">{user.role}</span>
          </button>
          
          <div className="absolute right-0 mt-1 w-52 bg-[#0e1424] border border-slate-800 rounded-lg shadow-xl py-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition z-50">
            <div className="px-3 py-1.5 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
              Switch RBAC Identity
            </div>
            {(['Principal Architect', 'Senior Full-Stack Dev', 'Lead QA Engineer', 'Security Lead', 'DevOps Lead'] as const).map(role => (
              <button
                key={role}
                onClick={() => onUserRoleChange(role)}
                className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-slate-800/80 ${user.role === role ? 'text-blue-400 font-semibold bg-blue-500/10' : 'text-slate-300'}`}
              >
                <span>{role}</span>
                {user.role === role && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
              </button>
            ))}
          </div>
        </div>

        {/* Live Logs Quick Toggle */}
        <button
          onClick={onOpenQuickTerminal}
          title="Open Execution Log Terminal"
          className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 transition"
        >
          <Terminal className="w-4 h-4" />
        </button>

        {/* Primary Action: Run Autonomous Multi-Agent Swarm */}
        <button
          onClick={onRunSwarm}
          disabled={isSwarmRunning}
          className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition shadow-md ${
            isSwarmRunning
              ? 'bg-amber-600/30 text-amber-200 border border-amber-500/30 cursor-wait'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20 active:scale-95'
          }`}
        >
          {isSwarmRunning ? (
            <>
              <Activity className="w-4 h-4 animate-spin text-amber-300" />
              <span>Orchestrating Swarm...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Run Autonomous Swarm</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};

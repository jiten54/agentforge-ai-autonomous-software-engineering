import React from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  FileCode2,
  Users2,
  GitFork,
  Kanban,
  Code2,
  TerminalSquare,
  FlaskConical,
  Eye,
  ShieldAlert,
  GitPullRequest,
  FileText,
  Rocket,
  BarChart3,
  FileSignature,
  SlidersHorizontal,
  ScrollText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export type ActiveModule =
  | 'command-center'
  | 'projects'
  | 'workflow-visualizer'
  | 'requirement-studio'
  | 'task-manager'
  | 'agents-md'
  | 'control-room'
  | 'code-generation'
  | 'monaco-editor'
  | 'skills-manager'
  | 'testing-lab'
  | 'code-review'
  | 'security-center'
  | 'github-center'
  | 'pr-generator'
  | 'deployment-center'
  | 'analytics'
  | 'execution-logs'
  | 'settings';

interface SidebarProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  taskCount: number;
  testFailCount: number;
  securityCount: number;
  openPrCount: number;
}

interface NavGroup {
  label: string;
  items: {
    id: ActiveModule;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeColor?: string;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeModule,
  onSelectModule,
  collapsed,
  onToggleCollapse,
  taskCount,
  testFailCount,
  securityCount,
  openPrCount,
}) => {
  const groups: NavGroup[] = [
    {
      label: 'Strategy & Overview',
      items: [
        { id: 'command-center', label: '1. Command Center', icon: LayoutDashboard },
        { id: 'projects', label: '2. Project Workspace', icon: FolderKanban },
        { id: 'workflow-visualizer', label: '5. Workflow Visualizer', icon: GitFork },
      ],
    },
    {
      label: 'Planning & Specs',
      items: [
        { id: 'requirement-studio', label: '3. Requirement Studio', icon: FileCode2 },
        { id: 'task-manager', label: '6. Task Manager', icon: Kanban, badge: taskCount },
        { id: 'agents-md', label: '16. AGENTS.md Generator', icon: FileSignature },
      ],
    },
    {
      label: 'Autonomous Engineering',
      items: [
        { id: 'control-room', label: '4. Agent Control Room', icon: Users2 },
        { id: 'code-generation', label: '7. Code Gen Workspace', icon: Code2 },
        { id: 'monaco-editor', label: '8. Monaco IDE Editor', icon: TerminalSquare },
        { id: 'skills-manager', label: '17. Skills & Instructions', icon: SlidersHorizontal },
      ],
    },
    {
      label: 'Verification & Quality',
      items: [
        {
          id: 'testing-lab',
          label: '9. Testing Laboratory',
          icon: FlaskConical,
          badge: testFailCount > 0 ? `${testFailCount} err` : '100%',
          badgeColor: testFailCount > 0 ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300',
        },
        { id: 'code-review', label: '10. Code Review Center', icon: Eye },
        {
          id: 'security-center',
          label: '11. Security Validation',
          icon: ShieldAlert,
          badge: securityCount,
          badgeColor: 'bg-amber-500/20 text-amber-300',
        },
      ],
    },
    {
      label: 'Release & CI/CD',
      items: [
        { id: 'github-center', label: '12. GitHub Integration', icon: GitPullRequest },
        { id: 'pr-generator', label: '13. Pull Request Engine', icon: FileText, badge: openPrCount },
        { id: 'deployment-center', label: '14. Deployment Center', icon: Rocket },
      ],
    },
    {
      label: 'Governance & Telemetry',
      items: [
        { id: 'analytics', label: '15. Agent Analytics', icon: BarChart3 },
        { id: 'execution-logs', label: '18. Execution Logs', icon: ScrollText },
        { id: 'settings', label: '19 & 20. RBAC & Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      className={`h-[calc(100vh-4rem)] bg-[#090d16] border-r border-slate-800/80 flex flex-col transition-all duration-300 select-none ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {groups.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            {!collapsed && (
              <div className="px-2.5 py-1 text-[10px] font-semibold tracking-wider text-slate-500 uppercase">
                {group.label}
              </div>
            )}
            {group.items.map(item => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => onSelectModule(item.id)}
                  title={collapsed ? item.label : undefined}
                  className={`w-full flex items-center rounded-lg text-xs font-medium transition-colors ${
                    collapsed ? 'justify-center p-2.5' : 'px-2.5 py-2'
                  } ${
                    isActive
                      ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                  
                  {!collapsed && (
                    <span className="ml-2.5 truncate flex-1 text-left">{item.label}</span>
                  )}

                  {!collapsed && item.badge !== undefined && (
                    <span
                      className={`ml-auto text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                        item.badgeColor || 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-slate-800/80 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center space-x-2 px-2 text-[11px] text-slate-500 font-mono">
            <span>v2.4.0</span>
            <span>•</span>
            <span className="text-emerald-500">Live Engine</span>
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition mx-auto"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};

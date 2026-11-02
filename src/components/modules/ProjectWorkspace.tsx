import React, { useState } from 'react';
import {
  FolderKanban,
  GitBranch,
  ExternalLink,
  Plus,
  Layers,
  Database,
  Terminal,
  Calendar,
  CheckCircle2,
  Settings,
  Code2
} from 'lucide-react';
import { Project } from '../../types';

interface ProjectWorkspaceProps {
  currentProject: Project;
  onSelectProject: (proj: Project) => void;
  onNavigate: (module: any) => void;
}

export const ProjectWorkspace: React.FC<ProjectWorkspaceProps> = ({
  currentProject,
  onSelectProject,
  onNavigate,
}) => {
  const [projects, setProjects] = useState<Project[]>([
    currentProject,
    {
      id: 'proj-spektra-02',
      name: 'Autonomous Microservice Mesh & Event Bus',
      description: 'Distributed event choreography architecture with Kafka/Redis streams, dead-letter queues, and telemetry tracing.',
      repository: 'spektra-systems/event-mesh-core',
      branch: 'main',
      framework: 'FastAPI + Redis + PostgreSQL',
      language: 'Python',
      status: 'healthy',
      healthScore: 98,
      createdAt: '2026-10-22T10:00:00Z',
      updatedAt: '2026-11-01T15:00:00Z',
    },
    {
      id: 'proj-spektra-03',
      name: 'Enterprise Document RAG Pipeline',
      description: 'Hybrid semantic search vector service with pgvector, recursive chunking, and isolated validation pipelines.',
      repository: 'spektra-systems/rag-vector-service',
      branch: 'feature/hybrid-search',
      framework: 'FastAPI + Next.js + pgvector',
      language: 'TypeScript / Python',
      status: 'active',
      healthScore: 92,
      createdAt: '2026-10-25T14:30:00Z',
      updatedAt: '2026-11-01T12:00:00Z',
    },
  ]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newRepo, setNewRepo] = useState('spektra-systems/');
  const [newFramework, setNewFramework] = useState('FastAPI + React 19 + PostgreSQL 16');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      name: newName,
      description: newDesc || 'Autonomous software engineering project managed by AgentForge AI.',
      repository: newRepo,
      branch: 'main',
      framework: newFramework,
      language: 'TypeScript / Python',
      status: 'active',
      healthScore: 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setProjects([newProj, ...projects]);
    onSelectProject(newProj);
    setShowCreateModal(false);
    setNewName('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-blue-400" />
            <span>Project Management Workspace</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise repositories, branches, isolated execution sandboxes, and architectural settings.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold tracking-wide transition flex items-center gap-1.5 shadow-md shadow-blue-500/20"
        >
          <Plus className="w-4 h-4" />
          <span>New Engineering Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map(proj => {
          const isSelected = proj.id === currentProject.id;
          return (
            <div
              key={proj.id}
              className={`p-5 rounded-xl border transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-blue-950/20 border-blue-500/40 shadow-lg shadow-blue-500/10'
                  : 'bg-[#0d121f] border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {proj.id}
                    </span>
                    <h3 className="text-base font-semibold text-white tracking-tight">{proj.name}</h3>
                  </div>
                  {isSelected && (
                    <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      Active
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {proj.description}
                </p>

                <div className="space-y-1.5 pt-2 text-xs font-mono text-slate-400">
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-300 truncate">{proj.repository}</span>
                    <span className="text-blue-400">({proj.branch})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-slate-300">{proj.framework}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{proj.healthScore}% Health</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onSelectProject(proj);
                      onNavigate('requirement-studio');
                    }}
                    className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  >
                    Open Studio
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0e1424] border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <FolderKanban className="w-4 h-4 text-blue-400" />
                <span>Initialize Autonomous Project</span>
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Project Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g., Enterprise Billing Service"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Repository URL / Path</label>
                <input
                  type="text"
                  value={newRepo}
                  onChange={e => setNewRepo(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Architecture / Stack</label>
                <input
                  type="text"
                  value={newFramework}
                  onChange={e => setNewFramework(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Initial Scope & Description</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  placeholder="Describe architectural objectives and constraints..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition"
                >
                  Provision Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

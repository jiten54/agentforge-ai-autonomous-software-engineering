import React, { useState } from 'react';
import {
  Kanban,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  ArrowRight,
  ListFilter,
  CheckSquare,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { DevTask, Specification, AgentRole } from '../../types';

interface TaskManagerProps {
  tasks: DevTask[];
  onUpdateTasks: (tasks: DevTask[]) => void;
  onExecuteTask: (task: DevTask) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onUpdateTasks,
  onExecuteTask,
}) => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const columns: { id: DevTask['status']; title: string; color: string }[] = [
    { id: 'backlog', title: 'Backlog', color: 'border-slate-700' },
    { id: 'in_progress', title: 'In Progress', color: 'border-blue-500/40' },
    { id: 'in_testing', title: 'In Testing', color: 'border-cyan-500/40' },
    { id: 'in_review', title: 'In Review', color: 'border-amber-500/40' },
    { id: 'completed', title: 'Completed', color: 'border-emerald-500/40' },
  ];

  const filteredTasks = selectedCategory === 'all'
    ? tasks
    : tasks.filter(t => t.category === selectedCategory);

  const moveTask = (taskId: string, newStatus: DevTask['status']) => {
    const updated = tasks.map(t => (t.id === taskId ? { ...t, status: newStatus } : t));
    onUpdateTasks(updated);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Kanban className="w-5 h-5 text-indigo-400" />
            <span>Development Task Manager</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous engineering backlog decomposed from technical specifications and assigned to AI agent workers.
          </p>
        </div>

        {/* Filter and View Toggles */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            {(['all', 'backend', 'frontend', 'database', 'security', 'testing'] as const).map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-md capitalize transition ${
                  selectedCategory === cat ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-2.5 py-1 rounded-md transition ${viewMode === 'kanban' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'}`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-2.5 py-1 rounded-md transition ${viewMode === 'list' ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400'}`}
            >
              List
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map(col => {
            const colTasks = filteredTasks.filter(t => t.status === col.id);
            return (
              <div key={col.id} className="min-w-[240px] flex flex-col space-y-3">
                <div className={`flex items-center justify-between pb-2 border-b ${col.color}`}>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">{col.title}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300">
                      {colTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 flex-1 min-h-[400px] p-2 bg-[#090e1a]/60 rounded-xl border border-slate-800/80">
                  {colTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center text-xs text-slate-600 font-mono">
                      No tasks in {col.title}
                    </div>
                  ) : (
                    colTasks.map(task => (
                      <div
                        key={task.id}
                        className="p-3.5 rounded-xl bg-[#0d1322] border border-slate-800 hover:border-slate-700 shadow-md space-y-2.5 transition"
                      >
                        <div className="flex items-start justify-between">
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-blue-400 font-semibold">
                            {task.id}
                          </span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300">
                            {task.complexity}
                          </span>
                        </div>

                        <h4 className="text-xs font-semibold text-slate-200 leading-snug">{task.title}</h4>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                          <span className="capitalize text-slate-400 font-mono text-[10px]">{task.category}</span>
                          {task.assignedAgent && (
                            <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1">
                              <Cpu className="w-3 h-3" />
                              <span>{task.assignedAgent}</span>
                            </span>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-1">
                          <button
                            onClick={() => onExecuteTask(task)}
                            className="px-2 py-1 rounded bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 text-[10px] font-semibold flex items-center gap-1 transition"
                          >
                            <Play className="w-2.5 h-2.5 fill-current" />
                            <span>Run Task</span>
                          </button>

                          {/* Quick status cycle */}
                          <div className="flex items-center gap-1">
                            {col.id !== 'completed' && (
                              <button
                                onClick={() => {
                                  const nextCol: DevTask['status'] =
                                    col.id === 'backlog'
                                      ? 'in_progress'
                                      : col.id === 'in_progress'
                                      ? 'in_testing'
                                      : col.id === 'in_testing'
                                      ? 'in_review'
                                      : 'completed';
                                  moveTask(task.id, nextCol);
                                }}
                                title="Advance task stage"
                                className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                              >
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="rounded-xl bg-[#0d121f] border border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Title</th>
                <th className="p-3">Category</th>
                <th className="p-3">Complexity</th>
                <th className="p-3">Assignee</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTasks.map(task => (
                <tr key={task.id} className="hover:bg-slate-900/40">
                  <td className="p-3 font-bold text-blue-400">{task.id}</td>
                  <td className="p-3 text-slate-200 font-sans font-medium">{task.title}</td>
                  <td className="p-3 text-indigo-300 capitalize">{task.category}</td>
                  <td className="p-3 text-slate-400">{task.complexity}</td>
                  <td className="p-3 text-cyan-400">{task.assignedAgent || 'Unassigned'}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        task.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : task.status === 'in_progress'
                          ? 'bg-blue-500/20 text-blue-400'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {task.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button
                      onClick={() => onExecuteTask(task)}
                      className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-semibold text-[11px] transition"
                    >
                      Execute
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

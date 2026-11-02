import React, { useState } from 'react';
import { Header } from './components/layout/Header';
import { Sidebar, ActiveModule } from './components/layout/Sidebar';
import { CommandCenter } from './components/modules/CommandCenter';
import { ProjectWorkspace } from './components/modules/ProjectWorkspace';
import { RequirementStudio } from './components/modules/RequirementStudio';
import { ControlRoom } from './components/modules/ControlRoom';
import { WorkflowVisualizer } from './components/modules/WorkflowVisualizer';
import { TaskManager } from './components/modules/TaskManager';
import { CodeGenWorkspace } from './components/modules/CodeGenWorkspace';
import { MonacoEditorView } from './components/modules/MonacoEditorView';
import { TestingLab } from './components/modules/TestingLab';
import { CodeReviewCenter } from './components/modules/CodeReviewCenter';
import { SecurityCenter } from './components/modules/SecurityCenter';
import { GitHubCenter } from './components/modules/GitHubCenter';
import { PullRequestGenerator } from './components/modules/PullRequestGenerator';
import { DeploymentCenter } from './components/modules/DeploymentCenter';
import { PerformanceAnalytics } from './components/modules/PerformanceAnalytics';
import { AgentsMdView } from './components/modules/AgentsMdView';
import { SkillsManager } from './components/modules/SkillsManager';
import { ExecutionLogsView } from './components/modules/ExecutionLogsView';
import { SettingsAndRbac } from './components/modules/SettingsAndRbac';
import { AutonomousSwarmModal } from './components/modals/AutonomousSwarmModal';

import {
  INITIAL_AGENTS,
  INITIAL_PROJECT,
  INITIAL_SPECIFICATION,
  INITIAL_FILES,
  INITIAL_TEST_REPORT,
  INITIAL_CODE_REVIEW,
  INITIAL_PULL_REQUEST,
  INITIAL_DEPLOYMENTS,
  INITIAL_LOGS,
  INITIAL_USER,
} from './data/mockProject';
import {
  AgentInfo,
  AgentRole,
  Project,
  Specification,
  DevTask,
  ProjectFile,
  TestReport,
  CodeReview,
  PullRequest,
  DeploymentRecord,
  ExecutionLog,
  UserProfile,
} from './types';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('command-center');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  // Core Platform State
  const [project, setProject] = useState<Project>(INITIAL_PROJECT);
  const [agents, setAgents] = useState<AgentInfo[]>(INITIAL_AGENTS);
  const [spec, setSpec] = useState<Specification>(INITIAL_SPECIFICATION);
  const [tasks, setTasks] = useState<DevTask[]>(INITIAL_SPECIFICATION.tasks);
  const [files, setFiles] = useState<ProjectFile[]>(INITIAL_FILES);
  const [testReport, setTestReport] = useState<TestReport>(INITIAL_TEST_REPORT);
  const [review, setReview] = useState<CodeReview>(INITIAL_CODE_REVIEW);
  const [pullRequest, setPullRequest] = useState<PullRequest>(INITIAL_PULL_REQUEST);
  const [deployments, setDeployments] = useState<DeploymentRecord[]>(INITIAL_DEPLOYMENTS);
  const [logs, setLogs] = useState<ExecutionLog[]>(INITIAL_LOGS);
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);

  // Swarm Modal State
  const [isSwarmModalOpen, setIsSwarmModalOpen] = useState(false);
  const [isSwarmRunning, setIsSwarmRunning] = useState(false);

  const addLog = (message: string, agent?: AgentRole, level: ExecutionLog['level'] = 'INFO') => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: ExecutionLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: timeStr,
      level,
      agent,
      message,
    };
    setLogs(prev => [newLog, ...prev]);
  };

  const handleTriggerAgent = (role: AgentRole) => {
    setAgents(prev =>
      prev.map(a =>
        a.id === role ? { ...a, status: 'running', currentTask: 'Active worker assigned' } : a
      )
    );
    addLog(`Manually triggered worker: ${role}`, role, 'AGENT');

    setTimeout(() => {
      setAgents(prev =>
        prev.map(a =>
          a.id === role
            ? {
                ...a,
                status: 'completed',
                currentTask: undefined,
                tokensUsed: a.tokensUsed + 1200,
                durationMs: a.durationMs + 350,
              }
            : a
        )
      );
      addLog(`Worker execution completed: ${role}`, role, 'INFO');
    }, 1500);
  };

  const handleResetAgents = () => {
    setAgents(INITIAL_AGENTS);
    addLog('Reset all agent telemetry and state to standby.', 'orchestrator', 'INFO');
  };

  const handleSaveFile = (path: string, content: string) => {
    setFiles(prev =>
      prev.map(f => (f.path === path ? { ...f, content, updatedAt: 'Just now' } : f))
    );
  };

  const handleDeployProduction = () => {
    const newDep: DeploymentRecord = {
      id: `dep-prod-${Date.now().toString().slice(-4)}`,
      environment: 'production',
      version: `v1.4.${deployments.length + 1}`,
      commitSha: pullRequest.branch.slice(0, 7) || '9a4c8f2',
      status: 'succeeded',
      targetPlatform: 'Azure Container Apps (East US 2)',
      deployedAt: 'Just now',
      duration: '1m 22s',
      approvedBy: `${user.name} (${user.role})`,
      healthStatus: 'healthy',
      metrics: {
        cpuUsage: '11.8%',
        memoryUsage: '310 MB / 1024 MB',
        p99Latency: '28ms',
        uptime: '100%',
      },
    };
    setDeployments([newDep, ...deployments]);
  };

  const handleRollback = (depId: string) => {
    const target = deployments.find(d => d.id === depId);
    if (!target) return;
    addLog(`Initiated blue-green traffic rollback to ${target.version} (${target.commitSha})`, 'deployment', 'WARN');
    setDeployments(prev =>
      prev.map(d =>
        d.id === depId
          ? { ...d, status: 'succeeded', deployedAt: 'Rollback Active' }
          : d
      )
    );
  };

  const handleCompleteWorkflow = (
    newSpec: Specification,
    newFiles: ProjectFile[],
    newReport: TestReport,
    newReview: CodeReview,
    newPr: PullRequest
  ) => {
    setSpec(newSpec);
    setTasks(newSpec.tasks);
    setFiles(newFiles);
    setTestReport(newReport);
    setReview(newReview);
    setPullRequest(newPr);
    setIsSwarmRunning(false);
  };

  const criticalSecurityCount = review.findings.filter(
    f => (f.severity === 'critical' || f.severity === 'high') && f.status === 'open'
  ).length;

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        project={project}
        user={user}
        agents={agents}
        isSwarmRunning={isSwarmRunning}
        onRunSwarm={() => setIsSwarmModalOpen(true)}
        onOpenQuickTerminal={() => setActiveModule('execution-logs')}
        onUserRoleChange={role => {
          setUser(prev => ({ ...prev, role }));
          addLog(`User role switched to: ${role}`, 'orchestrator', 'INFO');
        }}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeModule={activeModule}
          onSelectModule={setActiveModule}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          taskCount={tasks.length}
          testFailCount={testReport.executionSummary.failed}
          securityCount={criticalSecurityCount}
          openPrCount={pullRequest.status === 'open' ? 1 : 0}
        />

        {/* Dynamic Module Workspace */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-[#090d16] to-[#080c14]">
          <div className="max-w-7xl mx-auto">
            {activeModule === 'command-center' && (
              <CommandCenter
                project={project}
                agents={agents}
                spec={spec}
                testReport={testReport}
                review={review}
                deployments={deployments}
                onNavigate={setActiveModule}
                onRunSwarm={() => setIsSwarmModalOpen(true)}
              />
            )}

            {activeModule === 'projects' && (
              <ProjectWorkspace
                currentProject={project}
                onSelectProject={setProject}
                onNavigate={setActiveModule}
              />
            )}

            {activeModule === 'requirement-studio' && (
              <RequirementStudio
                currentSpec={spec}
                onUpdateSpec={newSpec => {
                  setSpec(newSpec);
                  setTasks(newSpec.tasks);
                }}
                onApproveSpec={approvedSpec => {
                  setSpec(approvedSpec);
                  setTasks(approvedSpec.tasks);
                  setActiveModule('task-manager');
                }}
                onAddLog={addLog}
              />
            )}

            {activeModule === 'control-room' && (
              <ControlRoom
                agents={agents}
                onTriggerAgent={handleTriggerAgent}
                onResetAgents={handleResetAgents}
                onAddLog={addLog}
              />
            )}

            {activeModule === 'workflow-visualizer' && (
              <WorkflowVisualizer
                agents={agents}
                onTriggerSwarm={() => setIsSwarmModalOpen(true)}
              />
            )}

            {activeModule === 'task-manager' && (
              <TaskManager
                tasks={tasks}
                onUpdateTasks={setTasks}
                onExecuteTask={task => {
                  setActiveModule('code-generation');
                  addLog(`Assigned ${task.id} (${task.title}) to Developer Agent`, 'developer', 'AGENT');
                }}
              />
            )}

            {activeModule === 'code-generation' && (
              <CodeGenWorkspace
                files={files}
                spec={spec}
                tasks={tasks}
                onUpdateFiles={setFiles}
                onAddLog={addLog}
              />
            )}

            {activeModule === 'monaco-editor' && (
              <MonacoEditorView
                files={files}
                onSaveFile={handleSaveFile}
                onAddLog={addLog}
              />
            )}

            {activeModule === 'testing-lab' && (
              <TestingLab
                testReport={testReport}
                files={files}
                spec={spec}
                onUpdateReport={setTestReport}
                onAddLog={addLog}
              />
            )}

            {activeModule === 'code-review' && (
              <CodeReviewCenter
                review={review}
                files={files}
                spec={spec}
                onUpdateReview={setReview}
                onAddLog={addLog}
              />
            )}

            {activeModule === 'security-center' && (
              <SecurityCenter
                findings={review.findings}
                user={user}
                onUpdateFindings={newFindings => setReview({ ...review, findings: newFindings })}
                onAddLog={addLog}
              />
            )}

            {activeModule === 'github-center' && (
              <GitHubCenter
                project={project}
                pullRequest={pullRequest}
                onNavigateToPr={() => setActiveModule('pr-generator')}
                onAddLog={addLog}
              />
            )}

            {activeModule === 'pr-generator' && (
              <PullRequestGenerator
                pullRequest={pullRequest}
                spec={spec}
                testReport={testReport}
                review={review}
                onUpdatePullRequest={setPullRequest}
                onAddLog={addLog}
              />
            )}

            {activeModule === 'deployment-center' && (
              <DeploymentCenter
                deployments={deployments}
                user={user}
                review={review}
                testReport={testReport}
                onDeployProduction={handleDeployProduction}
                onRollback={handleRollback}
                onAddLog={addLog}
              />
            )}

            {activeModule === 'analytics' && (
              <PerformanceAnalytics agents={agents} />
            )}

            {activeModule === 'agents-md' && (
              <AgentsMdView project={project} onAddLog={addLog} />
            )}

            {activeModule === 'skills-manager' && (
              <SkillsManager agents={agents} onAddLog={addLog} />
            )}

            {activeModule === 'execution-logs' && (
              <ExecutionLogsView logs={logs} onClearLogs={() => setLogs([])} />
            )}

            {activeModule === 'settings' && (
              <SettingsAndRbac
                user={user}
                project={project}
                onUpdateUserRole={role => setUser({ ...user, role })}
                onAddLog={addLog}
              />
            )}
          </div>
        </main>
      </div>

      {/* Autonomous Swarm Runner Modal */}
      <AutonomousSwarmModal
        isOpen={isSwarmModalOpen}
        onClose={() => setIsSwarmModalOpen(false)}
        spec={spec}
        files={files}
        onCompleteWorkflow={handleCompleteWorkflow}
        onAddLog={addLog}
      />
    </div>
  );
}

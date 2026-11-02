import { Specification, DevTask, ProjectFile, TestReport, CodeReview, PullRequest } from '../types';

export const agentApi = {
  async generateSpecification(requirement: string, projectType: string = 'full-stack'): Promise<Specification> {
    const res = await fetch('/api/agent/spec', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requirement, projectType }),
    });

    if (!res.ok) {
      throw new Error(`Failed to generate specification: ${res.statusText}`);
    }

    const data = await res.json();
    return data.spec;
  },

  async generateCode(task: DevTask, spec: Specification, fileContext: ProjectFile[] = []): Promise<{ summary: string; files: ProjectFile[]; commitMessage: string }> {
    const res = await fetch('/api/agent/develop', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task, spec, fileContext }),
    });

    if (!res.ok) {
      throw new Error(`Failed to generate code: ${res.statusText}`);
    }

    const data = await res.json();
    return data.result;
  },

  async runTests(codeFiles: ProjectFile[], spec: Specification, simulateFailure: boolean = false): Promise<TestReport> {
    const res = await fetch('/api/agent/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codeFiles, spec, simulateFailure }),
    });

    if (!res.ok) {
      throw new Error(`Failed to run tests: ${res.statusText}`);
    }

    const data = await res.json();
    return data.testReport;
  },

  async reviewCode(codeFiles: ProjectFile[], spec: Specification): Promise<CodeReview> {
    const res = await fetch('/api/agent/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codeFiles, spec }),
    });

    if (!res.ok) {
      throw new Error(`Failed to review code: ${res.statusText}`);
    }

    const data = await res.json();
    return data.review;
  },

  async generatePullRequest(spec: Specification, task: any, testResults: any, reviewResults: any, branchName: string): Promise<PullRequest> {
    const res = await fetch('/api/agent/pull-request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ spec, task, testResults, reviewResults, branchName }),
    });

    if (!res.ok) {
      throw new Error(`Failed to generate PR: ${res.statusText}`);
    }

    const data = await res.json();
    return {
      id: `pr-${Math.floor(100 + Math.random() * 900)}`,
      number: Math.floor(800 + Math.random() * 100),
      title: data.pullRequest.title,
      branch: data.pullRequest.branch || branchName,
      base: data.pullRequest.base || 'main',
      status: 'open',
      summary: data.pullRequest.summary,
      markdown: data.pullRequest.markdown,
      labels: data.pullRequest.labels || ['ai-generated', 'verified'],
      createdAt: new Date().toISOString(),
      author: 'AgentForge AI Swarm',
    };
  },

  async generateAgentsMd(projectName: string, stack: string): Promise<{ content: string; skillsSummary: string[] }> {
    const res = await fetch('/api/agent/agents-md', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectName, stack }),
    });

    if (!res.ok) {
      throw new Error(`Failed to generate AGENTS.md: ${res.statusText}`);
    }

    const data = await res.json();
    return data.agentsMd;
  },
};

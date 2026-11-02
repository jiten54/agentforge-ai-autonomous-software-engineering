export type AgentRole = 'orchestrator' | 'specification' | 'developer' | 'testing' | 'reviewer' | 'deployment';

export type AgentStatus = 'idle' | 'queued' | 'running' | 'completed' | 'failed' | 'paused';

export interface AgentInfo {
  id: AgentRole;
  name: string;
  tagline: string;
  role: string;
  status: AgentStatus;
  currentTask?: string;
  tokensUsed: number;
  durationMs: number;
  retryCount: number;
  successRate: number;
  model: string;
  avatarIcon: string;
  accentColor: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  repository: string;
  branch: string;
  framework: string;
  language: string;
  status: 'active' | 'in-review' | 'deploying' | 'healthy';
  healthScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface Specification {
  title: string;
  summary: string;
  architecture: {
    frontend: string;
    backend: string;
    database: string;
    security: string;
  };
  functionalRequirements: string[];
  nonFunctionalRequirements: string[];
  apiEndpoints: {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    description: string;
    auth: boolean;
  }[];
  databaseSchema: {
    table: string;
    fields: string[];
    indexes: string[];
  }[];
  acceptanceCriteria: string[];
  testScenarios: {
    name: string;
    type: 'unit' | 'integration' | 'e2e';
    description: string;
  }[];
  tasks: DevTask[];
}

export interface DevTask {
  id: string;
  title: string;
  category: 'backend' | 'frontend' | 'database' | 'security' | 'testing' | 'devops';
  complexity: 'S' | 'M' | 'L' | 'XL';
  status: 'backlog' | 'in_progress' | 'in_testing' | 'in_review' | 'completed';
  assignedAgent?: AgentRole;
  dependencies: string[];
  description?: string;
  completionPercentage?: number;
}

export interface ProjectFile {
  path: string;
  language: string;
  content: string;
  explanation?: string;
  lastModifiedBy?: AgentRole;
  updatedAt?: string;
}

export interface TestResultItem {
  name: string;
  type: 'unit' | 'integration' | 'e2e';
  status: 'passed' | 'failed' | 'skipped';
  duration: string;
  error?: string | null;
  failureDetail?: string | null;
}

export interface TestReport {
  executionSummary: {
    total: number;
    passed: number;
    failed: number;
    durationMs: number;
    coveragePercentage: number;
  };
  results: TestResultItem[];
  selfCorrectionRequired: boolean;
  testSuiteFiles: {
    filePath: string;
    testFramework: 'vitest' | 'pytest' | 'playwright';
    testContent: string;
  }[];
}

export interface SecurityFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: 'security' | 'performance' | 'maintainability' | 'specification';
  file: string;
  line: number;
  rule: string;
  title: string;
  description: string;
  suggestedFix: string;
  blocksDeployment: boolean;
  status: 'open' | 'resolved' | 'overridden';
}

export interface CodeReview {
  approved: boolean;
  score: number;
  summary: string;
  findings: SecurityFinding[];
  metrics: {
    cyclomaticComplexity: string;
    maintainabilityIndex: number;
    securityDebt: string;
  };
}

export interface PullRequest {
  id: string;
  number: number;
  title: string;
  branch: string;
  base: string;
  status: 'open' | 'merged' | 'closed';
  summary: string;
  markdown: string;
  labels: string[];
  createdAt: string;
  author: string;
}

export interface DeploymentRecord {
  id: string;
  environment: 'development' | 'staging' | 'production';
  version: string;
  commitSha: string;
  status: 'succeeded' | 'failed' | 'deploying' | 'pending_approval' | 'rolled_back';
  targetPlatform: string;
  deployedAt: string;
  duration: string;
  approvedBy?: string;
  healthStatus: 'healthy' | 'degraded' | 'offline';
  metrics: {
    cpuUsage: string;
    memoryUsage: string;
    p99Latency: string;
    uptime: string;
  };
}

export interface ExecutionLog {
  id: string;
  timestamp: string;
  level: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'AGENT';
  agent?: AgentRole;
  message: string;
  details?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'Principal Architect' | 'Senior Full-Stack Dev' | 'Lead QA Engineer' | 'Security Lead' | 'DevOps Lead';
  permissions: string[];
}

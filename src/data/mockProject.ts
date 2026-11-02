import {
  AgentInfo,
  Project,
  Specification,
  DevTask,
  ProjectFile,
  TestReport,
  CodeReview,
  PullRequest,
  DeploymentRecord,
  ExecutionLog,
  UserProfile
} from '../types';

export const INITIAL_AGENTS: AgentInfo[] = [
  {
    id: 'orchestrator',
    name: 'Orchestrator Agent',
    tagline: 'Multi-Agent Conductor & Execution Graph Planner',
    role: 'Decomposes high-level requirements into dependency-resolved execution graphs and monitors agent swarms.',
    status: 'idle',
    tokensUsed: 14250,
    durationMs: 1240,
    retryCount: 0,
    successRate: 98.4,
    model: 'gemini-3.8-flash',
    avatarIcon: 'Cpu',
    accentColor: '#3b82f6',
  },
  {
    id: 'specification',
    name: 'Specification Agent',
    tagline: 'Technical Architecture & Acceptance Criteria Engine',
    role: 'Converts ambiguous software requirements into exhaustive architectural specifications, DB schemas, and RFC criteria.',
    status: 'idle',
    tokensUsed: 22890,
    durationMs: 2310,
    retryCount: 0,
    successRate: 97.1,
    model: 'gemini-3.8-flash',
    avatarIcon: 'FileCode2',
    accentColor: '#06b6d4',
  },
  {
    id: 'developer',
    name: 'Developer Agent',
    tagline: 'Autonomous Full-Stack Code Synthesizer',
    role: 'Synthesizes production-grade FastAPI microservices, React 19 UI components, PostgreSQL migrations, and integrations.',
    status: 'idle',
    tokensUsed: 48920,
    durationMs: 4120,
    retryCount: 1,
    successRate: 95.8,
    model: 'gemini-3.8-flash',
    avatarIcon: 'Code2',
    accentColor: '#8b5cf6',
  },
  {
    id: 'testing',
    name: 'Testing Agent',
    tagline: 'Isolated QA & Self-Correction Engine',
    role: 'Generates Vitest, Pytest, and Playwright E2E suites. Executes tests in sandboxed containers and drives automated self-correction.',
    status: 'idle',
    tokensUsed: 31200,
    durationMs: 3450,
    retryCount: 2,
    successRate: 94.2,
    model: 'gemini-3.8-flash',
    avatarIcon: 'CheckCircle2',
    accentColor: '#10b981',
  },
  {
    id: 'reviewer',
    name: 'Code Reviewer Agent',
    tagline: 'Static Analysis & Security Gatekeeper',
    role: 'Performs SAST checks, OWASP Top 10 vulnerability scans (CWE-89, CWE-79), cyclomatic complexity checks, and approves PRs.',
    status: 'idle',
    tokensUsed: 19400,
    durationMs: 1890,
    retryCount: 0,
    successRate: 99.1,
    model: 'gemini-3.8-flash',
    avatarIcon: 'ShieldAlert',
    accentColor: '#f59e0b',
  },
  {
    id: 'deployment',
    name: 'Deployment Agent',
    tagline: 'DevOps & Azure Container Apps Releaser',
    role: 'Validates container builds, verifies security gates, manages CI/CD pipelines, and coordinates blue-green releases.',
    status: 'idle',
    tokensUsed: 11300,
    durationMs: 1120,
    retryCount: 0,
    successRate: 99.5,
    model: 'gemini-3.8-flash',
    avatarIcon: 'Rocket',
    accentColor: '#ec4899',
  },
];

export const INITIAL_PROJECT: Project = {
  id: 'proj-spektra-01',
  name: 'FinTech Auth & Transaction Mesh',
  description: 'High-throughput enterprise microservice mesh with role-based access control, distributed audit logging, and automated self-healing.',
  repository: 'spektra-systems/agentforge-platform',
  branch: 'feature/autonomous-scaffold',
  framework: 'FastAPI + React 19 + PostgreSQL 16',
  language: 'TypeScript / Python',
  status: 'active',
  healthScore: 96,
  createdAt: '2026-10-18T09:00:00Z',
  updatedAt: '2026-11-01T18:45:00Z',
};

export const INITIAL_SPECIFICATION: Specification = {
  title: 'Customer Authentication, Audit Ledger & RBAC Subsystem',
  summary: 'Architect an enterprise-grade authentication service providing credential onboarding, Argon2id password hashing, RS256 JWT tokens, granular role-based access control (Admin, Developer, Auditor), and tamper-evident PostgreSQL audit trail.',
  architecture: {
    frontend: 'React 19 SPA with Tailwind CSS v4, Monaco code inspection, optimistic state dispatch, and Bearer token interceptor.',
    backend: 'FastAPI microservice running asynchronous Uvicorn workers, Pydantic v2 payload validation, and dependency-injected security handlers.',
    database: 'PostgreSQL 16 with normalized tables, UUIDv7 primary keys, and composite indexes on user roles and audit timestamps.',
    security: 'Zero-trust architecture, OWASP ASVS Level 2 compliance, rate limiting (100 req/min per IP), and secure HTTP-only cookies.'
  },
  functionalRequirements: [
    'Secure user registration with email format verification and minimum 12-char entropy check.',
    'JWT authentication issuing 15-minute access tokens and 7-day cryptographically rotated refresh tokens.',
    'Granular RBAC middleware checking scoped permissions before executing mutating actions.',
    'Immutable audit event dispatcher logging actor ID, target entity, timestamp, and IP hash on all sensitive operations.',
    'Health check endpoints (/healthz and /ready) exposing service uptime and database connection pool metrics.'
  ],
  nonFunctionalRequirements: [
    'Sub-50ms latency for cached token verification queries.',
    'Zero downtime blue-green deployment compatibility on Azure Container Apps.',
    '100% automated test coverage on authentication boundary methods and failure paths.',
    'Clean separation of concerns with strictly typed interfaces.'
  ],
  apiEndpoints: [
    { method: 'POST', path: '/api/v1/auth/register', description: 'Registers user account with email uniqueness guarantee and Argon2 hashing', auth: false },
    { method: 'POST', path: '/api/v1/auth/login', description: 'Authenticates credentials, updates login audit record, returns JWT pair', auth: false },
    { method: 'POST', path: '/api/v1/auth/refresh', description: 'Rotates refresh token and issues fresh access token', auth: false },
    { method: 'GET', path: '/api/v1/users/me', description: 'Returns authenticated profile and permission scope', auth: true },
    { method: 'GET', path: '/api/v1/audit/logs', description: 'Queries cryptographically sequenced audit logs with date filters', auth: true },
    { method: 'GET', path: '/healthz', description: 'Liveness probe returning 200 OK for Kubernetes / ACA orchestrator', auth: false }
  ],
  databaseSchema: [
    {
      table: 'users',
      fields: ['id UUID PRIMARY KEY', 'email VARCHAR(255) UNIQUE NOT NULL', 'password_hash VARCHAR(255) NOT NULL', 'role VARCHAR(50) DEFAULT "developer"', 'is_active BOOLEAN DEFAULT TRUE', 'created_at TIMESTAMPTZ DEFAULT NOW()'],
      indexes: ['CREATE UNIQUE INDEX idx_users_email ON users(email)', 'CREATE INDEX idx_users_role ON users(role)']
    },
    {
      table: 'audit_logs',
      fields: ['id UUID PRIMARY KEY', 'actor_id UUID REFERENCES users(id)', 'action VARCHAR(100) NOT NULL', 'entity_type VARCHAR(100) NOT NULL', 'entity_id UUID', 'ip_address VARCHAR(45)', 'created_at TIMESTAMPTZ DEFAULT NOW()'],
      indexes: ['CREATE INDEX idx_audit_actor ON audit_logs(actor_id)', 'CREATE INDEX idx_audit_created ON audit_logs(created_at DESC)']
    }
  ],
  acceptanceCriteria: [
    'Registration rejects passwords under 12 characters or without special characters with HTTP 422.',
    'Failed logins return ambiguous "Invalid credentials" error to prevent user enumeration attacks.',
    'Protected endpoints return HTTP 401 when Authorization header is absent or token is expired.',
    'Attempting to access administrative routes with developer role yields HTTP 403 Forbidden.',
    'All automated test suites must pass 100% without flake before pull request generation.'
  ],
  testScenarios: [
    { name: 'Unit: Password Entropy & Argon2 Verification', type: 'unit', description: 'Tests hashing salt variance and verification timing resistance against side-channel leaks.' },
    { name: 'Integration: Token Rotation & Expiry Edge Cases', type: 'integration', description: 'Validates that revoked refresh tokens immediately invalidate future token refresh cycles.' },
    { name: 'E2E: Complete Login, RBAC Protection & Logout Flow', type: 'e2e', description: 'Playwright test verifying end-to-end form inputs, UI state updates, and storage purge on logout.' }
  ],
  tasks: [
    { id: 'TASK-001', title: 'PostgreSQL Relational Schema & Alembic Migration', category: 'database', complexity: 'M', status: 'completed', assignedAgent: 'developer', dependencies: [] },
    { id: 'TASK-002', title: 'FastAPI Authentication Service & JWT Token Engine', category: 'backend', complexity: 'L', status: 'completed', assignedAgent: 'developer', dependencies: ['TASK-001'] },
    { id: 'TASK-003', title: 'RBAC Authorization Middleware & Security Guard', category: 'security', complexity: 'M', status: 'completed', assignedAgent: 'developer', dependencies: ['TASK-002'] },
    { id: 'TASK-004', title: 'React 19 Authentication Views & State Interceptor', category: 'frontend', complexity: 'M', status: 'completed', assignedAgent: 'developer', dependencies: ['TASK-002'] },
    { id: 'TASK-005', title: 'Automated Vitest, Pytest & Playwright QA Suite', category: 'testing', complexity: 'L', status: 'completed', assignedAgent: 'testing', dependencies: ['TASK-003', 'TASK-004'] },
    { id: 'TASK-006', title: 'CI/CD Pipeline & Azure Container Apps Configuration', category: 'devops', complexity: 'M', status: 'in_progress', assignedAgent: 'deployment', dependencies: ['TASK-005'] }
  ]
};

export const INITIAL_FILES: ProjectFile[] = [
  {
    path: 'backend/api/auth.py',
    language: 'python',
    explanation: 'FastAPI router handling token generation, credential verification, and user session management.',
    lastModifiedBy: 'developer',
    updatedAt: '2 minutes ago',
    content: `"""
FastAPI Authentication Subsystem - AgentForge AI Generated
Adheres to PEP 8, OWASP ASVS v4.0, and strict async I/O patterns.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
import datetime
import uuid

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication & RBAC"])

class UserRegistration(BaseModel):
    email: EmailStr = Field(..., description="Corporate email address")
    password: str = Field(..., min_length=12, description="Entropy verified secret")
    full_name: str = Field(..., min_length=2, max_length=100)
    role: str = Field("developer", pattern="^(developer|qa_engineer|security_lead|admin)$")

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int = 900
    user_id: str
    role: str

@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
async def register_user(payload: UserRegistration):
    """
    Registers a new tenant user with Argon2id salted password hashing.
    Enforces uniqueness constraints and dispatches an immutable audit log.
    """
    user_id = str(uuid.uuid4())
    synthetic_token = f"jwt_af_{uuid.uuid4().hex[:24]}"
    
    return AuthTokenResponse(
        access_token=synthetic_token,
        user_id=user_id,
        role=payload.role
    )

@router.post("/login", response_model=AuthTokenResponse)
async def login_user(form_data: OAuth2PasswordRequestForm = Depends()):
    """
    Authenticates user credentials. Implements exponential backoff on repeated failures.
    """
    if not form_data.username or not form_data.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username and password are required"
        )
    
    # Authenticated session token
    return AuthTokenResponse(
        access_token=f"jwt_af_{uuid.uuid4().hex[:24]}",
        user_id=str(uuid.uuid4()),
        role="admin" if "admin" in form_data.username else "developer"
    )
`
  },
  {
    path: 'backend/models/database.py',
    language: 'python',
    explanation: 'SQLAlchemy 2.0 async database models for users and immutable security audit logs.',
    lastModifiedBy: 'developer',
    updatedAt: '5 minutes ago',
    content: `"""
SQLAlchemy Async ORM Schema - AgentForge AI Generated
Designed for PostgreSQL 16 with UUIDv7 compatibility.
"""
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, Index, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="developer", nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    audit_logs = relationship("AuditLog", back_populates="actor", cascade="all, delete-orphan")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    actor_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(100), nullable=False, index=True)
    entity_type = Column(String(100), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=True)
    ip_hash = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    actor = relationship("User", back_populates="audit_logs")

    __table_args__ = (
        Index("idx_audit_created_desc", created_at.desc()),
        Index("idx_audit_actor_action", actor_id, action),
    )
`
  },
  {
    path: 'tests/unit/test_auth_service.py',
    language: 'python',
    explanation: 'Pytest suite verifying password complexity, token issuance, and credential rejection.',
    lastModifiedBy: 'testing',
    updatedAt: '12 minutes ago',
    content: `"""
Pytest Unit Test Suite for Authentication Subsystem
Executed in isolated container sandbox via AgentForge AI Testing Agent.
"""
import pytest
from pydantic import ValidationError

def test_password_entropy_rule_enforced():
    """Verify that passwords under 12 characters raise validation errors."""
    from backend.api.auth import UserRegistration
    
    with pytest.raises(ValidationError):
        UserRegistration(
            email="developer@spektra.internal",
            password="short",  # fails min_length=12
            full_name="Alex River",
            role="developer"
        )

def test_valid_registration_payload_accepted():
    """Verify valid credentials parse successfully with strict types."""
    from backend.api.auth import UserRegistration
    
    payload = UserRegistration(
        email="developer@spektra.internal",
        password="SuperSecurePassword2026!#",
        full_name="Alex River",
        role="developer"
    )
    assert payload.email == "developer@spektra.internal"
    assert len(payload.password) >= 12
    assert payload.role == "developer"
`
  },
  {
    path: 'tests/e2e/auth_flow.spec.ts',
    language: 'typescript',
    explanation: 'Playwright end-to-end browser automation script validating user sign-in and token persistence.',
    lastModifiedBy: 'testing',
    updatedAt: '15 minutes ago',
    content: `import { test, expect } from '@playwright/test';

test.describe('End-to-End Enterprise Auth Flow', () => {
  test('User successfully logs in and accesses role-gated engineering workspace', async ({ page }) => {
    await page.goto('/');

    // Check application presence
    await expect(page.locator('text=AgentForge AI')).toBeVisible();

    // Verify session badge
    const badge = page.locator('[data-testid="role-indicator"]');
    await expect(badge).toBeVisible();

    // Verify token presence in local state
    const currentUrl = page.url();
    expect(currentUrl).toContain('/');
  });

  test('Unauthenticated user receives HTTP 401 when accessing restricted endpoints', async ({ request }) => {
    const response = await request.get('/api/v1/users/me');
    expect([401, 404, 200]).toContain(response.status());
  });
});
`
  },
  {
    path: 'Dockerfile',
    language: 'dockerfile',
    explanation: 'Multi-stage production Dockerfile optimized for Azure Container Apps with zero-root execution.',
    lastModifiedBy: 'deployment',
    updatedAt: '25 minutes ago',
    content: `# Multi-stage secure build for AgentForge AI Services
FROM python:3.12-slim AS builder

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# Production image
FROM python:3.12-slim AS runner

WORKDIR /app
# Run as non-root user for security compliance (CWE-250)
RUN groupadd -r appgroup && useradd -r -g appgroup -u 1001 appuser

COPY --from=builder /root/.local /home/appuser/.local
COPY . /app

ENV PATH=/home/appuser/.local/bin:$PATH
ENV PYTHONUNBUFFERED=1

USER appuser
EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \\
  CMD curl -f http://localhost:8000/healthz || exit 1

CMD ["uvicorn", "backend.api.router:app", "--host", "0.0.0.0", "--port", "8000"]
`
  },
  {
    path: 'infrastructure/azure-container-app.bicep',
    language: 'bicep',
    explanation: 'Azure Bicep infrastructure-as-code for Azure Container Apps environment and ingress configuration.',
    lastModifiedBy: 'deployment',
    updatedAt: '30 minutes ago',
    content: `param location string = resourceGroup().location
param environmentName string = 'agentforge-prod-env'
param containerAppName string = 'agentforge-service'

resource containerAppEnv 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: environmentName
  location: location
  properties: {
    zoneRedundant: true
  }
}

resource containerApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: containerAppName
  location: location
  properties: {
    managedEnvironmentId: containerAppEnv.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8000
        transport: 'auto'
      }
    }
    template: {
      containers: [
        {
          name: 'agentforge-api'
          image: 'spektra.azurecr.io/agentforge-service:latest'
          resources: {
            cpu: json('0.5')
            memory: '1.0Gi'
          }
        }
      ]
      scale: {
        minReplicas: 2
        maxReplicas: 10
      }
    }
  }
}
`
  }
];

export const INITIAL_TEST_REPORT: TestReport = {
  executionSummary: {
    total: 12,
    passed: 12,
    failed: 0,
    durationMs: 648,
    coveragePercentage: 94.8,
  },
  selfCorrectionRequired: false,
  testSuiteFiles: [
    {
      filePath: 'tests/unit/test_auth_service.py',
      testFramework: 'pytest',
      testContent: `# Pytest unit suite verifying password entropy and schema parsing`
    },
    {
      filePath: 'tests/e2e/auth_flow.spec.ts',
      testFramework: 'playwright',
      testContent: `# Playwright browser verification suite`
    }
  ],
  results: [
    { name: 'test_password_entropy_rule_enforced', type: 'unit', status: 'passed', duration: '14ms' },
    { name: 'test_valid_registration_payload_accepted', type: 'unit', status: 'passed', duration: '16ms' },
    { name: 'test_argon2_hash_uniqueness_and_salt', type: 'unit', status: 'passed', duration: '32ms' },
    { name: 'test_jwt_signature_verification_rs256', type: 'unit', status: 'passed', duration: '28ms' },
    { name: 'test_token_expiry_boundary_conditions', type: 'integration', status: 'passed', duration: '44ms' },
    { name: 'test_database_cascade_delete_integrity', type: 'integration', status: 'passed', duration: '82ms' },
    { name: 'test_rbac_forbidden_route_rejection', type: 'integration', status: 'passed', duration: '51ms' },
    { name: 'test_audit_log_immutable_sequence', type: 'integration', status: 'passed', duration: '68ms' },
    { name: 'test_playwright_e2e_form_login', type: 'e2e', status: 'passed', duration: '124ms' },
    { name: 'test_playwright_e2e_role_based_rendering', type: 'e2e', status: 'passed', duration: '109ms' },
    { name: 'test_playwright_e2e_session_storage_purge', type: 'e2e', status: 'passed', duration: '72ms' },
    { name: 'test_container_health_probe_liveness', type: 'unit', status: 'passed', duration: '8ms' },
  ],
};

export const INITIAL_CODE_REVIEW: CodeReview = {
  approved: true,
  score: 96,
  summary: 'Code review completed with high engineering confidence. Zero critical security vulnerabilities found. Async database transaction isolation and Pydantic v2 schemas meet enterprise standards.',
  metrics: {
    cyclomaticComplexity: '1.3 (Optimal)',
    maintainabilityIndex: 96,
    securityDebt: '0 hours',
  },
  findings: [
    {
      id: 'SEC-101',
      severity: 'low',
      category: 'security',
      file: 'backend/api/auth.py',
      line: 38,
      rule: 'CWE-384: Session Fixation Mitigation',
      title: 'Ensure Refresh Token Revocation on Multi-Device Sign-in',
      description: 'Implement a token family revocation table to detect concurrent reuse of old refresh tokens across distinct IP subnets.',
      suggestedFix: 'Store jti (JWT ID) in a fast Redis cache with TTL equal to refresh token lifespan.',
      blocksDeployment: false,
      status: 'open',
    },
    {
      id: 'PERF-102',
      severity: 'info',
      category: 'performance',
      file: 'backend/models/database.py',
      line: 42,
      rule: 'DB-IDX-02: B-Tree Index Fillfactor Tuning',
      title: 'Optimize Audit Log Insert Performance',
      description: 'Since audit_logs is an append-only ledger, setting fillfactor=90 on the table avoids page splits during high burst write throughput.',
      suggestedFix: 'Append WITH (fillfactor = 90) to create table migration.',
      blocksDeployment: false,
      status: 'open',
    },
  ],
};

export const INITIAL_PULL_REQUEST: PullRequest = {
  id: 'pr-842',
  number: 842,
  title: 'feat(auth): enterprise authentication, RBAC middleware & audit ledger',
  branch: 'feature/autonomous-scaffold',
  base: 'main',
  status: 'open',
  summary: 'Autonomous end-to-end pull request generated by AgentForge AI multi-agent system. Contains complete FastAPI backend routes, SQLAlchemy models, test suites, and Dockerfile.',
  labels: ['ai-agent:verified', 'spektra:interview-demo', 'qa:passed', 'sec:clean'],
  createdAt: '2026-11-01T18:40:00Z',
  author: 'AgentForge AI Swarm',
  markdown: `## 🚀 Pull Request Summary: Enterprise Auth & Audit Ledger

### 📋 Objective
Implement autonomous software engineering module addressing the specification:
> **Customer Authentication, Audit Ledger & RBAC Subsystem** for high-throughput enterprise applications.

---

### 🛠️ Changes Implemented
- **Service Layer**: Configured FastAPI APIRouter with strict Pydantic schemas, dependency injection, and HTTP status codes.
- **Database Schema**: Normalized PostgreSQL entities with UUID primary keys, UTC timestamping, and indexing.
- **Automated Tests**: Unit, Integration, and Playwright E2E suites passing with 94.8% branch coverage.
- **Security Hardening**: OWASP Top 10 static inspection completed with zero deployment-blocking vulnerabilities.

---

### 🧪 Test Verification
- **Total Test Cases**: 12
- **Passed**: 12 ✅
- **Failed**: 0 ❌
- **Coverage**: 94.8%
- **Isolated Runner**: Containerized sandbox with restricted network policy

---

### 🔒 Security Considerations
- [x] Zero hardcoded API keys or secrets detected
- [x] CWE-89 (SQL Injection) prevented via parameterized ORM queries
- [x] CWE-79 (Cross-Site Scripting) mitigated via sanitized React DOM bindings
- [x] Role-Based Access Control (RBAC) enforced on non-public endpoints

---

### 🚢 Deployment Instructions
1. Run database migration: \`alembic upgrade head\`
2. Validate environment secrets in production key vault
3. Trigger blue-green container deploy on Azure Container Apps`
};

export const INITIAL_DEPLOYMENTS: DeploymentRecord[] = [
  {
    id: 'dep-prod-992',
    environment: 'production',
    version: 'v1.4.0',
    commitSha: '9a4c8f2',
    status: 'succeeded',
    targetPlatform: 'Azure Container Apps (East US 2)',
    deployedAt: '2026-11-01T17:30:00Z',
    duration: '1m 42s',
    approvedBy: 'Alex River (Principal Architect)',
    healthStatus: 'healthy',
    metrics: {
      cpuUsage: '14.2%',
      memoryUsage: '342 MB / 1024 MB',
      p99Latency: '34ms',
      uptime: '99.98%'
    }
  },
  {
    id: 'dep-qa-991',
    environment: 'staging',
    version: 'v1.4.1-rc2',
    commitSha: '6e21b0a',
    status: 'succeeded',
    targetPlatform: 'Azure Container Apps (Staging)',
    deployedAt: '2026-11-01T18:15:00Z',
    duration: '1m 15s',
    approvedBy: 'Auto-Deploy (CI/CD Pipeline)',
    healthStatus: 'healthy',
    metrics: {
      cpuUsage: '8.5%',
      memoryUsage: '210 MB / 1024 MB',
      p99Latency: '29ms',
      uptime: '100%'
    }
  }
];

export const INITIAL_LOGS: ExecutionLog[] = [
  { id: 'log-1', timestamp: '18:40:02', level: 'AGENT', agent: 'orchestrator', message: 'Received user requirement prompt. Parsing semantic intent and defining execution graph.' },
  { id: 'log-2', timestamp: '18:40:05', level: 'INFO', agent: 'orchestrator', message: 'Assigned specification synthesis to Specification Agent. Constraints: RFC-2119, PostgreSQL 16.' },
  { id: 'log-3', timestamp: '18:40:12', level: 'AGENT', agent: 'specification', message: 'Generated architecture blueprint, 6 API endpoints, and 2 normalized database tables.' },
  { id: 'log-4', timestamp: '18:40:15', level: 'INFO', agent: 'orchestrator', message: 'User approved specification. Decomposed into 6 atomic engineering tasks.' },
  { id: 'log-5', timestamp: '18:40:24', level: 'AGENT', agent: 'developer', message: 'Synthesized backend/api/auth.py and backend/models/database.py. Clean AST validation passed.' },
  { id: 'log-6', timestamp: '18:40:35', level: 'AGENT', agent: 'testing', message: 'Spawned isolated container sandbox. Running 12 unit, integration, and Playwright E2E suites.' },
  { id: 'log-7', timestamp: '18:40:42', level: 'INFO', agent: 'testing', message: '12 of 12 tests passed successfully (94.8% code coverage). No self-correction required.' },
  { id: 'log-8', timestamp: '18:40:49', level: 'AGENT', agent: 'reviewer', message: 'Code review completed. Maintainability score: 96/100. Zero deployment-blocking security findings.' },
  { id: 'log-9', timestamp: '18:40:55', level: 'AGENT', agent: 'deployment', message: 'Generated GitHub Pull Request #842. Azure Container Apps configuration validated.' },
];

export const INITIAL_USER: UserProfile = {
  id: 'usr-spektra-lead',
  name: 'Alex River',
  email: 'alex.river@spektra.internal',
  role: 'Principal Architect',
  permissions: ['spec:approve', 'code:edit', 'security:override', 'deploy:production', 'admin:manage'],
};

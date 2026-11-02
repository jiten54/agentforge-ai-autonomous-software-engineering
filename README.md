# AgentForge AI — Autonomous Software Engineering Platform

> **Candidate Portfolio Project for AI-Native Software Engineer – Trainee position at Spektra Systems LLC**

AgentForge AI is a production-grade autonomous software engineering workspace where users formulate high-level software requirements in natural language, and specialized AI agents collaborate across an execution graph to plan, synthesize, test, review, audit, and deploy software.

---

## 🌟 1. Core Product Capabilities

- **Natural Language to Technical Architecture**: Translates product briefs into RFC 2119 specifications, PostgreSQL schemas, and API contracts.
- **6 Independent, Coordinated AI Agents**:
  1. **Orchestrator Agent**: Manages execution graph DAG and task dependencies.
  2. **Specification Agent**: Synthesizes architecture, schemas, and acceptance criteria.
  3. **Developer Agent**: Writes type-safe FastAPI backends and React 19 frontends.
  4. **Testing Agent**: Executes Pytest, Vitest, and Playwright tests in isolated container sandboxes.
  5. **Code Reviewer Agent**: Evaluates cyclomatic complexity, code smells, and OWASP SAST vulnerabilities.
  6. **Deployment Agent**: Oversees CI/CD, Azure Container Apps Bicep templates, and blue-green releases.
- **Self-Correction Feedback Loop**: Autonomous retry loop where the Testing Agent passes failure diagnostics to the Developer Agent, synthesizing code patches without human intervention.
- **Strict Security Gatekeeper**: Blocks releases upon unhandled Critical or High CWE vulnerabilities (SQLi, XSS, Secret Leaks).

---

## 🏗️ 2. The 20 Fully-Functional Application Modules

1. **Engineering Command Center**: Live velocity metrics, test pass rates, security posture, and production container health.
2. **Project Management Workspace**: Git repository links, branch controllers, framework configs, and project provisioning.
3. **Requirement-to-Specification Studio**: Natural-language prompt editor with live Gemini-powered architecture synthesizer.
4. **Multi-Agent Control Room**: Real-time agent status cards, latency timers, token counters, and telemetry inspectors.
5. **Agent Workflow Visualizer**: Interactive state DAG showing bidirectional self-correction and data flow.
6. **Development Task Manager**: Kanban and list view with category filters and complexity ratings.
7. **AI Code Generation Workspace**: File explorer with multi-file code preview and architecture explanations.
8. **Monaco Code Editor**: Professional in-browser IDE with dark theme, syntax highlighting, and live file persistence.
9. **Automated Testing Laboratory**: Pytest and Playwright runner with interactive failure simulation and self-correction demo.
10. **AI Code Review Center**: Static analysis scoring (Maintainability Index, Cyclomatic Complexity, Debt).
11. **Security Validation Center**: OWASP Top 10 SAST audit with deployment blocker gates.
12. **GitHub Integration Center**: OAuth repository bindings, branch switcher, and GPG-verified commit ledger.
13. **Pull Request Generator**: Comprehensive markdown compiler with test results, security checklist, and GitHub submission.
14. **Deployment Management Center**: Azure Container Apps release manager with health probes and instant rollback.
15. **Agent Performance Analytics**: Cost and token analytics, pass rates, and developer engineering hours saved.
16. **AGENTS.md Generator**: Intelligent instruction manager generating repository governance standards.
17. **Agent Skills & Instructions Manager**: System prompt tuner and tool permission clearances.
18. **Execution Logs & Monitoring**: Searchable, filterable real-time terminal log stream with export support.
19. **User Authentication & Authorization (RBAC)**: Role switching (Principal Architect, Dev, QA, Security, DevOps).
20. **Project Settings & API Configuration**: Model routing (Gemini 3.8 Flash, Gemini 4 Argon), sandbox timeouts, and cloud quotas.

---

## 🚀 3. Live Demonstration Workflow

1. Navigate to **Requirement Studio** and select or customize a requirement.
2. Click **Generate Technical Spec** to invoke the Specification Agent.
3. Click **Approve & Dispatch Tasks** to decompose the spec into atomic engineering work items.
4. Launch the **Autonomous Swarm** via the primary action button to watch the entire 6-agent lifecycle execute synchronously.
5. Head to the **Testing Laboratory** and click **Simulate Failure Case** followed by **Trigger Automated Self-Correction Loop** to demo automated bug resolution.
6. Review the **Security Validation Center** to demonstrate zero-trust gatekeeping.
7. Switch roles using the **RBAC Identity Switcher** in the top navigation bar.
8. Authorize the **Azure Container Apps** release in the **Deployment Center**.

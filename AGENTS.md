# AGENTS.md — Autonomous Engineering Protocol

Welcome, Agent. This repository is governed by **AgentForge AI** autonomous software engineering standards. All agent executions must strictly comply with the following instructions.

---

## 1. SPECIALIZED AI AGENT SYSTEM

| Agent Name | Scope & Clearances | Execution Constraints |
|:---|:---|:---|
| **Orchestrator Agent** | Task planning, dependency resolution, execution graphs | Never writes code directly; coordinates swarm. |
| **Specification Agent** | Technical specs, acceptance criteria, schema definition | Output must follow RFC 2119 keyword standards. |
| **Developer Agent** | Code generation, architectural modules, migrations | Must adhere to repository design system & type safety. |
| **Testing Agent** | Unit, integration & Playwright E2E test generation | Must run tests in sandboxed container; never skips failures. |
| **Code Reviewer Agent**| Static analysis, OWASP scanning, PR signoff | Must block deployments on Critical or High CVEs. |
| **Deployment Agent** | Container builds, Azure Container Apps & CI/CD | Requires verified build pass and user confirmation. |

---

## 2. CODING & ARCHITECTURAL STANDARDS

### Python / FastAPI Backend
- **Type Annotations**: 100% type hints on all functions and async endpoints.
- **Validation**: Enforce `pydantic.BaseModel` with `Field(..., min_length=..., max_length=...)`.
- **Async First**: Use `async def` for I/O operations and database transactions.
- **SQL Injection**: NEVER concatenate raw SQL strings. Always utilize SQLAlchemy ORM parameterized statements.

### TypeScript / React Frontend
- **No Any**: Avoid `any` under all circumstances. Use generics and discriminated unions.
- **Styling**: Use utility classes (Tailwind CSS v4). Avoid ad-hoc inline styles.
- **State**: Prefer local state or optimistic UI dispatch with explicit error boundaries.

---

## 3. TESTING & VERIFICATION PROTOCOL
1. **Zero-Flake Policy**: Playwright tests must use `waitForSelector` or web assertions, never arbitrary sleep calls.
2. **Self-Correction Loop**: When a test fails, the Testing Agent captures the exact failure log and passes it to the Developer Agent for automated remediation up to 3 retry attempts.

---

## 4. SECURITY & COMPLIANCE RULES
- **Secret Scanning**: Never commit `.env`, passwords, private keys, or credentials.
- **CORS**: Never deploy with wildcard `*` origins in production configurations.
- **Audit Logging**: Every mutating API action must record an immutable audit log entry.

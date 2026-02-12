<!--
  Sync Impact Report
  ===================
  Version change: (none) → 1.0.0
  
  Modified principles: N/A (initial adoption)
  
  Added sections:
    - Core Principles (5 principles)
    - Code Quality Standards
    - Security & Configuration
    - Governance
  
  Removed sections: N/A
  
  Templates requiring updates:
    - .specify/templates/plan-template.md ✅ (no updates needed - Constitution Check section is generic)
    - .specify/templates/spec-template.md ✅ (no updates needed - requirements format compatible)
    - .specify/templates/tasks-template.md ✅ (no updates needed - task structure compatible)
  
  Follow-up TODOs: None
-->

# Dynamic Todo Constitution

## Core Principles

### I. Readability Over Cleverness

Code MUST prioritize human comprehension over performance optimization or brevity.

- Clear, explicit logic MUST be preferred over clever one-liners or obscure patterns
- Complex abstractions that obscure control flow are PROHIBITED
- Deeply nested callbacks or conditionals (>3 levels) MUST be refactored
- Code SHOULD read like well-written prose describing its intent

**Rationale**: This is a demonstration and teaching codebase. Every reader—beginner or experienced—must understand the code without extensive context.

### II. Explicit Type Safety

All code MUST use TypeScript with explicit, precise types.

- The `any` type is PROHIBITED except when interfacing with untyped external libraries (and MUST be documented)
- Function parameters and return types MUST have explicit type annotations
- Prefer union types and interfaces over loose typing
- Generic types SHOULD have meaningful constraint names

**Rationale**: Explicit types serve as documentation, catch errors at compile time, and demonstrate proper TypeScript usage for learners.

### III. Self-Documenting Code

Names and structure MUST convey intent without requiring external documentation.

- Functions and variables MUST have descriptive, self-explanatory names
- Each function MUST do one thing well (Single Responsibility)
- Magic numbers and strings MUST be extracted to named constants
- Comments MUST explain "why" (reasoning, trade-offs), not "what" (which the code already shows)

**Rationale**: Self-documenting code reduces maintenance burden and helps learners understand not just the mechanics but the reasoning.

### IV. User-Centric Experience

All features MUST be designed from the user's perspective first.

- User workflows MUST be intuitive and require minimal learning curve
- Error messages MUST be actionable and user-friendly
- UI feedback MUST be immediate and clear
- Accessibility standards MUST be followed

**Rationale**: A teaching codebase should exemplify user-centered design principles that students can apply to their own projects.

### V. Simplicity & Maintainability

Start simple; add complexity only when proven necessary.

- YAGNI (You Aren't Gonna Need It): Do not implement features until they are actually required
- Overly DRY code that sacrifices readability is PROHIBITED
- Each module SHOULD be understandable in isolation
- Dependencies MUST be minimal and justified

**Rationale**: Maintainability enables long-term teaching value. Simple code is easier to explain, debug, and extend.

## Code Quality Standards

### Structural Requirements

- **Small functions**: Functions SHOULD be ≤30 lines; larger functions MUST be justified
- **Flat conditionals**: Prefer early returns and guard clauses over nested if/else
- **Consistent formatting**: ESLint and Prettier rules MUST be enforced

### Documentation Requirements

- README files MUST describe purpose, setup, and usage
- Complex business logic MUST include inline rationale comments
- API contracts MUST be documented with examples

## Security & Configuration

### Configuration Management

- Environment variables MUST be used for all configuration values
- `.env` files MUST be used for local development settings
- `.env.sample` MUST exist with placeholder values for all required variables
- Actual `.env` files MUST NOT be committed to version control

### Secret Protection

- Secrets (API keys, passwords, tokens) MUST NEVER be committed to the repository
- `.gitignore` MUST include all secret-containing files
- All secret references MUST be through environment variables

## Governance

This constitution supersedes all other development practices for this project. All contributions MUST comply with these principles.

### Amendment Process

1. Amendments MUST be documented with rationale
2. Version number MUST be incremented per semantic versioning (MAJOR.MINOR.PATCH)
3. LAST_AMENDED_DATE MUST be updated to reflect the change date

### Compliance Verification

- All PRs/reviews MUST verify compliance with these principles
- Any deviation MUST be explicitly justified in code comments or PR description
- Complexity exceptions MUST reference specific requirements that necessitate them

**Version**: 1.0.0 | **Ratified**: 2026-02-11 | **Last Amended**: 2026-02-11

# Research: Copilot Dynamic Todo

**Feature**: 1-copilot-dynamic-todo  
**Date**: 2026-02-11  
**Purpose**: Technology decisions and best practices research for implementation

## Technology Decisions

### 1. GitHub Copilot SDK Integration

**Decision**: Use `@github/copilot-sdk` for AI-powered chat and tool calling

**Rationale**: 
- GitHub Copilot SDK provides built-in streaming, tool calling, and session management
- Communicates with Copilot CLI via JSON-RPC for agentic workflows
- Supports custom tools with `defineTool` API and Zod schema validation
- Uses existing GitHub authentication (token or logged-in user)

**Alternatives Considered**:
- OpenAI API directly: Rejected - extra authentication complexity, not integrated with GitHub ecosystem
- Anthropic Claude API directly: Rejected - requires separate API key management
- @copilot-extensions/preview-sdk: Rejected - designed for building GitHub Copilot Extensions (webhooks), not standalone apps

**Implementation Notes**:
- Use `@github/copilot-sdk` npm package
- Requires GitHub Copilot CLI installed (`copilot` in PATH)
- Configure via `GITHUB_TOKEN` environment variable or `copilot auth login`
- Tool calls use `defineTool` with Zod schemas for type-safe handlers

### 2. Dynamic UI Generation Approach

**Decision**: Component-based rendering with React Server Components + Client hydration

**Rationale**:
- Constitution Principle I (Readability): Explicit component composition is easier to understand than string-based code generation
- Constitution Principle V (Simplicity): Use existing React paradigms rather than custom templating
- AI modifies JSON component trees, not raw TSX strings

**Alternatives Considered**:
- String-based code generation (eval): Rejected - security risk, violates Readability principle
- Full code file modification: Rejected - complex diffing, harder to roll back
- iframes with separate apps per user: Rejected - breaks shared state, poor UX

**Pattern**:
```typescript
// UI state stored as JSON, rendered via component registry
interface UITree {
  component: string;          // Component name from registry
  props: Record<string, unknown>;  // Props to pass
  children?: UITree[];        // Nested components
}
```

### 3. MCP Server Architecture

**Decision**: Co-located MCP server within Next.js API routes

**Rationale**:
- Constitution Principle V (Simplicity): Single deployment, no separate process management
- Shared TypeScript types between server and client
- Next.js 16 supports long-running connections for MCP stdio protocol simulation via HTTP

**Alternatives Considered**:
- Separate Node.js MCP server: Rejected - extra process, deployment complexity
- Edge functions: Rejected - MCP needs stateful connections

**Implementation Notes**:
- MCP endpoints at `/api/mcp/*`
- Component registry exposed as MCP resource
- Tool definitions for UI modification operations

### 4. Per-User State Storage

**Decision**: Local filesystem with JSON + minimal TSX files in `data/users/{userId}/`

**Rationale**:
- Constitution Principle V (Simplicity): No database needed for demo
- Constitution Principle III (Self-Documenting): Human-readable state files
- Easy reset via file copy from defaults

**Structure**:
```
data/users/{userId}/
├── state.json    # Current UI tree configuration
├── tasks.json    # User's task data
└── history.json  # Change history for display
```

**Alternatives Considered**:
- SQLite: Rejected - overkill for demo, adds dependency
- In-memory only: Rejected - loses state on restart
- IndexedDB (client-side): Rejected - per-user state needs server-side for MCP access

### 5. Theme Implementation

**Decision**: Tailwind CSS dark mode with CSS custom properties

**Rationale**:
- Already using Tailwind (existing project dependency)
- Constitution Principle IV (User-Centric): Instant toggle, no flash
- System preference detection built-in

**Implementation**:
- `class` strategy for Tailwind dark mode
- `ThemeProvider` context for React components
- Persist preference in localStorage

### 6. Testing Strategy

**Decision**: Jest + React Testing Library for unit/integration, Playwright for E2E

**Rationale**:
- Constitution Principle III (Self-Documenting): Tests document behavior
- React Testing Library enforces user-centric testing patterns
- Playwright for AI-driven chat flow testing

**Coverage Priorities**:
1. Component rendering with various props
2. API route handlers for tasks CRUD
3. MCP tool execution
4. Full user story flows (E2E)

## Dependencies Justification

| Dependency | Purpose | Justification (Constitution Principle V) |
|------------|---------|------------------------------------------|
| `@github/copilot-sdk` | GitHub Copilot integration | Core feature, provides agentic workflows and tool calling |
| `zod` | Schema validation | Optional, useful for type-safe tool handlers with defineTool |
| `@modelcontextprotocol/sdk` | MCP server | Required for component discovery feature |
| `zustand` | State management | Minimal footprint, explicit over Redux |
| `tailwindcss` | Styling | Already in project, no additional complexity |
| `jest` | Unit testing | Industry standard, good TS support |
| `playwright` | E2E testing | Best cross-browser support, AI flow testing |

## Open Questions (Resolved)

### Q1: How does Copilot SDK provide streaming responses?
**Answer**: SDK provides `onToken` callback for streaming. Use Server-Sent Events (SSE) from Next.js API route to client.

### Q2: Can MCP work over HTTP instead of stdio?
**Answer**: Yes, MCP SDK supports HTTP transport. Use `/api/mcp/sse` endpoint for server-to-client, POST for client-to-server.

### Q3: How to handle concurrent UI modifications?
**Answer**: Optimistic locking with version numbers in state.json. Reject stale writes with clear error message.

## Best Practices Identified

### React Server Components + Client Components
- Server Components for initial state loading
- Client Components for interactive elements (chat, todo interactions)
- Mark interactive components with `'use client'` directive

### Error Handling Pattern
```typescript
// Constitution-compliant error handling (Principle IV - User-Centric)
interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;      // User-friendly message
    code: string;         // Machine-readable code
    suggestion?: string;  // What user can do
  };
}
```

### File-Based State Updates
```typescript
// Atomic writes with temp file + rename (prevents corruption)
async function updateUserState(userId: string, update: Partial<UIState>): Promise<void> {
  const tempPath = `${statePath}.tmp`;
  await fs.writeFile(tempPath, JSON.stringify(newState, null, 2));
  await fs.rename(tempPath, statePath);
}
```

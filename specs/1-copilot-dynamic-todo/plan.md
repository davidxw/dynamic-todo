# Implementation Plan: Copilot Dynamic Todo

**Branch**: `1-copilot-dynamic-todo` | **Date**: 2026-02-11 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/1-copilot-dynamic-todo/spec.md`

## Summary

Build a Dynamic Todo application that demonstrates the GitHub Copilot SDK by enabling users to customize the UI through natural language commands via a chat interface. The system uses a dynamic React UI engine with an MCP server for component discovery, while storing per-user customizations on disk.

## Technical Context

**Language/Version**: TypeScript 4.9, Node.js (LTS)  
**Framework**: Next.js 16.1.6 (App Router)  
**Primary Dependencies**: React 19.2.3, Tailwind CSS 3.3, GitHub Copilot SDK, MCP SDK  
**Storage**: Local filesystem (JSON files for user state, TSX files for dynamic UI)  
**Testing**: Jest + React Testing Library (unit/integration), Playwright (E2E)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web application (single Next.js project)  
**Performance Goals**: <500ms UI updates, <2s AI response initiation, 60fps animations  
**Constraints**: Local demo only (no auth required), single-user runtime, <100MB disk per user  
**Scale/Scope**: Demo application, 3 sample users, ~15 UI components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Readability Over Cleverness ✅
- [ ] All dynamic UI code uses explicit, readable patterns (no meta-programming magic)
- [ ] Chat message processing has clear, linear control flow
- [ ] Component composition follows understandable hierarchies

### II. Explicit Type Safety ✅  
- [ ] All components use explicit TypeScript interfaces
- [ ] API contracts defined with strict types
- [ ] No `any` types except for Copilot SDK responses (documented)

### III. Self-Documenting Code ✅
- [ ] Component names describe their purpose (e.g., `TaskListItem`, `ChatMessageBubble`)
- [ ] Constants extracted for all configuration values
- [ ] Comments explain "why" for AI integration design decisions

### IV. User-Centric Experience ✅
- [ ] Immediate feedback on all actions (<500ms)
- [ ] Clear error messages for AI failures
- [ ] Accessible UI with keyboard navigation

### V. Simplicity & Maintainability ✅
- [ ] Start with minimal viable MVP (P1 story only)
- [ ] No premature abstractions
- [ ] Dependencies justified in research.md

### Security & Configuration ✅
- [ ] `.env.sample` created with all required variables
- [ ] GitHub token stored via environment variable only
- [ ] `.gitignore` updated for user data directories

## Project Structure

### Documentation (this feature)

```text
specs/1-copilot-dynamic-todo/
├── plan.md              # This file
├── research.md          # Phase 0: Technology decisions
├── data-model.md        # Phase 1: Entity definitions
├── quickstart.md        # Phase 1: Getting started guide
├── contracts/           # Phase 1: API contracts
│   └── todo-api.yaml    # OpenAPI spec for Todo operations
└── tasks.md             # Phase 2: Implementation tasks (not created by /speckit.plan)
```

### Source Code (existing Next.js project)

```text
src/dynamic-todo/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with theme provider
│   ├── page.tsx              # Main page with split layout
│   ├── globals.css           # Global styles + Tailwind
│   └── api/                  # API routes
│       ├── tasks/            # Todo CRUD endpoints
│       └── ui/               # Dynamic UI endpoints
├── components/
│   ├── chrome/               # App shell (header, user switcher, reset)
│   │   ├── AppHeader.tsx
│   │   ├── UserSwitcher.tsx
│   │   └── ResetButton.tsx
│   ├── chat/                 # Chat interface
│   │   ├── ChatPanel.tsx
│   │   ├── ChatMessage.tsx
│   │   └── ReasoningDisplay.tsx
│   ├── todo/                 # Sample Todo app components
│   │   ├── TodoApp.tsx       # Main container
│   │   ├── TaskList.tsx
│   │   ├── TaskItem.tsx
│   │   └── TaskInput.tsx
│   └── ui/                   # Shared UI primitives
│       └── index.ts          # Exported components for dynamic use
├── lib/
│   ├── copilot/              # GitHub Copilot SDK integration
│   │   └── client.ts
│   ├── mcp/                  # MCP server
│   │   ├── server.ts
│   │   └── components.ts     # Component registry
│   └── storage/              # File-based persistence
│       └── userState.ts
├── types/                    # TypeScript interfaces
│   ├── task.ts
│   ├── user.ts
│   └── chat.ts
├── data/                     # Per-user storage (gitignored)
│   └── users/
│       ├── default/
│       ├── alice/
│       └── bob/
└── constants/                # Configuration constants
    └── index.ts
```

**Structure Decision**: Single Next.js project in `src/dynamic-todo/` using App Router. No separate backend needed since Next.js API routes handle server-side logic and MCP integration. Per-user UI state stored in `data/users/` directory (gitignored).

## Complexity Tracking

> No violations identified. Design follows all constitution principles.

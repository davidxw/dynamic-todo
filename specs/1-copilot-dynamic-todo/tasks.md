# Tasks: Copilot Dynamic Todo

**Input**: Design documents from `/specs/1-copilot-dynamic-todo/`
**Prerequisites**: plan.md ✓, spec.md ✓, research.md ✓, data-model.md ✓, contracts/ ✓

**Tests**: Not explicitly requested in feature specification - test tasks omitted.

**Organization**: Tasks grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2)
- Include exact file paths in descriptions

## Path Conventions

Based on plan.md, project structure uses `src/` with Next.js App Router.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, environment, and shared dependencies

- [ ] T001 Create project directory structure per plan.md in src/
- [ ] T002 [P] Create .env.sample with GITHUB_TOKEN and PORT variables
- [ ] T003 [P] Update .gitignore to include data/users/ directory
- [ ] T004 Install dependencies: @copilot-extensions/preview-sdk, @modelcontextprotocol/sdk, zustand, uuid in package.json
- [ ] T005 [P] Create TypeScript interfaces for Task entity in src/types/task.ts
- [ ] T006 [P] Create TypeScript interfaces for User entity in src/types/user.ts
- [ ] T007 [P] Create TypeScript interfaces for ChatMessage, ReasoningStep, ToolCall in src/types/chat.ts
- [ ] T008 [P] Create TypeScript interfaces for UIComponent, PropDefinition, UITree, UIState in src/types/ui.ts
- [ ] T009 [P] Create TypeScript interfaces for ChangeLog in src/types/changelog.ts
- [ ] T010 [P] Create configuration constants in src/constants/index.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 Implement file-based storage utilities for reading/writing JSON in src/lib/storage/fileUtils.ts
- [ ] T012 Implement user state storage service in src/lib/storage/userState.ts
- [ ] T013 [P] Create default user data directory structure in data/users/default/
- [ ] T014 [P] Create sample alice user data directory in data/users/alice/
- [ ] T015 [P] Create sample bob user data directory in data/users/bob/
- [ ] T016 Implement global error handling and logging utilities in src/lib/errorHandling.ts
- [ ] T017 [P] Create ThemeProvider context for dark/light mode in src/components/ui/ThemeProvider.tsx
- [ ] T018 [P] Create shared Button component in src/components/ui/Button.tsx
- [ ] T019 [P] Create shared TextInput component in src/components/ui/TextInput.tsx
- [ ] T020 [P] Create shared Checkbox component in src/components/ui/Checkbox.tsx
- [ ] T021 [P] Create shared Card component in src/components/ui/Card.tsx
- [ ] T022 [P] Create shared Badge component in src/components/ui/Badge.tsx
- [ ] T023 Export all shared UI primitives from src/components/ui/index.ts
- [ ] T024 Create npm script init-users to initialize user directories in package.json

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - View and Use Sample Todo App (Priority: P1) 🎯 MVP

**Goal**: Fully functional Todo app with add, complete, delete tasks and theme toggle

**Independent Test**: Open app, add/complete/delete tasks, toggle theme - all work without AI features

### Implementation for User Story 1

- [ ] T025 [P] [US1] Implement Task service for CRUD operations in src/lib/services/taskService.ts
- [ ] T026 [US1] Create GET /api/tasks endpoint (list tasks with filter/sort) in src/app/api/tasks/route.ts
- [ ] T027 [US1] Create POST /api/tasks endpoint (create task) in src/app/api/tasks/route.ts
- [ ] T028 [US1] Create GET /api/tasks/[taskId] endpoint in src/app/api/tasks/[taskId]/route.ts
- [ ] T029 [US1] Create PATCH /api/tasks/[taskId] endpoint (update task) in src/app/api/tasks/[taskId]/route.ts
- [ ] T030 [US1] Create DELETE /api/tasks/[taskId] endpoint in src/app/api/tasks/[taskId]/route.ts
- [ ] T031 [US1] Create POST /api/tasks/bulk endpoint for bulk operations in src/app/api/tasks/bulk/route.ts
- [ ] T032 [P] [US1] Create TaskInput component for adding tasks in src/components/todo/TaskInput.tsx
- [ ] T033 [P] [US1] Create TaskItem component with toggle/delete in src/components/todo/TaskItem.tsx
- [ ] T034 [US1] Create TaskList component to display tasks in src/components/todo/TaskList.tsx
- [ ] T035 [US1] Create TodoApp container component in src/components/todo/TodoApp.tsx
- [ ] T036 [P] [US1] Create AppHeader component with theme toggle in src/components/chrome/AppHeader.tsx
- [ ] T037 [US1] Update globals.css with Tailwind dark mode support in src/app/globals.css
- [ ] T038 [US1] Update root layout with ThemeProvider in src/app/layout.tsx
- [ ] T039 [US1] Implement main page with TodoApp in src/app/page.tsx
- [ ] T040 [US1] Create default tasks.json with sample tasks in data/users/default/tasks.json

**Checkpoint**: User Story 1 complete - Todo app is fully functional with theme toggle

---

## Phase 4: User Story 2 - Customize UI via Chat Interface (Priority: P2)

**Goal**: Users can modify Todo UI through natural language chat with AI reasoning visibility

**Independent Test**: Open chat, request "Add priority dropdown to tasks", verify UI updates with reasoning shown

### Implementation for User Story 2

- [ ] T041 [P] [US2] Implement GitHub Copilot SDK client wrapper in src/lib/copilot/client.ts
- [ ] T042 [P] [US2] Create MCP component registry with all UI components in src/lib/mcp/components.ts
- [ ] T043 [US2] Implement MCP server with HTTP transport in src/lib/mcp/server.ts
- [ ] T044 [US2] Implement modify_ui MCP tool in src/lib/mcp/tools/modifyUI.ts
- [ ] T045 [US2] Implement validate_tree MCP tool in src/lib/mcp/tools/validateTree.ts
- [ ] T046 [US2] Implement get_current_tree MCP tool in src/lib/mcp/tools/getCurrentTree.ts
- [ ] T047 [US2] Implement get_component_details MCP tool in src/lib/mcp/tools/getComponentDetails.ts
- [ ] T048 [US2] Create GET /api/mcp/sse endpoint for SSE streaming in src/app/api/mcp/sse/route.ts
- [ ] T049 [US2] Create POST /api/mcp endpoint for tool invocations in src/app/api/mcp/route.ts
- [ ] T050 [US2] Create GET /api/ui/state endpoint in src/app/api/ui/state/route.ts
- [ ] T051 [US2] Create PUT /api/ui/state endpoint with optimistic locking in src/app/api/ui/state/route.ts
- [ ] T052 [US2] Create GET /api/ui/history endpoint in src/app/api/ui/history/route.ts
- [ ] T053 [P] [US2] Create ChatMessage component in src/components/chat/ChatMessage.tsx
- [ ] T054 [P] [US2] Create ReasoningDisplay component for AI steps in src/components/chat/ReasoningDisplay.tsx
- [ ] T055 [P] [US2] Create ToolCallDisplay component in src/components/chat/ToolCallDisplay.tsx
- [ ] T056 [US2] Create ChatPanel component with input and messages in src/components/chat/ChatPanel.tsx
- [ ] T057 [US2] Implement chat state management with zustand in src/lib/stores/chatStore.ts
- [ ] T058 [US2] Implement UI state management with zustand in src/lib/stores/uiStore.ts
- [ ] T059 [US2] Create dynamic UI renderer component in src/components/ui/DynamicRenderer.tsx
- [ ] T060 [US2] Integrate ChatPanel into main layout in src/app/layout.tsx
- [ ] T061 [US2] Create default state.json with initial UITree in data/users/default/state.json
- [ ] T062 [US2] Create default history.json for change log in data/users/default/history.json

**Checkpoint**: User Story 2 complete - Chat interface works with AI customization

---

## Phase 5: User Story 3 - Reset UI to Original State (Priority: P3)

**Goal**: Users can reset customizations to original state with one click

**Independent Test**: Make customizations, click reset, verify UI returns to default state

### Implementation for User Story 3

- [ ] T063 [US3] Create POST /api/ui/reset endpoint in src/app/api/ui/reset/route.ts
- [ ] T064 [US3] Implement resetState function in src/lib/storage/userState.ts
- [ ] T065 [US3] Create ResetButton component in src/components/chrome/ResetButton.tsx
- [ ] T066 [US3] Add ResetButton to AppHeader in src/components/chrome/AppHeader.tsx
- [ ] T067 [US3] Add reset action to uiStore in src/lib/stores/uiStore.ts

**Checkpoint**: User Story 3 complete - Reset functionality works

---

## Phase 6: User Story 4 - Switch Between Sample Users (Priority: P4)

**Goal**: Users can switch between sample users to see different UI customization states

**Independent Test**: Switch users in dropdown, verify each user shows their customized state

### Implementation for User Story 4

- [ ] T068 [US4] Create GET /api/users endpoint in src/app/api/users/route.ts
- [ ] T069 [US4] Create GET /api/users/[userId] endpoint in src/app/api/users/[userId]/route.ts
- [ ] T070 [US4] Create user service for user operations in src/lib/services/userService.ts
- [ ] T071 [US4] Create UserSwitcher dropdown component in src/components/chrome/UserSwitcher.tsx
- [ ] T072 [US4] Implement current user state management with zustand in src/lib/stores/userStore.ts
- [ ] T073 [US4] Add UserSwitcher to AppHeader in src/components/chrome/AppHeader.tsx
- [ ] T074 [US4] Create customized state.json for alice in data/users/alice/state.json
- [ ] T075 [US4] Create customized state.json for bob in data/users/bob/state.json
- [ ] T076 [US4] Create users.json configuration file in data/users/users.json

**Checkpoint**: User Story 4 complete - User switching works

---

## Phase 7: User Story 5 - View Available UI Components via MCP (Priority: P5)

**Goal**: Users can discover available UI components through chat

**Independent Test**: Ask chat "What components can I use?", verify component list is returned

### Implementation for User Story 5

- [ ] T077 [US5] Expose components resource via MCP in src/lib/mcp/resources/componentsResource.ts
- [ ] T078 [US5] Add component discovery tool responses in src/lib/copilot/client.ts
- [ ] T079 [US5] Create Select dropdown component in src/components/ui/Select.tsx
- [ ] T080 [US5] Create DatePicker component in src/components/ui/DatePicker.tsx
- [ ] T081 [US5] Create TaskFilter component in src/components/todo/TaskFilter.tsx
- [ ] T082 [US5] Create TaskStats component in src/components/todo/TaskStats.tsx
- [ ] T083 [US5] Register all new components in MCP registry in src/lib/mcp/components.ts

**Checkpoint**: User Story 5 complete - Component discovery works

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T084 [P] Create README.md with setup instructions in src/
- [ ] T085 [P] Add error boundary component for graceful error handling in src/components/ui/ErrorBoundary.tsx
- [ ] T086 Add loading states to all async operations
- [ ] T087 [P] Add keyboard navigation support to TaskItem and chat input
- [ ] T088 Validate all user stories work end-to-end per quickstart.md
- [ ] T089 Performance optimization: ensure <500ms UI updates
- [ ] T090 Ensure 60fps animations on theme toggle and UI updates

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phases 3-7)**: All depend on Foundational phase completion
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational - Shares UI components with US1 but independently testable
- **User Story 3 (P3)**: Can start after Foundational - Uses storage from foundation, testable independently
- **User Story 4 (P4)**: Can start after Foundational - Uses storage from foundation, testable independently
- **User Story 5 (P5)**: Requires US2 MCP foundation (T041-T049) - Can be started once MCP infrastructure exists

### Within Each User Story

- Models/types before services
- Services before API routes
- API routes before UI components
- Core components before integration
- Story complete before moving to next priority

### Parallel Opportunities

**Setup Phase (T001-T010)**:
- T002, T003 can run in parallel with T001
- T005-T010 (all types and constants) can run in parallel after T001

**Foundational Phase (T011-T024)**:
- T013, T014, T015 (user directories) run in parallel
- T017-T022 (UI primitives) run in parallel after structure created

**User Story 1 (T025-T040)**:
- T025 (task service) and T032, T033, T036 (components) can run in parallel

**User Story 2 (T041-T062)**:
- T041 (Copilot client) and T042 (MCP registry) run in parallel
- T053, T054, T055 (chat components) run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch models in parallel:
T025: "Implement Task service in src/lib/services/taskService.ts"
T032: "Create TaskInput component in src/components/todo/TaskInput.tsx"
T033: "Create TaskItem component in src/components/todo/TaskItem.tsx"
T036: "Create AppHeader component in src/components/chrome/AppHeader.tsx"

# Then sequential for integration:
T026-T031: API routes (sequential, same directory)
T034-T035: TaskList → TodoApp (composition)
T037-T040: Layout integration (sequential)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test Todo app independently
5. Deploy/demo if ready - working productivity app

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → **Deploy/Demo (MVP!)**
3. Add User Story 2 → Test independently → Deploy/Demo (AI customization)
4. Add User Story 3 → Test independently → Deploy/Demo (Reset safety)
5. Add User Story 4 → Test independently → Deploy/Demo (Multi-user)
6. Add User Story 5 → Test independently → Deploy/Demo (Component discovery)
7. Each story adds value without breaking previous stories

### Suggested MVP Scope

**For initial demo**: Complete through User Story 1 (T001-T040) = 40 tasks
- Delivers working Todo app with theme toggle
- No AI dependencies for initial validation
- Can demo core value proposition immediately

---

## Notes

- [P] tasks = different files, no dependencies within phase
- [Story] label maps task to specific user story for traceability
- Each user story independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- File paths based on plan.md project structure


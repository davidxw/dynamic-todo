# Data Model: Copilot Dynamic Todo

**Feature**: 1-copilot-dynamic-todo  
**Date**: 2026-02-11  
**Source**: [spec.md](spec.md) Key Entities section

## Entities

### Task

A todo item representing a single task in the user's list.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier (UUID v4) |
| `title` | `string` | Yes | Task description text (1-500 chars) |
| `completed` | `boolean` | Yes | Whether task is marked done |
| `createdAt` | `string` (ISO 8601) | Yes | When task was created |
| `completedAt` | `string` (ISO 8601) | No | When task was completed |
| `metadata` | `Record<string, unknown>` | No | Extensible properties for UI customizations |

**Validation Rules**:
- `title` must be non-empty and ≤500 characters
- `completedAt` must be set when `completed` is true

**Example**:
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Review PR #42",
  "completed": false,
  "createdAt": "2026-02-11T10:30:00Z",
  "metadata": {
    "priority": "high",
    "dueDate": "2026-02-12"
  }
}
```

---

### User

A sample user identity with associated customization state.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique identifier (slug format) |
| `displayName` | `string` | Yes | Name shown in UI switcher |
| `isDefault` | `boolean` | Yes | Whether this is the default/reset state |

**Example**:
```json
{
  "id": "alice",
  "displayName": "Alice (Custom Theme)",
  "isDefault": false
}
```

---

### UIComponent

A React component definition available for dynamic rendering.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | Yes | Component identifier (PascalCase) |
| `description` | `string` | Yes | What the component does |
| `category` | `string` | Yes | Grouping: "layout", "input", "display", "todo" |
| `props` | `PropDefinition[]` | Yes | Available props with types |
| `canHaveChildren` | `boolean` | Yes | Whether component accepts children |

**PropDefinition**:
| Field | Type | Description |
|-------|------|-------------|
| `name` | `string` | Prop name |
| `type` | `string` | TypeScript type |
| `required` | `boolean` | Whether prop is required |
| `description` | `string` | What the prop does |
| `defaultValue` | `unknown` | Default if not provided |

**Example**:
```json
{
  "name": "TaskItem",
  "description": "Displays a single task with completion toggle",
  "category": "todo",
  "props": [
    {
      "name": "task",
      "type": "Task",
      "required": true,
      "description": "The task data to display"
    },
    {
      "name": "onToggle",
      "type": "(id: string) => void",
      "required": true,
      "description": "Callback when completion is toggled"
    },
    {
      "name": "showDueDate",
      "type": "boolean",
      "required": false,
      "description": "Whether to display due date field",
      "defaultValue": false
    }
  ],
  "canHaveChildren": false
}
```

---

### UITree

The current rendered state of the Todo app UI for a given user.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `component` | `string` | Yes | Component name from registry |
| `props` | `Record<string, unknown>` | No | Props to pass to component |
| `children` | `UITree[]` | No | Nested child components |

**Example**:
```json
{
  "component": "TodoApp",
  "props": { "showHeader": true },
  "children": [
    {
      "component": "TaskInput",
      "props": { "placeholder": "What needs to be done?" }
    },
    {
      "component": "TaskList",
      "props": { "filter": "all" },
      "children": []
    }
  ]
}
```

---

### UIState

Complete persisted state for a user's customized UI.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `version` | `number` | Yes | State version for optimistic locking |
| `userId` | `string` | Yes | Owner user ID |
| `tree` | `UITree` | Yes | Current component tree |
| `lastModified` | `string` (ISO 8601) | Yes | Last state change timestamp |

**Example**:
```json
{
  "version": 3,
  "userId": "alice",
  "tree": { "component": "TodoApp", "props": {}, "children": [] },
  "lastModified": "2026-02-11T15:22:00Z"
}
```

---

### ChatMessage

A message in the chat interface.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique message ID |
| `role` | `"user" \| "assistant" \| "system"` | Yes | Message sender role |
| `content` | `string` | Yes | Message text content |
| `timestamp` | `string` (ISO 8601) | Yes | When message was sent |
| `reasoning` | `ReasoningStep[]` | No | AI reasoning steps (assistant only) |
| `toolCalls` | `ToolCall[]` | No | MCP tool calls made (assistant only) |
| `changeSummary` | `string` | No | Summary of UI changes (assistant only) |

**ReasoningStep**:
| Field | Type | Description |
|-------|------|-------------|
| `step` | `number` | Step order |
| `text` | `string` | Reasoning explanation |

**ToolCall**:
| Field | Type | Description |
|-------|------|-------------|
| `tool` | `string` | Tool name from MCP |
| `args` | `Record<string, unknown>` | Arguments passed |
| `result` | `unknown` | Tool return value |

---

### ChangeLog

Record of UI modifications for history display.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string` | Yes | Unique change ID |
| `timestamp` | `string` (ISO 8601) | Yes | When change was made |
| `description` | `string` | Yes | Human-readable change description |
| `beforeTree` | `UITree` | Yes | UI state before change |
| `afterTree` | `UITree` | Yes | UI state after change |
| `triggeredBy` | `string` | Yes | Chat message ID that caused this |

## Entity Relationships

```
User (1) ──────────┬────── (1) UIState
                   │
                   └────── (*) Task
                   
UIState (1) ────── (1) UITree
                         │
                         └── (*) UITree (recursive children)

ChatMessage (*) ─────── (0..1) ChangeLog (via triggeredBy)

UIComponent (registry) ←─── UITree.component (lookup)
```

## State Transitions

### Task States
```
[Created] ──(complete)──► [Completed] ──(uncomplete)──► [Created]
     │                          │
     └───────(delete)───────────┴──► [Deleted]
```

### UI Customization Flow
```
[Default State] ──(chat request)──► [Processing] ──(success)──► [Modified State]
       ▲                                   │
       │                                   └──(failure)──► [Error Shown]
       │
       └────────────(reset)────────────────────────────────┘
```

# MCP Component Discovery Contract

**Protocol**: Model Context Protocol (MCP)  
**Transport**: HTTP (SSE for server-to-client, POST for client-to-server)  
**Base Path**: `/api/mcp`

## Overview

The MCP server exposes UI components available for dynamic composition in the Todo application. This enables the Copilot chat interface to discover and use components when modifying the UI.

## Resources

### `components`

List all available UI components for the Todo app.

**URI**: `components://registry`

**Response Schema**:
```typescript
interface ComponentsResource {
  components: UIComponent[];
}

interface UIComponent {
  name: string;           // PascalCase component identifier
  description: string;    // What the component does
  category: 'layout' | 'input' | 'display' | 'todo';
  props: PropDefinition[];
  canHaveChildren: boolean;
}

interface PropDefinition {
  name: string;
  type: string;           // TypeScript type as string
  required: boolean;
  description: string;
  defaultValue?: unknown;
}
```

**Example Response**:
```json
{
  "components": [
    {
      "name": "TaskItem",
      "description": "Displays a single task with completion toggle and delete button",
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
          "name": "onDelete",
          "type": "(id: string) => void",
          "required": true,
          "description": "Callback when task is deleted"
        },
        {
          "name": "showDueDate",
          "type": "boolean",
          "required": false,
          "description": "Whether to display due date field",
          "defaultValue": false
        },
        {
          "name": "showPriority",
          "type": "boolean",
          "required": false,
          "description": "Whether to display priority indicator",
          "defaultValue": false
        }
      ],
      "canHaveChildren": false
    }
  ]
}
```

## Tools

### `modify_ui`

Modify the UI tree for a user by applying changes.

**Parameters**:
```typescript
interface ModifyUIParams {
  userId: string;              // Target user
  operation: 'add' | 'remove' | 'update' | 'replace';
  path: string;                // JSONPath to target location
  component?: UITree;          // For add/replace operations
  props?: Record<string, unknown>;  // For update operations
}
```

**Returns**:
```typescript
interface ModifyUIResult {
  success: boolean;
  newTree: UITree;
  description: string;         // Human-readable change description
}
```

**Example Invocation**:
```json
{
  "tool": "modify_ui",
  "arguments": {
    "userId": "alice",
    "operation": "update",
    "path": "$.children[1]",
    "props": {
      "showPriority": true
    }
  }
}
```

### `get_component_details`

Get detailed information about a specific component.

**Parameters**:
```typescript
interface GetComponentDetailsParams {
  componentName: string;
}
```

**Returns**:
```typescript
interface ComponentDetails extends UIComponent {
  examples: ComponentExample[];
}

interface ComponentExample {
  description: string;
  tree: UITree;
}
```

### `validate_tree`

Validate a UI tree before applying changes.

**Parameters**:
```typescript
interface ValidateTreeParams {
  tree: UITree;
}
```

**Returns**:
```typescript
interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

interface ValidationError {
  path: string;
  message: string;
  suggestion?: string;
}
```

### `get_current_tree`

Get the current UI tree for a user.

**Parameters**:
```typescript
interface GetCurrentTreeParams {
  userId: string;
}
```

**Returns**: `UITree`

## Available Components

### Layout Components

| Component | Description | Children |
|-----------|-------------|----------|
| `Container` | Flex container with configurable direction | Yes |
| `Card` | Bordered card with optional header | Yes |
| `Divider` | Horizontal or vertical divider | No |

### Input Components

| Component | Description | Children |
|-----------|-------------|----------|
| `TextInput` | Single-line text input | No |
| `Checkbox` | Boolean toggle checkbox | No |
| `Select` | Dropdown selection | No |
| `DatePicker` | Date selection input | No |
| `Button` | Clickable button | No |

### Display Components

| Component | Description | Children |
|-----------|-------------|----------|
| `Text` | Text display with styling | No |
| `Badge` | Small status indicator | No |
| `Icon` | Icon display | No |

### Todo Components

| Component | Description | Children |
|-----------|-------------|----------|
| `TodoApp` | Main container for the Todo app | Yes |
| `TaskList` | List container for tasks | Yes |
| `TaskItem` | Individual task display | No |
| `TaskInput` | Input for creating new tasks | No |
| `TaskFilter` | Filter buttons (All/Active/Completed) | No |
| `TaskStats` | Task count statistics | No |

## Error Handling

MCP errors follow the standard MCP error format:

```typescript
interface MCPError {
  code: number;
  message: string;
  data?: {
    suggestion?: string;
  };
}
```

**Error Codes**:
- `-32600`: Invalid request (malformed JSON)
- `-32601`: Method not found
- `-32602`: Invalid params
- `-32000`: Component not found
- `-32001`: Invalid tree structure
- `-32002`: Version conflict

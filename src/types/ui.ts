/**
 * UI types - Component definitions, UI tree structure, and state management
 */

export interface PropDefinition {
  /** Prop name */
  name: string;
  /** TypeScript type as string */
  type: string;
  /** Whether prop is required */
  required: boolean;
  /** What the prop does */
  description: string;
  /** Default if not provided */
  defaultValue?: unknown;
}

export type ComponentCategory = 'layout' | 'input' | 'display' | 'todo';

export interface UIComponent {
  /** Component identifier (PascalCase) */
  name: string;
  /** What the component does */
  description: string;
  /** Grouping category */
  category: ComponentCategory;
  /** Available props with types */
  props: PropDefinition[];
  /** Whether component accepts children */
  canHaveChildren: boolean;
}

export interface ComponentExample {
  description: string;
  tree: UITree;
}

export interface ComponentDetails extends UIComponent {
  examples: ComponentExample[];
}

export interface UITree {
  /** Component name from registry */
  component: string;
  /** Props to pass to component */
  props?: Record<string, unknown>;
  /** Nested child components */
  children?: UITree[];
}

export interface UIState {
  /** State version for optimistic locking */
  version: number;
  /** Owner user ID */
  userId: string;
  /** Current component tree */
  tree: UITree;
  /** Last state change timestamp (ISO 8601) */
  lastModified: string;
}

export interface UpdateUIStateInput {
  userId: string;
  version: number;
  tree: UITree;
}

export interface ComponentsResource {
  components: UIComponent[];
}

export type ModifyUIOperation = 'add' | 'remove' | 'update' | 'replace';

export interface ModifyUIParams {
  /** Target user */
  userId: string;
  /** Operation type */
  operation: ModifyUIOperation;
  /** JSONPath to target location */
  path: string;
  /** For add/replace operations */
  component?: UITree;
  /** For update operations */
  props?: Record<string, unknown>;
}

export interface ModifyUIResult {
  success: boolean;
  newTree: UITree;
  description: string;
}

export interface GetComponentDetailsParams {
  componentName: string;
}

export interface ValidateTreeParams {
  tree: UITree;
}

export interface ValidationError {
  path: string;
  message: string;
  suggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface GetCurrentTreeParams {
  userId: string;
}

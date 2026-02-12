/**
 * MCP Component Registry
 *
 * Registry of all UI components available for dynamic composition.
 * Used by MCP server to expose component discovery to the AI.
 */

import type { UIComponent, PropDefinition, ComponentDetails, UITree } from '@/types';

/**
 * Helper to create a prop definition with defaults
 */
function prop(
  name: string,
  type: string,
  required: boolean,
  description: string,
  defaultValue?: unknown,
): PropDefinition {
  return { name, type, required, description, defaultValue };
}

/**
 * All registered UI components
 */
const componentRegistry: Map<string, ComponentDetails> = new Map();

// =============================================================================
// Layout Components
// =============================================================================

componentRegistry.set('Container', {
  name: 'Container',
  description: 'Flex container with configurable direction and spacing',
  category: 'layout',
  canHaveChildren: true,
  props: [
    prop('direction', "'row' | 'column'", false, 'Flex direction', 'column'),
    prop('gap', 'number', false, 'Gap between children in pixels', 16),
    prop('padding', 'number', false, 'Padding in pixels', 0),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Vertical stack with gap',
      tree: {
        component: 'Container',
        props: { direction: 'column', gap: 16 },
        children: [],
      },
    },
  ],
});

componentRegistry.set('Card', {
  name: 'Card',
  description: 'Bordered card container with optional header',
  category: 'layout',
  canHaveChildren: true,
  props: [
    prop('title', 'string', false, 'Card header title'),
    prop('padding', 'number', false, 'Internal padding', 16),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Card with title',
      tree: {
        component: 'Card',
        props: { title: 'My Tasks', padding: 16 },
        children: [],
      },
    },
  ],
});

componentRegistry.set('Divider', {
  name: 'Divider',
  description: 'Horizontal or vertical divider line',
  category: 'layout',
  canHaveChildren: false,
  props: [
    prop(
      'orientation',
      "'horizontal' | 'vertical'",
      false,
      'Divider direction',
      'horizontal',
    ),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Horizontal divider',
      tree: { component: 'Divider', props: { orientation: 'horizontal' } },
    },
  ],
});

// =============================================================================
// Input Components
// =============================================================================

componentRegistry.set('TextInput', {
  name: 'TextInput',
  description: 'Single-line text input field',
  category: 'input',
  canHaveChildren: false,
  props: [
    prop('value', 'string', false, 'Current input value', ''),
    prop('placeholder', 'string', false, 'Placeholder text'),
    prop('onChange', '(value: string) => void', false, 'Change handler'),
    prop('disabled', 'boolean', false, 'Whether input is disabled', false),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Task input field',
      tree: {
        component: 'TextInput',
        props: { placeholder: 'What needs to be done?' },
      },
    },
  ],
});

componentRegistry.set('Checkbox', {
  name: 'Checkbox',
  description: 'Boolean toggle checkbox with optional label',
  category: 'input',
  canHaveChildren: false,
  props: [
    prop('checked', 'boolean', false, 'Whether checkbox is checked', false),
    prop('label', 'string', false, 'Label text'),
    prop('onChange', '(checked: boolean) => void', false, 'Change handler'),
    prop('disabled', 'boolean', false, 'Whether checkbox is disabled', false),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Task completion checkbox',
      tree: {
        component: 'Checkbox',
        props: { checked: false, label: 'Complete task' },
      },
    },
  ],
});

componentRegistry.set('Select', {
  name: 'Select',
  description: 'Dropdown selection input',
  category: 'input',
  canHaveChildren: false,
  props: [
    prop('value', 'string', false, 'Selected value'),
    prop(
      'options',
      'Array<{value: string, label: string}>',
      true,
      'Available options',
    ),
    prop('onChange', '(value: string) => void', false, 'Change handler'),
    prop('placeholder', 'string', false, 'Placeholder when no selection'),
    prop('disabled', 'boolean', false, 'Whether select is disabled', false),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Priority selector',
      tree: {
        component: 'Select',
        props: {
          placeholder: 'Select priority',
          options: [
            { value: 'low', label: 'Low' },
            { value: 'medium', label: 'Medium' },
            { value: 'high', label: 'High' },
          ],
        },
      },
    },
  ],
});

componentRegistry.set('DatePicker', {
  name: 'DatePicker',
  description: 'Date selection input',
  category: 'input',
  canHaveChildren: false,
  props: [
    prop('value', 'string', false, 'Selected date (ISO format)'),
    prop('onChange', '(date: string) => void', false, 'Change handler'),
    prop('min', 'string', false, 'Minimum selectable date'),
    prop('max', 'string', false, 'Maximum selectable date'),
    prop('disabled', 'boolean', false, 'Whether picker is disabled', false),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Due date picker',
      tree: {
        component: 'DatePicker',
        props: { min: new Date().toISOString().split('T')[0] },
      },
    },
  ],
});

componentRegistry.set('Button', {
  name: 'Button',
  description: 'Clickable button with variants',
  category: 'input',
  canHaveChildren: false,
  props: [
    prop('label', 'string', true, 'Button text'),
    prop('onClick', '() => void', false, 'Click handler'),
    prop(
      'variant',
      "'primary' | 'secondary' | 'danger' | 'ghost'",
      false,
      'Button style variant',
      'primary',
    ),
    prop(
      'size',
      "'sm' | 'md' | 'lg'",
      false,
      'Button size',
      'md',
    ),
    prop('disabled', 'boolean', false, 'Whether button is disabled', false),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Add task button',
      tree: {
        component: 'Button',
        props: { label: 'Add Task', variant: 'primary' },
      },
    },
  ],
});

// =============================================================================
// Display Components
// =============================================================================

componentRegistry.set('Text', {
  name: 'Text',
  description: 'Text display with styling options',
  category: 'display',
  canHaveChildren: false,
  props: [
    prop('content', 'string', true, 'Text content to display'),
    prop(
      'variant',
      "'body' | 'heading' | 'caption' | 'label'",
      false,
      'Text style variant',
      'body',
    ),
    prop('bold', 'boolean', false, 'Whether text is bold', false),
    prop('muted', 'boolean', false, 'Whether text is muted/gray', false),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Section heading',
      tree: {
        component: 'Text',
        props: { content: 'My Tasks', variant: 'heading' },
      },
    },
  ],
});

componentRegistry.set('Badge', {
  name: 'Badge',
  description: 'Small status indicator badge',
  category: 'display',
  canHaveChildren: false,
  props: [
    prop('label', 'string', true, 'Badge text'),
    prop(
      'variant',
      "'default' | 'success' | 'warning' | 'error' | 'info'",
      false,
      'Badge color variant',
      'default',
    ),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'High priority badge',
      tree: {
        component: 'Badge',
        props: { label: 'High', variant: 'error' },
      },
    },
  ],
});

componentRegistry.set('Icon', {
  name: 'Icon',
  description: 'Icon display from icon set',
  category: 'display',
  canHaveChildren: false,
  props: [
    prop(
      'name',
      'string',
      true,
      'Icon name (check, trash, plus, calendar, etc.)',
    ),
    prop('size', 'number', false, 'Icon size in pixels', 20),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Checkmark icon',
      tree: { component: 'Icon', props: { name: 'check', size: 16 } },
    },
  ],
});

// =============================================================================
// Todo Components
// =============================================================================

componentRegistry.set('TodoApp', {
  name: 'TodoApp',
  description: 'Main container for the Todo application',
  category: 'todo',
  canHaveChildren: true,
  props: [
    prop('title', 'string', false, 'App title', 'Todo'),
    prop('showStats', 'boolean', false, 'Whether to show task statistics', false),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Default Todo app',
      tree: {
        component: 'TodoApp',
        props: { title: 'My Tasks' },
        children: [
          { component: 'TaskInput' },
          { component: 'TaskList' },
        ],
      },
    },
  ],
});

componentRegistry.set('TaskList', {
  name: 'TaskList',
  description: 'List container for displaying tasks',
  category: 'todo',
  canHaveChildren: true,
  props: [
    prop(
      'filter',
      "'all' | 'active' | 'completed'",
      false,
      'Task filter',
      'all',
    ),
    prop(
      'sortBy',
      "'createdAt' | 'dueDate' | 'priority'",
      false,
      'Sort order',
      'createdAt',
    ),
    prop('sortOrder', "'asc' | 'desc'", false, 'Sort direction', 'desc'),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Active tasks sorted by due date',
      tree: {
        component: 'TaskList',
        props: { filter: 'active', sortBy: 'dueDate', sortOrder: 'asc' },
      },
    },
  ],
});

componentRegistry.set('TaskItem', {
  name: 'TaskItem',
  description: 'Individual task display with completion toggle and delete',
  category: 'todo',
  canHaveChildren: false,
  props: [
    prop('task', 'Task', true, 'The task data to display'),
    prop('onToggle', '(id: string) => void', true, 'Toggle completion handler'),
    prop('onDelete', '(id: string) => void', true, 'Delete handler'),
    prop('showDueDate', 'boolean', false, 'Show due date field', false),
    prop('showPriority', 'boolean', false, 'Show priority indicator', false),
    prop('showNotes', 'boolean', false, 'Show notes field', false),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Task with priority and due date',
      tree: {
        component: 'TaskItem',
        props: { showDueDate: true, showPriority: true },
      },
    },
  ],
});

componentRegistry.set('TaskInput', {
  name: 'TaskInput',
  description: 'Input component for creating new tasks',
  category: 'todo',
  canHaveChildren: false,
  props: [
    prop('placeholder', 'string', false, 'Input placeholder', 'What needs to be done?'),
    prop('onSubmit', '(title: string) => void', false, 'Submit handler'),
    prop('showPriorityPicker', 'boolean', false, 'Show priority selector', false),
    prop('showDueDatePicker', 'boolean', false, 'Show due date picker', false),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Full-featured task input',
      tree: {
        component: 'TaskInput',
        props: { showPriorityPicker: true, showDueDatePicker: true },
      },
    },
  ],
});

componentRegistry.set('TaskFilter', {
  name: 'TaskFilter',
  description: 'Filter buttons for All/Active/Completed tasks',
  category: 'todo',
  canHaveChildren: false,
  props: [
    prop(
      'current',
      "'all' | 'active' | 'completed'",
      false,
      'Currently active filter',
      'all',
    ),
    prop(
      'onChange',
      "(filter: 'all' | 'active' | 'completed') => void",
      false,
      'Filter change handler',
    ),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Task filter buttons',
      tree: { component: 'TaskFilter', props: { current: 'all' } },
    },
  ],
});

componentRegistry.set('TaskStats', {
  name: 'TaskStats',
  description: 'Task count statistics display',
  category: 'todo',
  canHaveChildren: false,
  props: [
    prop('totalCount', 'number', false, 'Total task count'),
    prop('completedCount', 'number', false, 'Completed task count'),
    prop('activeCount', 'number', false, 'Active task count'),
    prop('className', 'string', false, 'Additional CSS classes'),
  ],
  examples: [
    {
      description: 'Task statistics',
      tree: { component: 'TaskStats' },
    },
  ],
});

// =============================================================================
// Registry API
// =============================================================================

/**
 * Get all registered components
 */
export function getAllComponents(): UIComponent[] {
  return Array.from(componentRegistry.values()).map(
    ({ examples: _examples, ...component }) => component,
  );
}

/**
 * Get component details including examples
 */
export function getComponentDetails(name: string): ComponentDetails | null {
  return componentRegistry.get(name) || null;
}

/**
 * Check if a component exists in the registry
 */
export function hasComponent(name: string): boolean {
  return componentRegistry.has(name);
}

/**
 * Get components by category
 */
export function getComponentsByCategory(
  category: UIComponent['category'],
): UIComponent[] {
  return getAllComponents().filter((c) => c.category === category);
}

/**
 * Validate that a UI tree only uses registered components
 */
export function validateTreeComponents(tree: UITree): string[] {
  const errors: string[] = [];

  function validate(node: UITree, path: string) {
    if (!hasComponent(node.component)) {
      errors.push(`Unknown component "${node.component}" at ${path}`);
    }

    if (node.children) {
      const component = componentRegistry.get(node.component);
      if (component && !component.canHaveChildren) {
        errors.push(
          `Component "${node.component}" at ${path} cannot have children`,
        );
      }

      node.children.forEach((child, index) => {
        validate(child, `${path}.children[${index}]`);
      });
    }
  }

  validate(tree, '$');
  return errors;
}

/**
 * Register a custom component (for extensibility)
 */
export function registerComponent(component: ComponentDetails): void {
  componentRegistry.set(component.name, component);
}

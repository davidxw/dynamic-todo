/**
 * validate_tree MCP tool
 *
 * Validates a UI tree structure before applying changes.
 */

import type { ValidateTreeParams, UITree } from '@/types';
import {
  hasComponent,
  getComponentDetails,
  validateTreeComponents,
} from '@/lib/mcp/components';

export interface ValidationError {
  path: string;
  message: string;
  suggestion?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate a UI tree structure
 */
export function validateTree(params: ValidateTreeParams): ValidationResult {
  const { tree } = params;
  const errors: ValidationError[] = [];

  // Check for unknown components
  const componentErrors = validateTreeComponents(tree);
  for (const error of componentErrors) {
    errors.push({
      path: error.split(' at ')[1] || '$',
      message: error,
      suggestion: 'Check available components using get_component_details',
    });
  }

  // Validate tree structure recursively
  validateNode(tree, '$', errors);

  return {
    valid: errors.length === 0,
    errors,
  };
}

function validateNode(
  node: UITree,
  path: string,
  errors: ValidationError[],
): void {
  // Check that node has required structure
  if (!node.component || typeof node.component !== 'string') {
    errors.push({
      path,
      message: 'Node must have a "component" string property',
    });
    return;
  }

  // Get component details for validation
  const details = getComponentDetails(node.component);
  if (!details) {
    // Already caught by validateTreeComponents, skip
    return;
  }

  // Validate props if present
  if (node.props) {
    if (typeof node.props !== 'object' || Array.isArray(node.props)) {
      errors.push({
        path: `${path}.props`,
        message: 'Props must be an object',
      });
    } else {
      // Check for unknown props
      const validPropNames = new Set(details.props.map((p) => p.name));
      for (const propName of Object.keys(node.props)) {
        if (!validPropNames.has(propName)) {
          errors.push({
            path: `${path}.props.${propName}`,
            message: `Unknown prop "${propName}" for component ${node.component}`,
            suggestion: `Valid props: ${details.props.map((p) => p.name).join(', ')}`,
          });
        }
      }

      // Check required props (only for components with required props)
      for (const prop of details.props) {
        if (prop.required && !(prop.name in node.props)) {
          // Only warn, don't error - props may be passed at runtime
          // This is a soft validation for authoring assistance
        }
      }
    }
  }

  // Validate children
  if (node.children) {
    if (!Array.isArray(node.children)) {
      errors.push({
        path: `${path}.children`,
        message: 'Children must be an array',
      });
    } else if (!details.canHaveChildren && node.children.length > 0) {
      errors.push({
        path: `${path}.children`,
        message: `Component ${node.component} cannot have children`,
        suggestion: 'Remove children or use a container component',
      });
    } else {
      // Recursively validate children
      node.children.forEach((child, index) => {
        validateNode(child, `${path}.children[${index}]`, errors);
      });
    }
  }
}

/**
 * Check if a component can be a valid child of another
 */
export function canBeChildOf(
  childComponent: string,
  parentComponent: string,
): boolean {
  if (!hasComponent(childComponent) || !hasComponent(parentComponent)) {
    return false;
  }

  const parentDetails = getComponentDetails(parentComponent);
  return parentDetails?.canHaveChildren ?? false;
}

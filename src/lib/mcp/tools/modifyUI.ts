/**
 * modify_ui MCP tool
 *
 * Modifies the UI tree by applying add, remove, update, or replace operations.
 */

import type {
  ModifyUIParams,
  ModifyUIResult,
  UITree,
  UIState,
} from '@/types';
import { getUserUIState, saveUserUIState } from '@/lib/storage/userState';
import { hasComponent } from '@/lib/mcp/components';
import { ValidationError, NotFoundError } from '@/lib/errorHandling';

/**
 * Apply a UI modification operation
 */
export async function modifyUI(params: ModifyUIParams): Promise<ModifyUIResult> {
  const { userId, operation, path, component, props } = params;

  // Get current state
  const currentState = await getUserUIState(userId);
  if (!currentState) {
    throw new NotFoundError('User', userId);
  }

  // Clone the tree for modification
  const newTree = JSON.parse(JSON.stringify(currentState.tree)) as UITree;

  // Parse and apply the operation
  let description: string;

  try {
    switch (operation) {
      case 'add':
        if (!component) {
          throw new ValidationError('component is required for add operation');
        }
        description = applyAdd(newTree, path, component);
        break;

      case 'remove':
        description = applyRemove(newTree, path);
        break;

      case 'update':
        if (!props) {
          throw new ValidationError('props is required for update operation');
        }
        description = applyUpdate(newTree, path, props);
        break;

      case 'replace':
        if (!component) {
          throw new ValidationError('component is required for replace operation');
        }
        description = applyReplace(newTree, path, component);
        break;

      default:
        throw new ValidationError(`Unknown operation: ${operation}`);
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new ValidationError(`Failed to apply ${operation}: ${error.message}`);
    }
    throw error;
  }

  // Save the new state
  const newState: UIState = {
    version: currentState.version + 1,
    userId,
    tree: newTree,
    lastModified: new Date().toISOString(),
  };

  await saveUserUIState(userId, newState);

  return {
    success: true,
    newTree,
    description,
  };
}

/**
 * Navigate to a node using JSONPath-like syntax
 * Supports: $.children[0], $.children[1].props, etc.
 */
function navigateToPath(
  tree: UITree,
  path: string,
): { parent: UITree | UITree[]; key: string | number; target: unknown } {
  const parts = path.replace(/^\$\.?/, '').split(/\.|\[|\]/).filter(Boolean);

  let current: unknown = tree;
  let parent: unknown = null;
  let key: string | number = '';

  for (let i = 0; i < parts.length; i++) {
    parent = current;
    key = parts[i];

    // Convert numeric strings to numbers for array access
    if (/^\d+$/.test(key)) {
      key = parseInt(key, 10);
    }

    if (current && typeof current === 'object') {
      current = (current as Record<string, unknown>)[key as string];
    } else {
      throw new Error(`Cannot navigate to path: ${path} (failed at ${parts[i]})`);
    }
  }

  return {
    parent: parent as UITree | UITree[],
    key,
    target: current,
  };
}

/**
 * Navigate to parent for insertion/removal operations
 */
function navigateToParent(
  tree: UITree,
  path: string,
): { parent: UITree; childIndex: number } {
  // Extract parent path and child index
  const match = path.match(/^(.*?)\.?children\[(\d+)\]$/);
  if (!match) {
    throw new Error(`Invalid path for add/remove operation: ${path}`);
  }

  const parentPath = match[1] || '$';
  const childIndex = parseInt(match[2], 10);

  // Navigate to parent
  let parent: UITree;
  if (parentPath === '$' || parentPath === '') {
    parent = tree;
  } else {
    const { target } = navigateToPath(tree, parentPath);
    parent = target as UITree;
  }

  if (!parent || typeof parent !== 'object' || !('component' in parent)) {
    throw new Error(`Parent at ${parentPath} is not a valid UITree node`);
  }

  return { parent, childIndex };
}

function applyAdd(tree: UITree, path: string, component: UITree): string {
  // Validate component exists
  if (!hasComponent(component.component)) {
    throw new Error(`Unknown component: ${component.component}`);
  }

  // Check if path is just $ (add to root children)
  if (path === '$' || path === '$.children') {
    if (!tree.children) {
      tree.children = [];
    }
    tree.children.push(component);
    return `Added ${component.component} to root children`;
  }

  // Handle path like $.children[0] for insertion at specific index
  const { parent, childIndex } = navigateToParent(tree, path);

  if (!parent.children) {
    parent.children = [];
  }

  // Insert at index (or append if index is beyond length)
  parent.children.splice(childIndex, 0, component);
  return `Added ${component.component} at ${path}`;
}

function applyRemove(tree: UITree, path: string): string {
  const { parent, childIndex } = navigateToParent(tree, path);

  if (!parent.children || childIndex >= parent.children.length) {
    throw new Error(`No child at ${path}`);
  }

  const removed = parent.children[childIndex];
  parent.children.splice(childIndex, 1);
  return `Removed ${removed.component} from ${path}`;
}

function applyUpdate(
  tree: UITree,
  path: string,
  props: Record<string, unknown>,
): string {
  // Handle direct node update
  let target: UITree;

  if (path === '$') {
    target = tree;
  } else {
    const { target: found } = navigateToPath(tree, path);
    target = found as UITree;
  }

  if (!target || typeof target !== 'object' || !('component' in target)) {
    throw new Error(`No valid node at ${path}`);
  }

  // Merge props
  if (!target.props) {
    target.props = {};
  }

  const updatedProps = Object.keys(props);
  Object.assign(target.props, props);

  return `Updated ${target.component} props: ${updatedProps.join(', ')}`;
}

function applyReplace(tree: UITree, path: string, component: UITree): string {
  // Validate component exists
  if (!hasComponent(component.component)) {
    throw new Error(`Unknown component: ${component.component}`);
  }

  if (path === '$') {
    // Replace entire tree - copy properties over
    Object.assign(tree, component);
    return `Replaced root with ${component.component}`;
  }

  const { parent, childIndex } = navigateToParent(tree, path);

  if (!parent.children || childIndex >= parent.children.length) {
    throw new Error(`No child at ${path}`);
  }

  const oldComponent = parent.children[childIndex].component;
  parent.children[childIndex] = component;
  return `Replaced ${oldComponent} with ${component.component} at ${path}`;
}

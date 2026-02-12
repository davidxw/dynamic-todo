/**
 * get_component_details MCP tool
 *
 * Gets detailed information about a specific component.
 */

import type { ComponentDetails, GetComponentDetailsParams } from '@/types';
import { getComponentDetails as getDetails } from '@/lib/mcp/components';
import { NotFoundError } from '@/lib/errorHandling';

/**
 * Get detailed information about a component including examples
 */
export function getComponentDetails(
  params: GetComponentDetailsParams,
): ComponentDetails {
  const { componentName } = params;

  const details = getDetails(componentName);
  if (!details) {
    throw new NotFoundError('Component', componentName);
  }

  return details;
}

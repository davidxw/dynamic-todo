/**
 * User Service
 *
 * Service layer for user operations with API access.
 */

import type { User } from '@/types';

/**
 * Fetch all users from the API
 */
export async function fetchUsers(): Promise<User[]> {
  const response = await fetch('/api/users');
  
  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.users;
}

/**
 * Fetch a specific user by ID
 */
export async function fetchUser(userId: string): Promise<User | null> {
  const response = await fetch(`/api/users/${encodeURIComponent(userId)}`);
  
  if (response.status === 404) {
    return null;
  }
  
  if (!response.ok) {
    throw new Error(`Failed to fetch user: ${response.statusText}`);
  }
  
  return response.json();
}

/**
 * User entity - A sample user identity with associated customization state
 */

export interface User {
  /** Unique identifier (slug format) */
  id: string;
  /** Name shown in UI switcher */
  displayName: string;
  /** Whether this is the default/reset state */
  isDefault: boolean;
}

export interface UsersListResponse {
  users: User[];
}

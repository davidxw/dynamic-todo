/**
 * Global error handling and logging utilities
 */

import { MCP_ERROR_CODES } from '@/constants';

/**
 * Application error with additional context
 */
export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;
  public readonly suggestion?: string;

  constructor(
    message: string,
    code: string,
    statusCode: number = 500,
    suggestion?: string
  ) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.suggestion = suggestion;
  }

  toJSON() {
    return {
      message: this.message,
      code: this.code,
      suggestion: this.suggestion,
    };
  }
}

/**
 * Not found error (404)
 */
export class NotFoundError extends AppError {
  constructor(resource: string, id: string) {
    super(
      `${resource} with id '${id}' not found`,
      'NOT_FOUND',
      404,
      `Check that the ${resource.toLowerCase()} exists and the ID is correct`
    );
    this.name = 'NotFoundError';
  }
}

/**
 * Validation error (400)
 */
export class ValidationError extends AppError {
  public readonly field?: string;

  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', 400);
    this.name = 'ValidationError';
    this.field = field;
  }
}

/**
 * Version conflict error (409)
 */
export class VersionConflictError extends AppError {
  constructor(expectedVersion: number, actualVersion: number) {
    super(
      `Version conflict: expected ${expectedVersion}, got ${actualVersion}`,
      'VERSION_CONFLICT',
      409,
      'Refresh the page to get the latest state and try again'
    );
    this.name = 'VersionConflictError';
  }
}

/**
 * MCP error for protocol-level errors
 */
export class MCPError extends Error {
  public readonly code: number;
  public readonly data?: { suggestion?: string };

  constructor(code: number, message: string, suggestion?: string) {
    super(message);
    this.name = 'MCPError';
    this.code = code;
    if (suggestion) {
      this.data = { suggestion };
    }
  }

  static invalidRequest(message: string) {
    return new MCPError(MCP_ERROR_CODES.INVALID_REQUEST, message);
  }

  static methodNotFound(method: string) {
    return new MCPError(
      MCP_ERROR_CODES.METHOD_NOT_FOUND,
      `Method '${method}' not found`
    );
  }

  static invalidParams(message: string) {
    return new MCPError(MCP_ERROR_CODES.INVALID_PARAMS, message);
  }

  static componentNotFound(name: string) {
    return new MCPError(
      MCP_ERROR_CODES.COMPONENT_NOT_FOUND,
      `Component '${name}' not found in registry`
    );
  }

  static invalidTreeStructure(message: string) {
    return new MCPError(MCP_ERROR_CODES.INVALID_TREE_STRUCTURE, message);
  }

  static versionConflict(expected: number, actual: number) {
    return new MCPError(
      MCP_ERROR_CODES.VERSION_CONFLICT,
      `Version conflict: expected ${expected}, got ${actual}`,
      'Refresh to get latest state'
    );
  }

  toJSON() {
    return {
      code: this.code,
      message: this.message,
      data: this.data,
    };
  }
}

/**
 * Logger levels
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Simple logger with level support
 */
export const logger = {
  debug(message: string, ...args: unknown[]) {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },

  info(message: string, ...args: unknown[]) {
    console.info(`[INFO] ${message}`, ...args);
  },

  warn(message: string, ...args: unknown[]) {
    console.warn(`[WARN] ${message}`, ...args);
  },

  error(message: string, error?: unknown, ...args: unknown[]) {
    console.error(`[ERROR] ${message}`, error, ...args);
  },
};

/**
 * Wraps an async function with error logging
 */
export function withErrorLogging<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  context: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await fn(...args);
    } catch (error) {
      logger.error(`Error in ${context}:`, error);
      throw error;
    }
  }) as T;
}

/**
 * Formats an error for API response
 */
export function formatErrorResponse(error: unknown): {
  message: string;
  code: string;
  suggestion?: string;
} {
  if (error instanceof AppError) {
    return error.toJSON();
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      code: 'INTERNAL_ERROR',
    };
  }

  return {
    message: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
  };
}

/**
 * Gets the status code for an error
 */
export function getErrorStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  return 500;
}

/**
 * File-based storage utilities for reading/writing JSON
 */

import { promises as fs } from 'fs';
import path from 'path';

/**
 * Ensures a directory exists, creating it recursively if needed
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    // Directory already exists is fine
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Reads and parses a JSON file
 * @returns Parsed JSON data or null if file doesn't exist
 */
export async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

/**
 * Writes data to a JSON file, creating directories as needed
 */
export async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  const dir = path.dirname(filePath);
  await ensureDir(dir);
  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filePath, content, 'utf-8');
}

/**
 * Checks if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copies a file from source to destination
 */
export async function copyFile(src: string, dest: string): Promise<void> {
  const dir = path.dirname(dest);
  await ensureDir(dir);
  await fs.copyFile(src, dest);
}

/**
 * Copies a directory recursively
 */
export async function copyDir(src: string, dest: string): Promise<void> {
  await ensureDir(dest);
  const entries = await fs.readdir(src, { withFileTypes: true });
  
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      await copyFile(srcPath, destPath);
    }
  }
}

/**
 * Deletes a file if it exists
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error;
    }
  }
}

/**
 * Lists files in a directory
 */
export async function listFiles(dirPath: string): Promise<string[]> {
  try {
    return await fs.readdir(dirPath);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

/**
 * Gets the absolute path to the data directory
 */
export function getDataPath(...segments: string[]): string {
  // In Next.js, process.cwd() returns the project root
  return path.join(process.cwd(), 'data', ...segments);
}

/**
 * Gets the path to a user's data directory
 */
export function getUserDataPath(userId: string, ...segments: string[]): string {
  return getDataPath('users', userId, ...segments);
}

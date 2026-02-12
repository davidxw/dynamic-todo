#!/usr/bin/env node

/**
 * Initialize user directories with default data
 * Run with: npm run init-users
 */

import { initializeUserDirectories } from '../lib/storage/userState';

async function main() {
  console.log('Initializing user directories...');
  
  try {
    await initializeUserDirectories();
    console.log('✓ User directories initialized successfully');
    console.log('  - data/users/default/');
    console.log('  - data/users/alice/');
    console.log('  - data/users/bob/');
  } catch (error) {
    console.error('Failed to initialize user directories:', error);
    process.exit(1);
  }
}

main();

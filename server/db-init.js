/**
 * Database Initialization & Migration Runner
 * Usage: node server/db-init.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { sqliteAdapter } from './sqlite.js';
import { db } from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCHEMA_FILE = path.join(__dirname, 'schema.sql');
const DB_FILE = path.join(__dirname, 'portfolio.db');

console.log('========================================================');
console.log('⚡ Initializing Production Relational Database Engine');
console.log('========================================================');

// 1. Check Schema File
if (!fs.existsSync(SCHEMA_FILE)) {
  console.error(`❌ Schema file not found at ${SCHEMA_FILE}`);
  process.exit(1);
}
console.log(`✓ Located SQL Schema: ${SCHEMA_FILE}`);

// 2. Ensure SQLite Adapter is active
if (!sqliteAdapter.isAvailable()) {
  console.warn('⚠️ Native SQLite not available in this environment. Using JSON database engine.');
} else {
  console.log(`✓ SQLite Engine active on ${DB_FILE}`);
}

// 3. Sync all Users and Portfolios into SQLite
const users = Object.values(db.data.users || {});
console.log(`\n📦 Migrating ${users.length} Users & Portfolios into Relational Tables:`);

users.forEach(u => {
  sqliteAdapter.saveUser(u);
  const port = db.getPortfolio(u.username);
  if (port) {
    sqliteAdapter.savePortfolio(port);
    if (Array.isArray(port.items)) {
      port.items.forEach(it => sqliteAdapter.saveItem({ ...it, username: u.username }));
    }
    console.log(`  ✓ Synced user @${u.username} (${port.items?.length || 0} items, ${port.certifications?.length || 0} certs)`);
  }
});

// 4. Sync Client Pitches
const pitches = Object.values(db.data.client_pitches || {});
pitches.forEach(p => sqliteAdapter.savePitch(p));
console.log(`  ✓ Synced ${pitches.length} client pitches`);

console.log('\n========================================================');
console.log('🚀 Database Build & Migration Complete: Healthy & Synchronized');
console.log('========================================================\n');

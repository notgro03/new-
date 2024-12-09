import Dexie from 'dexie';
import { DB_CONFIG } from './config.js';

// Create database
const db = new Dexie(DB_CONFIG.name);

// Define schema
db.version(DB_CONFIG.version).stores(DB_CONFIG.stores);

export { db };
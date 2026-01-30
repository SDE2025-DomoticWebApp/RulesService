// src/db/database.js
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../../data/rules.db');

const db = new Database(dbPath);

// IMPORTANT: enable foreign key constraints
db.pragma('foreign_keys = ON');

module.exports = db;

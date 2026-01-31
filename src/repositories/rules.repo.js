// src/repositories/rules.repo.js
const db = require('../db/database');

/**
 * Add a rule
 */
function addRule(email, sensorId, operator, threshold, field, active) {
    const stmt = db.prepare(`
        INSERT INTO rules (email, sensor_id, operator, threshold, field, active)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    return stmt.run(email, sensorId, operator, threshold, field, active);
}

/**
 * Get all rules for a sensor
 */
function retrieveRules(sensorId) {
    return db
        .prepare(`
      SELECT * FROM rules
      WHERE sensor_id = ?
    `)
        .all(sensorId);
}

/**
 * Get all rules for a user
 */
function retrieveRulesByEmail(email) {
    return db
        .prepare(`
      SELECT * FROM rules
      WHERE email = ?
    `)
        .all(email);
}

/**
 * Update rule active status
 */
function updateRuleActive(ruleId, email, active) {
    const stmt = db.prepare(`
      UPDATE rules
      SET active = ?
      WHERE id = ? AND email = ?
    `);

    return stmt.run(active, ruleId, email);
}

module.exports = {
    addRule,
    retrieveRules,
    retrieveRulesByEmail,
    updateRuleActive
};

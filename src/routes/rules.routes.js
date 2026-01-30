const express = require('express');
const router = express.Router();
const rulesRepo = require('../repositories/rules.repo');

// POST /rules
router.post('/', async (req, res) => {
    const { email, sensorId, operator, threshold, field, active } = req.body;

    if (!email || !sensorId || !operator || threshold === undefined || !field || active === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (![0, 1].includes(active)) {
        return res.status(400).json({ error: 'Active field must be 0 or 1' });
    }

    const validOperators = ["==", "<", ">", "<=", ">="];
    if (!validOperators.includes(operator)) {
        return res.status(400).json({ error: 'Operator must be one of: ==, <, >, <=, >=' });
    }

    try {
        const result = rulesRepo.addRule(email, sensorId, operator, threshold, field, active);

        // Success: 201 Created
        res.status(201).json({
            message: 'Rule created',
            ruleId: result.lastInsertRowid
        });
    } catch (err) {
        // Handle Constraint violations (e.g. unique constraint)
        if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ error: 'Database constraint violation' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET /rules
router.get('/', async (req, res) => {
    const sensorId = req.sensorId;

    try {
        const result = rulesRepo.retrieveRules(sensorId);
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.log(`[RulesService] Rule retrieval failed: ${error.message}`);
        res.status(statusCode).json({
            error: error.message || 'Internal server error'
        });
    }
});

module.exports = router;

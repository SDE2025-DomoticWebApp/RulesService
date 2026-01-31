const express = require('express');
const router = express.Router();
const rulesRepo = require('../repositories/rules.repo');
const internalDataAdapterClient = require('../clients/internalDataAdapter.client');

// POST /rules
router.post('/', async (req, res) => {
    const { email, sensorId, operator, threshold, field, active } = req.body;

    if (!email || !sensorId || !operator || threshold === undefined || !field || active === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    if (req.user?.email && req.user.email !== email) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    if (![0, 1].includes(active)) {
        return res.status(400).json({ error: 'Active field must be 0 or 1' });
    }

    const validOperators = ["==", "<", ">", "<=", ">="];
    if (!validOperators.includes(operator)) {
        return res.status(400).json({ error: 'Operator must be one of: ==, <, >, <=, >=' });
    }

    try {
        const sensor = await internalDataAdapterClient.getSensorById(sensorId);
        if (!sensor) {
            return res.status(404).json({ error: 'Sensor not found' });
        }

        if (sensor.user_email !== email) {
            return res.status(403).json({ error: 'User does not own sensor' });
        }

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
    const email = req.query.email;
    if (!email) {
        return res.status(400).json({ error: 'email is required' });
    }

    if (req.user?.email && req.user.email !== email) {
        return res.status(403).json({ error: 'Forbidden' });
    }

    try {
        const result = rulesRepo.retrieveRulesByEmail(email);
        res.status(200).json(result);
    } catch (error) {
        const statusCode = error.statusCode || 500;
        console.log(`[RulesService] Rule retrieval failed: ${error.message}`);
        res.status(statusCode).json({
            error: error.message || 'Internal server error'
        });
    }
});

// PATCH /rules/:id/active
router.patch('/:id/active', async (req, res) => {
    const { id } = req.params;
    const { active } = req.body;

    if (!id) {
        return res.status(400).json({ error: 'rule id is required' });
    }

    if (active === undefined) {
        return res.status(400).json({ error: 'active is required' });
    }

    if (![0, 1, true, false, '0', '1'].includes(active)) {
        return res.status(400).json({ error: 'Active field must be 0 or 1' });
    }

    const email = req.user?.email;
    if (!email) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const normalizedActive = active === true || active === '1' ? 1 : 0;

    try {
        const result = rulesRepo.updateRuleActive(id, email, normalizedActive);
        if (!result || result.changes === 0) {
            return res.status(404).json({ error: 'Rule not found' });
        }
        res.status(200).json({
            message: 'Rule updated',
            ruleId: Number(id),
            active: normalizedActive
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

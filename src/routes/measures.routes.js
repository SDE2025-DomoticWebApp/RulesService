const express = require('express');
const router = express.Router();
const rulesRepo = require('../repositories/rules.repo');
const rulesEngine = require('../services/rulesEngine.service');

// POST /measures
router.post('/', async (req, res) => {
    const { sensorId, value, timestamp, isExternal = false } = req.body;

    if (!sensorId || value === undefined) {
        return res.status(400).json({ error: 'sensorId and value are required' });
    }

    if (!value || typeof value !== 'object' || Array.isArray(value)) {
        return res.status(400).json({ error: 'value must be an object' });
    }

    console.log(`[Rules Service] Received measure for sensor ${sensorId}, value ${JSON.stringify(value)}, ts ${timestamp}`);

    try {
        const result = rulesRepo.retrieveRules(sensorId);
        for (const rule of result) {
            if (rule.active && rule.field && !Object.prototype.hasOwnProperty.call(value, rule.field)) {
                return res.status(400).json({ error: `value missing required field "${rule.field}"` });
            }
        }
        if (result.length > 0) {
            rulesEngine.processMeasures(req.body, result);
        }
        res.status(200).json({ nRules: result.length });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(404).json({ error: 'Sensor not found' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const rulesRepo = require('../repositories/rules.repo');
const rulesEngine = require('../services/rulesEngine.service');

// POST /measures
router.post('/', async (req, res) => {
    const { sensorId, value, timestamp } = req.body;

    if (!sensorId || value === undefined || !secret) {
        return res.status(400).json({ error: 'sensorId and value are required' });
    }

    try {
        const result = rulesRepo.retrieveRules(sensorId);
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

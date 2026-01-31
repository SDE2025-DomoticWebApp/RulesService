const notificationClient = require('../clients/notification.client');

class RulesEngineService {
    #operators = {
        '=': (a, b) => a == b,
        '==': (a, b) => a == b,
        '<': (a, b) => a < b,
        '>': (a, b) => a > b,
        '<=': (a, b) => a <= b,
        '>=': (a, b) => a >= b,
    };

    /**
     * Entry point: Loops through all rules associated with the sensor
     */
    async processMeasures(measureInfo, rulesList) {
        if (!Array.isArray(rulesList) || rulesList.length === 0) return;

        console.log(`[RulesEngine] Evaluating ${rulesList.length} rules for ${measureInfo.sensorId}`);

        // Run all evaluations. Using for...of is best for async background tasks
        for (const rule of rulesList) {
            try {
                await this.evaluateSingleRule(measureInfo, rule);
            } catch (err) {
                console.error(`[RulesEngine] Failed on rule ${rule.id}:`, err);
            }
        }
    }

    async evaluateSingleRule(measureInfo, rule) {
        const { sensorId, value } = measureInfo;
        const { email, operator, threshold, field, active } = rule;

        if (!active) return;

        if (!value || typeof value !== 'object' || Array.isArray(value)) return;

        const measuredValue = value[field];
        const operation = this.#operators[operator];

        if (operation && measuredValue !== undefined && operation(measuredValue, threshold)) {
            this.ruleSuccessful({ sensorId, measuredValue, operator, threshold, email });
        }
    }

    ruleSuccessful(notificationData) {
        notificationClient.notify(notificationData);
    }
}

module.exports = new RulesEngineService();

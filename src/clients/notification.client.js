const axios = require('axios');
const config = require('../config/config');

/**
 * Client for communicating with the Notification Service
 */
class NotificationClient {
    constructor(baseURL = config.notificationServiceUrl) {
        this.client = axios.create({
            baseURL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Retrieve measures for a sensor via the Aggregator Service
     * @param {Object} notificationData - User registration data
     * @param {string|number} notificationData.sensorId - Sensor ID
     * @param {number} notificationData.criticalValue - Measure that triggers rule breaking
     * @param {string} notificationData.operator - Rule criteria 
     * @param {number} notificationData.threshold - Rule threshold
     * @param {string} notificationData.email - User's contact
     */
    async notify(notificationData) {
        try {
            const response = await this.client.post(notificationData);
            return response.data;
        } catch (error) {
            if (error.response) {
                const serviceError = new Error(error.response.data?.error || 'Notification forwarding to NotificationService failed');
                serviceError.statusCode = error.response.status;
                throw serviceError;
            }
            throw new Error('Unable to reach notification service');
        }
    }
}

module.exports = new NotificationClient();

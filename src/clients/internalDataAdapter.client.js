const axios = require('axios');
const config = require('../config/config');

/**
 * Client for communicating with the Internal Data Adapter Service
 */
class InternalDataAdapterClient {
    constructor(baseURL = config.internalDataAdapterUrl) {
        this.client = axios.create({
            baseURL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    /**
     * Retrieve sensor by id
     * @param {string|number} sensorId - Sensor ID
     * @returns {Promise<Object>} Sensor data
     */
    async getSensorById(sensorId) {
        try {
            const response = await this.client.get(`/sensors/${sensorId}`);
            return response.data;
        } catch (error) {
            if (error.response) {
                const serviceError = new Error(error.response.data?.error || 'Sensor retrieval failed');
                serviceError.statusCode = error.response.status;
                throw serviceError;
            }
            throw new Error('Unable to reach internal data adapter');
        }
    }
}

module.exports = new InternalDataAdapterClient();

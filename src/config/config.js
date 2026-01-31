require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3012,
    notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3013',
    internalDataAdapterUrl: process.env.INTERNAL_DATA_ADAPTER_URL || 'http://localhost:3001',
    JWT_SECRET: process.env.JWT_SECRET || 'dev-secret'
};

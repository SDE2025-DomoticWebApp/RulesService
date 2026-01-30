require('dotenv').config();

module.exports = {
    port: process.env.PORT || 3012,
    notificationServiceUrl: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3013'
};

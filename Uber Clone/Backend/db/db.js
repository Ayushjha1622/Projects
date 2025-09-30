const mongoose = require('mongoose');

// Initialize global flag for mock data
global.isUsingMockData = false;

function connectToDb() {
    const mongoUri = process.env.DB_CONNECT || 'mongodb://127.0.0.1:27017/uberclone';
    console.log('[DB] ENV DB_CONNECT not set. Falling back to default:', mongoUri);

    mongoose.connect(mongoUri)
        .then(() => {
            console.log('Connected to MongoDB');
            global.isUsingMockData = false;
        })
        .catch((err) => {
            console.error('Error connecting to MongoDB', err);
            console.log('Continuing with mock data for development');
            global.isUsingMockData = true;
        });
}

module.exports = connectToDb;
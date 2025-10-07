const mongoose = require('mongoose');

async function connectToDb() {
    
    const mongoUri = 'mongodb+srv://theavengerboy04_db_user:2DI9SdwltouYTV2P@ubercluster.4snqugz.mongodb.net/?retryWrites=true&w=majority&appName=UberCluster';
    try {
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB:', mongoUri);
        global.isUsingMockData = false;
    } catch (err) {
        console.error('❌ Error connecting to MongoDB:', err.message);
        console.log('⚠️ Switching to mock data mode');
        global.isUsingMockData = true;
        // Continue execution with mock data instead of exiting
    }
}

module.exports = connectToDb;
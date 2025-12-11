const mongoose = require('mongoose');

// Use MongoDB connection
async function connectDB() {
  try {
    // Connect to MongoDB using the URI from environment variables
    const uri = process.env.MONGODB_URI || 'mongodb+srv://theavengerboy04_db_user:2DI9SdwltouYTV2P@ubercluster.4snqugz.mongodb.net/';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000 // Increase timeout to 30 seconds
    });
    console.log('Connected to MongoDB');
    
    // Close the connection when the Node process ends
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      process.exit(0);
    });
    
    return mongoose.connection;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

module.exports = connectDB();
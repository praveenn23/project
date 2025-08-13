const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let connectionString = process.env.MONGODB_URI;
    
    // Check if MongoDB connection string is provided
    if (!connectionString) {
      console.log('🔄 No MongoDB connection string provided, using fallback...');
      console.log('⚠️ Running in development mode without persistent database');
      console.log('💡 Data will not be saved between server restarts');
      return null;
    }

    const conn = await mongoose.connect(connectionString, {
      // Modern MongoDB connection options
      serverSelectionTimeoutMS: 10000, // Wait 10 seconds before giving up
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      maxPoolSize: 10, // Maintain up to 10 socket connections
      bufferCommands: false,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Log database events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('💡 Please check your MONGODB_URI in .env file');
    console.log('🔗 For MongoDB Atlas: Get connection string from atlas.mongodb.com');
    console.log('🔗 For local MongoDB: Install MongoDB and use mongodb://localhost:27017/smart-sarkari-sathi');
    // For development, we can continue without database
    console.log('⚠️ Continuing without database connection for development...');
  }
};

module.exports = connectDB;

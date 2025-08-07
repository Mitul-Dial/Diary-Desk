const mongoose = require("mongoose");

const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/diarydesk";

const connectToMongo = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, 
      socketTimeoutMS: 45000, 
    };


    await mongoose.connect(mongoUri, options);
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
  }
};

// Handle connection events
mongoose.connection.on('connected', () => {
  console.log('Mongoose connected to MongoDB');
});

mongoose.connection.on('disconnected', () => {
  console.log(' MongoDB disconnected - attempting to reconnect...');
  // Auto-reconnect after 5 seconds
  setTimeout(connectToMongo, 5000);
});

mongoose.connection.on('error', (err) => {
  console.error(' MongoDB connection error:', err.message);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    process.exit(1);
  }
});

process.on('SIGTERM', async () => {
  try {
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error closing MongoDB connection:', error);
    process.exit(1);
  }
});

module.exports = connectToMongo;
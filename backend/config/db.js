const mongoose = require('mongoose');

// Use environment variable for MongoDB URI safely.
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
  try {
    if (!MONGO_URI) {
      throw new Error("MONGO_URI is missing from environment variables.");
    }
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error: ', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

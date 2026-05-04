const mongoose = require('mongoose');

// Use environment variable for MongoDB URI, fallback to hardcoded connection for dev.
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://dhruvrakeshjain_db_user:4LuL9O2S0Rz37l92@clusterhackdev0.zb45b98.mongodb.net/taskboard_db?retryWrites=true&w=majority";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB Connected Successfully');
  } catch (error) {
    console.error('MongoDB Connection Error: ', error.message);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;

import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 * Uses MONGO_URI from environment variables with graceful error logging
 */
const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    const errorMsg = 'MONGO_URI is not defined in backend/.env';
    console.error(`[MongoDB Error]: ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    console.log(`[MongoDB Connected]: Host -> ${conn.connection.host} | Database -> ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Connection Error]: ${error.message}`);
    throw error;
  }
};

export default connectDB;

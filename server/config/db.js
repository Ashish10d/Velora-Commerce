import mongoose from 'mongoose';
import dns from 'node:dns';

export const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error('MONGO_URI is missing from server/.env');

    // The local DNS resolver is refusing MongoDB Atlas SRV queries. Use a
    // public resolver only for mongodb+srv connection strings.
    if (process.env.MONGO_URI.startsWith('mongodb+srv://')) {
      dns.setServers([process.env.MONGO_DNS_SERVER || '1.1.1.1']);
    }

    const connection = await mongoose.connect(process.env.MONGO_URI, {
      dbName: process.env.MONGO_DB_NAME || 'velora'
    });
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1);
  }
};

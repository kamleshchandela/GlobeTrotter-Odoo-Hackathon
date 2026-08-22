import mongoose from 'mongoose';
import dns from 'dns';

// Force use of Google DNS to fix 'querySrv ECONNREFUSED' on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // additional setup if needed
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    throw error;

  }
};

export default connectDB;

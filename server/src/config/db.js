import mongoose from 'mongoose';
import dns from 'dns';


try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  
}

/*Connect to MongoDB databas */
export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    
    console.log(`✅ MongoDB Connected Successfully`);

  } catch (error) {
    console.error(`❌ MongoDB Connection Error Details:`);
    console.error(error.message);
  }
};

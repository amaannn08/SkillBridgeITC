import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB() {
  if (process.env.DUMMY_MODE === 'true' || !MONGODB_URI) {
    console.warn('⚠️ Running in DUMMY MODE — No MongoDB connection');
    return null;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    }).catch(err => {
      console.error('❌ MongoDB Connection Error:', err.message);
      console.warn('⚠️ Falling back to DUMMY MODE');
      return null;
    }) as Promise<typeof mongoose | null>;
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;

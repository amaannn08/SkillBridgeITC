import mongoose from 'mongoose';

/** Empty until you set `MONGODB_URI` in the host (e.g. Vercel env). Build can succeed without it; DB routes need the real URI at runtime. */
const MONGODB_URI = process.env.MONGODB_URI ?? '';

interface MongooseCache {
  conn: typeof mongoose | null;
  /** Resolves to mongoose on success, or `null` if connect failed (see `.catch` below). */
  promise: Promise<typeof mongoose | null> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<typeof mongoose | null> {
  if (process.env.DUMMY_MODE === 'true' || !MONGODB_URI) {
    console.warn('⚠️ No MongoDB URI — running without DB (set MONGODB_URI for production)');
    return null;
  }

  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false }).catch((err) => {
      console.error('❌ MongoDB Connection Error:', err instanceof Error ? err.message : err);
      console.warn('⚠️ Connection failed — requests using the DB will error until MONGODB_URI is valid');
      return null;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;

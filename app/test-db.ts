import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
mongoose.connect(process.env.MONGODB_URI!).then(() => {
  console.log("SUCCESS");
  process.exit(0);
}).catch(e => {
  console.log("FAILED", e.message);
  process.exit(1);
});

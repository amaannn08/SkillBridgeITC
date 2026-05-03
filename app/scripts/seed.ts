/**
 * Seed Super Admin: `npm run seed`
 * Requires MONGODB_URI and ADMIN_EMAIL (optional default below).
 */
import connectDB from '../src/lib/db';
import { User } from '../src/models/User';

async function main() {
  await connectDB();
  const email = (process.env.ADMIN_EMAIL || 'admin@skillbridge.gov.in').toLowerCase();

  const doc = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        email,
        name: 'Platform Administrator',
        role: 'super_admin',
        approvalStatus: 'approved',
      },
    },
    { upsert: true, new: true }
  );

  console.log('Seed OK — Super Admin:', doc.email);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });

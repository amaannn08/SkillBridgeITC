import mongoose from 'mongoose';
import connectDB from '../src/lib/db';
import { User } from '../src/models/User';
import { Company } from '../src/models/Company';
import { Institution } from '../src/models/Institution';

async function main() {
  await connectDB();

  // 1. Seed Company
  const company = await Company.findOneAndUpdate(
    { emailDomain: 'test.com' },
    {
      $set: {
        name: 'Demo Company Ltd',
        emailDomain: 'test.com',
        sector: 'Information Technology',
        cin: 'L12345MH2024PTC123456',
        gstNumber: '27AABCU9603R1Z2',
        verifiedAt: new Date(),
      }
    },
    { upsert: true, returnDocument: 'after' }
  );

  // 2. Seed Institution
  const institution = await Institution.findOneAndUpdate(
    { aicteCode: 'TEST1234' },
    {
      $set: {
        name: 'Demo Polytechnic Institute',
        type: 'Polytechnic',
        aicteCode: 'TEST1234',
        state: 'Telangana',
        district: 'Hyderabad',
        website: 'https://test.com',
      }
    },
    { upsert: true, returnDocument: 'after' }
  );

  // 3. Seed Users
  const users = [
    {
      email: 'admin@test.com',
      name: 'Super Admin',
      role: 'super_admin',
      approvalStatus: 'approved',
    },
    {
      email: 'req@test.com',
      name: 'Demo Recruiter',
      role: 'recruiter',
      companyId: company?._id,
      approvalStatus: 'approved',
    },
    {
      email: 'coord@test.com',
      name: 'Demo Coordinator',
      role: 'coordinator',
      institutionId: institution?._id,
      approvalStatus: 'approved',
    }
  ];

  for (const u of users) {
    await User.findOneAndUpdate(
      { email: u.email },
      { $set: u },
      { upsert: true, returnDocument: 'after' }
    );
  }

  console.log('✅ Demo Seed Complete:');
  console.log('   Admin:       ', users[0].email);
  console.log('   Recruiter:   ', users[1].email);
  console.log('   Coordinator: ', users[2].email);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error('❌ Seed Error:', e);
    process.exit(1);
  });

import connectDB from '@/lib/db';
import { User } from '@/models/User';
import { Notification } from '@/models/Notification';

export async function notifySuperAdmins(params: {
  type: string;
  message: string;
  link?: string;
}) {
  await connectDB();
  const admins = await User.find({ role: 'super_admin', approvalStatus: 'approved' });
  if (admins.length === 0) return;
  await Notification.insertMany(
    admins.map((a) => ({
      userId: a._id,
      type: params.type,
      message: params.message,
      link: params.link,
      read: false,
    }))
  );
}

export async function notifyUser(userId: string, params: { type: string; message: string; link?: string }) {
  await connectDB();
  await Notification.create({
    userId,
    type: params.type,
    message: params.message,
    link: params.link,
    read: false,
  });
}

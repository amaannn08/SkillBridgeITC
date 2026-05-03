import mongoose, { Schema, Document, model, models } from 'mongoose';

export type UserRole = 'super_admin' | 'coordinator' | 'recruiter';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface IUser extends Document {
  googleId?: string;
  email: string;
  name: string;
  profileImage?: string;
  role: UserRole;
  approvalStatus: ApprovalStatus;
  institutionId?: mongoose.Types.ObjectId;
  companyId?: mongoose.Types.ObjectId;
  phone?: string;
  designation?: string;
  /** Coordinator's college state (Indian state name) */
  state?: string;
  password?: string;
  lastLoginAt?: Date;
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    googleId: { type: String, unique: true, sparse: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    profileImage: { type: String },
    role: {
      type: String,
      enum: ['super_admin', 'coordinator', 'recruiter'],
      required: true,
    },
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    phone: { type: String, trim: true },
    designation: { type: String, trim: true },
    state: { type: String, trim: true },
    password: { type: String, select: false },
    lastLoginAt: { type: Date },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date },
    rejectionReason: { type: String },
  },
  { timestamps: true, strict: true }
);

UserSchema.index({ role: 1, approvalStatus: 1 });

export const User = models.User || model<IUser>('User', UserSchema);

import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface IAdminAuditLog extends Document {
  adminId: mongoose.Types.ObjectId;
  action: string;
  targetUserId?: mongoose.Types.ObjectId;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

const AdminAuditLogSchema = new Schema<IAdminAuditLog>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    action: { type: String, required: true },
    targetUserId: { type: Schema.Types.ObjectId, ref: 'User' },
    meta: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  },
  { strict: true }
);

AdminAuditLogSchema.index({ adminId: 1, createdAt: -1 });

export const AdminAuditLog =
  models.AdminAuditLog || model<IAdminAuditLog>('AdminAuditLog', AdminAuditLogSchema);

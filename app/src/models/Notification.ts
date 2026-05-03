import mongoose, { Schema, Document, model, models } from 'mongoose';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String },
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { strict: true }
);

NotificationSchema.index({ userId: 1, read: 1, createdAt: -1 });

export const Notification =
  models.Notification || model<INotification>('Notification', NotificationSchema);

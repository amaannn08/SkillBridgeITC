import mongoose, { Schema, Document, model, models } from 'mongoose';

export type InstitutionType = 'ITI' | 'Polytechnic' | 'Engineering College' | 'University' | 'Other';

export interface IInstitution extends Document {
  name: string;
  type: InstitutionType;
  aicteCode: string;
  state: string;
  district: string;
  address?: string;
  website?: string;
  coordinatorId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const InstitutionSchema = new Schema<IInstitution>(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['ITI', 'Polytechnic', 'Engineering College', 'University', 'Other'],
      required: true,
    },
    aicteCode: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    address: { type: String },
    website: { type: String },
    coordinatorId: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true, strict: true }
);

InstitutionSchema.index({ state: 1, district: 1 });

export const Institution =
  models.Institution || model<IInstitution>('Institution', InstitutionSchema);

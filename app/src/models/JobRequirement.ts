import mongoose, { Schema, Document, model, models } from 'mongoose';

export type GeographyScope = 'state' | 'pan_india';
export type JobRequirementStatus = 'draft' | 'open' | 'closed' | 'filled';
export type ExperienceLevel = 'fresher' | '0-2yr' | '2-5yr';

export interface ISlot {
  qualification: string;
  branch: string;
  seats: number;
  filledSeats: number;
}

export interface IJobRequirement extends Document {
  companyId: mongoose.Types.ObjectId;
  postedBy: mongoose.Types.ObjectId;
  title: string;
  description: string;
  location: string;
  state: string;
  geographyScope: GeographyScope;
  slots: ISlot[];
  salaryMin?: number;
  salaryMax?: number;
  applicationDeadline: Date;
  status: JobRequirementStatus;
  sector: string;
  skills: string[];
  experienceLevel: ExperienceLevel;
  closedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SlotSchema = new Schema<ISlot>(
  {
    qualification: { type: String, required: true },
    branch: { type: String, default: '' },
    seats: { type: Number, required: true, min: 0 },
    filledSeats: { type: Number, default: 0, min: 0 },
  },
  { _id: false }
);

const JobRequirementSchema = new Schema<IJobRequirement>(
  {
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    state: { type: String, required: true },
    geographyScope: {
      type: String,
      enum: ['state', 'pan_india'],
      required: true,
    },
    slots: { type: [SlotSchema], required: true },
    salaryMin: { type: Number },
    salaryMax: { type: Number },
    applicationDeadline: { type: Date, required: true },
    status: {
      type: String,
      enum: ['draft', 'open', 'closed', 'filled'],
      default: 'draft',
    },
    sector: { type: String, required: true },
    skills: [{ type: String }],
    experienceLevel: {
      type: String,
      enum: ['fresher', '0-2yr', '2-5yr'],
      default: 'fresher',
    },
    closedAt: { type: Date },
  },
  { timestamps: true, strict: true }
);

JobRequirementSchema.index({ status: 1, state: 1 });
JobRequirementSchema.index({ companyId: 1, status: 1 });

export const JobRequirement =
  models.JobRequirement || model<IJobRequirement>('JobRequirement', JobRequirementSchema);

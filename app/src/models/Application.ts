import mongoose, { Schema, Document, model, models } from 'mongoose';

export type ApplicationOverallStatus =
  | 'submitted'
  | 'under_review'
  | 'shortlisting'
  | 'closed';

export type StudentPipelineStatus =
  | 'applied'
  | 'shortlisted'
  | 'rejected'
  | 'selected'
  | 'on_hold';

export interface IStudentStatus {
  studentId: mongoose.Types.ObjectId;
  status: StudentPipelineStatus;
  recruiterNote?: string;
  updatedAt: Date;
}

export interface IApplication extends Document {
  jobRequirementId: mongoose.Types.ObjectId;
  talentPoolBatchId: mongoose.Types.ObjectId;
  coordinatorId: mongoose.Types.ObjectId;
  companyId: mongoose.Types.ObjectId;
  status: ApplicationOverallStatus;
  coverNote?: string;
  studentStatuses: IStudentStatus[];
  submittedAt: Date;
  lastUpdatedBy?: mongoose.Types.ObjectId;
  resumeZipUrl?: string;
  resumeZipExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const StudentStatusSchema = new Schema<IStudentStatus>(
  {
    studentId: { type: Schema.Types.ObjectId, required: true },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'selected', 'on_hold'],
      default: 'applied',
    },
    recruiterNote: { type: String },
    updatedAt: { type: Date, default: Date.now },
  },
  { _id: false, strict: true }
);

const ApplicationSchema = new Schema<IApplication>(
  {
    jobRequirementId: {
      type: Schema.Types.ObjectId,
      ref: 'JobRequirement',
      required: true,
    },
    talentPoolBatchId: {
      type: Schema.Types.ObjectId,
      ref: 'TalentPoolBatch',
      required: true,
    },
    coordinatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'shortlisting', 'closed'],
      default: 'submitted',
    },
    coverNote: { type: String },
    studentStatuses: [StudentStatusSchema],
    submittedAt: { type: Date, default: Date.now },
    lastUpdatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    resumeZipUrl: { type: String },
    resumeZipExpiresAt: { type: Date },
  },
  { timestamps: true, strict: true }
);

ApplicationSchema.index(
  { jobRequirementId: 1, talentPoolBatchId: 1 },
  { unique: true }
);
ApplicationSchema.index({ coordinatorId: 1 });
ApplicationSchema.index({ companyId: 1 });

export const Application =
  models.Application || model<IApplication>('Application', ApplicationSchema);

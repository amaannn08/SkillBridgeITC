import mongoose, { Schema, Document, model, models } from 'mongoose';

export type BatchStatus = 'draft' | 'active' | 'archived';

export interface IEmbeddedStudent {
  _id: mongoose.Types.ObjectId;
  name: string;
  rollNumber: string;
  dob?: Date;
  gender?: 'Male' | 'Female' | 'Other';
  cgpa?: number;
  skills: string[];
  resumeUrl?: string;
  resumeOriginalName?: string;
  phone?: string;
  email?: string;
  address?: string;
  languagesKnown: string[];
  certifications: string[];
}

export interface ITalentPoolBatch extends Document {
  institutionId: mongoose.Types.ObjectId;
  coordinatorId: mongoose.Types.ObjectId;
  name: string;
  qualification: string;
  branch: string;
  passingYear: number;
  totalStudents: number;
  students: IEmbeddedStudent[];
  status: BatchStatus;
  createdAt: Date;
  updatedAt: Date;
}

const EmbeddedStudentSchema = new Schema<IEmbeddedStudent>(
  {
    name: { type: String, required: true, trim: true },
    rollNumber: { type: String, required: true, trim: true },
    dob: { type: Date },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    cgpa: { type: Number },
    skills: [{ type: String }],
    resumeUrl: { type: String },
    resumeOriginalName: { type: String },
    phone: { type: String },
    email: { type: String },
    address: { type: String },
    languagesKnown: [{ type: String }],
    certifications: [{ type: String }],
  },
  { _id: true, strict: true }
);

const TalentPoolBatchSchema = new Schema<ITalentPoolBatch>(
  {
    institutionId: { type: Schema.Types.ObjectId, ref: 'Institution', required: true },
    coordinatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    qualification: { type: String, required: true },
    branch: { type: String, required: true, trim: true },
    passingYear: { type: Number, required: true },
    totalStudents: { type: Number, default: 0 },
    students: [EmbeddedStudentSchema],
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
    },
  },
  { timestamps: true, strict: true }
);

TalentPoolBatchSchema.pre('save', function () {
  this.totalStudents = this.students?.length ?? 0;
});

TalentPoolBatchSchema.index({ coordinatorId: 1, status: 1 });
TalentPoolBatchSchema.index({ institutionId: 1 });

export const TalentPoolBatch =
  models.TalentPoolBatch ||
  model<ITalentPoolBatch>('TalentPoolBatch', TalentPoolBatchSchema);

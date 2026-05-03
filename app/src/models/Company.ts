import { Schema, Document, model, models } from 'mongoose';

export interface ICompany extends Document {
  name: string;
  emailDomain: string;
  website?: string;
  sector?: string;
  address?: string;
  cin?: string;
  gstNumber?: string;
  verifiedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const CompanySchema = new Schema<ICompany>(
  {
    name: { type: String, required: true, trim: true },
    emailDomain: { type: String, required: true, lowercase: true, trim: true },
    website: { type: String },
    sector: { type: String },
    address: { type: String },
    cin: { type: String },
    gstNumber: { type: String },
    verifiedAt: { type: Date },
  },
  { timestamps: true, strict: true }
);

CompanySchema.index({ emailDomain: 1 }, { unique: true });

export const Company = models.Company || model<ICompany>('Company', CompanySchema);


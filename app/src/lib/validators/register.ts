import { z } from 'zod';
import { INDIAN_STATES_AND_UTS } from '@/lib/constants/states';
import { INDUSTRY_SECTORS } from '@/lib/constants/sectors';

const isState = (s: string) => (INDIAN_STATES_AND_UTS as readonly string[]).includes(s);
const isSector = (s: string) => (INDUSTRY_SECTORS as readonly string[]).includes(s);

export const coordinatorRegisterSchema = z.object({
  role: z.literal('coordinator'),
  fullName: z.string().min(1),
  designation: z.string().min(1),
  institutionName: z.string().min(1),
  institutionType: z.enum(['ITI', 'Polytechnic', 'Engineering College', 'University', 'Other']),
  state: z.string().refine(isState, 'Invalid state'),
  district: z.string().min(1),
  aicteCode: z.string().min(1),
  phone: z.string().min(5),
});

export const recruiterRegisterSchema = z.object({
  role: z.literal('recruiter'),
  fullName: z.string().min(1),
  designation: z.string().min(1),
  companyName: z.string().min(1),
  companyEmailDomain: z.string().min(1),
  companyWebsite: z.string().url().optional().or(z.literal('')),
  sector: z.string().refine(isSector, 'Invalid sector'),
  phone: z.string().min(5),
});

export const registerBodySchema = z.discriminatedUnion('role', [
  coordinatorRegisterSchema,
  recruiterRegisterSchema,
]);

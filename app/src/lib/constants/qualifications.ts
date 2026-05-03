export const QUALIFICATION_LEVELS = [
  'ITI',
  'Diploma',
  'B.Tech',
  'M.Tech',
  'B.Sc',
  'MBA',
  'Other',
] as const;

export type QualificationLevel = (typeof QUALIFICATION_LEVELS)[number];

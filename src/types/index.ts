export type Plan = 'FREE' | 'STARTER' | 'GROWTH' | 'SCALE';
export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'MANAGER' | 'VIEWER';

export type RecruitingSource = 'INDEED' | 'REFERRAL' | 'WEBSITE' | 'FACEBOOK' | 'INSTAGRAM' | 'OTHER';
export type Business = 'VEXON' | 'EASYSCALE' | 'TELENZA' | 'SOLV_GLOBAL' | 'CTC_COURTS';
export type RepRole = 'SETTER' | 'HYBRID_REP' | 'FULL_CYCLE_CLOSER' | 'SALES_MANAGER';
export type TrainingResult = 'PASS' | 'FAIL';
export type RepTier = 'A_PLAYER' | 'B_PLAYER' | 'C_PLAYER';
export type RemovalReason = 'INACTIVE' | 'NO_ACTIVITY' | 'POOR_PERFORMANCE' | 'COMMUNICATION_ISSUES' | 'VOLUNTARY_DEPARTURE' | 'OTHER';

export type ApplicantStatus =
  | 'APPLIED' | 'CONTACTED' | 'INTERVIEW_SCHEDULED' | 'INTERVIEW_COMPLETED'
  | 'HIRED' | 'TRAINING_1_SCHEDULED' | 'TRAINING_1_COMPLETE'
  | 'TRAINING_2_SCHEDULED' | 'TRAINING_2_COMPLETE'
  | 'TRAINING_3_SCHEDULED' | 'TRAINING_3_COMPLETE'
  | 'ACTIVE_REP' | 'INACTIVE' | 'FIRED';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: Plan;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  organization?: Organization;
  isActive: boolean;
  createdAt: string;
}

export interface Interview {
  id: string;
  applicantId: string;
  interviewDate?: string;
  notes?: string;
  score?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Training {
  id: string;
  applicantId: string;
  trainingNumber: number;
  scheduledDate?: string;
  completedDate?: string;
  result?: TrainingResult;
  createdAt: string;
  updatedAt: string;
}

export interface RepScore {
  id: string;
  repId: string;
  workEthic: number;
  coachability: number;
  communication: number;
  consistency: number;
  overallRating: number;
  tier: RepTier;
  scoredAt: string;
}

export interface PerformanceEntry {
  id: string;
  repId: string;
  weekOf: string;
  callsThisWeek: number;
  meetingsBooked: number;
  revenueThisMonth: number;
  createdAt: string;
}

export interface RemovalLog {
  id: string;
  applicantId: string;
  dateRemoved: string;
  reason: RemovalReason;
  notes?: string;
}

export interface ActiveRep {
  id: string;
  applicantId: string;
  hireDate: string;
  managerId?: string;
  isActive: boolean;
  applicant: Applicant;
  manager?: User;
  scores: RepScore[];
  performance: PerformanceEntry[];
  removalLog?: RemovalLog;
}

export interface Applicant {
  id: string;
  organizationId: string;
  fullName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  dateApplied: string;
  recruitingSource: RecruitingSource;
  business: Business;
  role: RepRole;
  status: ApplicantStatus;
  interview?: Interview;
  trainings?: Training[];
  activeRep?: ActiveRep;
  removalLog?: RemovalLog;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardMetrics {
  totalApplicants: number;
  interviewsScheduled: number;
  interviewsCompleted: number;
  hiredThisMonth: number;
  activeReps: number;
  inactiveReps: number;
  firedReps: number;
}

export interface FunnelStage {
  stage: string;
  count: number;
}

export interface BusinessCount {
  business: Business;
  label: string;
  count: number;
}

export interface CalendarEvent {
  id: string;
  type: 'interview' | 'training_1' | 'training_2' | 'training_3';
  title: string;
  date: string;
  business: Business;
  role?: RepRole;
  applicantId: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Label helpers
export const BUSINESS_LABELS: Record<Business, string> = {
  VEXON: 'Vexon',
  EASYSCALE: 'EasyScale',
  TELENZA: 'Telenza',
  SOLV_GLOBAL: 'Solv Global',
  CTC_COURTS: 'CTC Courts',
};

export const ROLE_LABELS: Record<RepRole, string> = {
  SETTER: 'Setter',
  HYBRID_REP: 'Hybrid Rep',
  FULL_CYCLE_CLOSER: 'Full Cycle Closer',
  SALES_MANAGER: 'Sales Manager',
};

export const SOURCE_LABELS: Record<RecruitingSource, string> = {
  INDEED: 'Indeed',
  REFERRAL: 'Referral',
  WEBSITE: 'Website',
  FACEBOOK: 'Facebook',
  INSTAGRAM: 'Instagram',
  OTHER: 'Other',
};

export const STATUS_LABELS: Record<ApplicantStatus, string> = {
  APPLIED: 'Applied',
  CONTACTED: 'Contacted',
  INTERVIEW_SCHEDULED: 'Interview Scheduled',
  INTERVIEW_COMPLETED: 'Interview Completed',
  HIRED: 'Hired',
  TRAINING_1_SCHEDULED: 'Training 1 Scheduled',
  TRAINING_1_COMPLETE: 'Training 1 Complete',
  TRAINING_2_SCHEDULED: 'Training 2 Scheduled',
  TRAINING_2_COMPLETE: 'Training 2 Complete',
  TRAINING_3_SCHEDULED: 'Training 3 Scheduled',
  TRAINING_3_COMPLETE: 'Training 3 Complete',
  ACTIVE_REP: 'Active Rep',
  INACTIVE: 'Inactive',
  FIRED: 'Fired',
};

export const TIER_LABELS: Record<RepTier, string> = {
  A_PLAYER: 'A Player',
  B_PLAYER: 'B Player',
  C_PLAYER: 'C Player',
};

export const REMOVAL_REASON_LABELS: Record<RemovalReason, string> = {
  INACTIVE: 'Inactive',
  NO_ACTIVITY: 'No Activity',
  POOR_PERFORMANCE: 'Poor Performance',
  COMMUNICATION_ISSUES: 'Communication Issues',
  VOLUNTARY_DEPARTURE: 'Voluntary Departure',
  OTHER: 'Other',
};

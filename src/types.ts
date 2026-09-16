export interface EventProfile {
  id: string;
  name: string;
  brandPositioning: string;
  targetAudience: string;
  eventPurpose: string;
  preferredGuestProfile: string;
  collaborationGoals: string;
  date: string;
  location: string;
  maxCapacity: number;
}

export type MatchCategory = 'High Match' | 'Review Further' | 'Low Match';

export type HumanDecision =
  | 'confirmed_invited'
  | 'waitlist'
  | 'further_discussion'
  | 'declined'
  | 'pending';

export interface PreviousParticipationData {
  attendanceCount: number;
  pastEvents: string[];
  attendanceRate: number; // e.g. 100
  engagementNotes: string;
}

export interface PublicProfileData {
  platform: string;
  handle: string;
  url: string;
  reach: string;
  verified: boolean;
}

export interface RegistrationMeta {
  submittedAt: string;
  sourceChannel: string;
  ipDuplicateFlag: boolean;
  registrationPatternNote?: string;
}

export interface GuestAnalysis {
  eventFitScore: number;
  eventFitRationale: string;
  professionalRelevanceScore: number;
  professionalRelevanceRationale: string;
  participationPurposeScore: number;
  participationPurposeRationale: string;
  industryRelevanceScore: number;
  industryRelevanceRationale: string;
  collaborationPotentialScore: number;
  collaborationPotentialRationale: string;
  profileConsistencyScore: number;
  profileConsistencyRationale: string;
  previousParticipationSignals: {
    status: 'positive' | 'neutral' | 'caution';
    summary: string;
  };
  duplicateOrAbnormalSignals: {
    detected: boolean;
    level: 'none' | 'low' | 'moderate';
    details: string;
  };
  overallMatchScore: number;
  recommendation: MatchCategory;
  recommendationReason: string;
  huangTeacherConsultantAdvice: string;
}

export interface GuestApplication {
  id: string;
  name: string;
  avatar: string;
  company: string;
  title: string;
  industry: string;
  professionalBackground: string;
  reasonForAttending: string;
  previousParticipation: PreviousParticipationData;
  publicProfile: PublicProfileData;
  potentialCollaborationValue: string;
  registrationMeta: RegistrationMeta;
  analysis: GuestAnalysis;
  humanDecision: HumanDecision;
  humanNotes: string;
  isAiAnalyzing?: boolean;
}

export interface EventRosterStats {
  totalApplicants: number;
  highMatchCount: number;
  reviewFurtherCount: number;
  lowMatchCount: number;
  confirmedInvitedCount: number;
  waitlistCount: number;
  pendingReviewCount: number;
  capacity: number;
}

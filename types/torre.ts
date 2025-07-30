export interface TorreLocation {
  name?: string;
  shortName?: string;
  country?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  placeId?: string;
}

export interface TorreLink {
  id: string;
  name: string;
  address: string;
}

export interface TorreOrganization {
  id: number;
  name: string;
  publicId?: string;
  picture?: string;
  theme?: string;
  serviceType?: string;
}

export interface TorrePersonFlags {
  accessCohort: boolean;
  benefits: boolean;
  canary: boolean;
  fake: boolean;
  verified?: boolean;
  onBoarded: boolean;
  remoter: boolean;
  boosted: boolean;
  genomeIndexed: boolean;
  [key: string]: boolean | undefined;
}

export interface TorreCompletionStage {
  stage: number;
  progress: number;
}

export interface TorrePerson {
  professionalHeadline?: string;
  completion: number;
  showPhone: boolean;
  created: string;
  verified: boolean;
  flags: TorrePersonFlags;
  weight: number;
  ggId: string;
  completionStage: TorreCompletionStage;
  locale: string;
  subjectId: number;
  picture?: string;
  pictureThumbnail?: string;
  hasEmail: boolean;
  isTest: boolean;
  name: string;
  links: TorreLink[];
  location?: TorreLocation;
  theme: string;
  id: string;
  claimant: boolean;
  summaryOfBio?: string;
  publicId: string;
}

export interface TorreSkill {
  id: string;
  code: number;
  name: string;
  proficiency: string; // "novice" | "beginner" | "competent" | "proficient" | "expert"
  implicitProficiency: boolean;
  weight: number;
  recommendations: number;
  media: any[];
  supra: boolean;
  created: string;
  hits: number;
  relatedExperiences: any[];
  pin: boolean;
}

export interface TorreLanguage {
  language: string;
  proficiency: string; // Same as skills
  fluency?: string;
}

export interface TorreExperience {
  id: string;
  category: "jobs" | "education" | "projects" | "awards" | "publications";
  name: string;
  organizations: TorreOrganization[];
  responsibilities: string[];
  fromMonth?: string;
  fromYear?: string;
  toMonth?: string;
  toYear?: string;
  additionalInfo?: string;
  highlighted: boolean;
  weight: number;
  verifications: number;
  recommendations: number;
  media: any[];
  rank: number;
  strengths: TorreSkill[];
  skills?: Array<{
    name: string;
    proficiency?: string;
  }>;
}

export interface TorreStats {
  jobs?: number;
  education?: number;
  awards?: number;
  strengths?: number;
  projects?: number;
  publications?: number;
  opportunities?: number;
  views?: number;
}

export interface TorreInterest {
  name: string;
  proficiency?: string;
}

export interface TorreOpportunity {
  id: string;
  objective: string;
  type: string;
  locations: TorreLocation[];
  remote: boolean;
  compensation?: {
    amount: number;
    currency: string;
    periodicity: string;
  };
}

export interface TorrePreferences {
  [key: string]: any;
}

export interface TorreGenomeResponse {
  person: TorrePerson;
  stats: TorreStats;
  strengths: TorreSkill[];
  experiences: TorreExperience[];
  jobs: TorreExperience[];
  education: TorreExperience[];
  projects: TorreExperience[];
  publications: TorreExperience[];
  awards: TorreExperience[];
  languages: TorreLanguage[];
  interests: TorreInterest[];
  opportunities: TorreOpportunity[];
  preferences: TorrePreferences;
}


export interface ProcessedSkill {
  name: string;
  proficiency: number;
  percentile: number;
  source: 'strengths' | 'experiences' | 'languages';
  code?: number;
  recommendations?: number;
}

export interface ProcessedLocation {
  name: string;
  country?: string;
  countryCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  timezone?: string;
}

export interface ProcessedLink {
  id: string;
  name: string;
  url: string;
  icon?: string;
  verified?: boolean;
}

export interface ProcessedOrganization {
  id: number;
  name: string;
  logo?: string;
  website?: string;
  publicId?: string;
}

export interface ProcessedExperience {
  id: string;
  type: 'job' | 'education' | 'project' | 'award' | 'publication';
  title: string;
  organization?: ProcessedOrganization;
  description?: string;
  responsibilities: string[];
  startDate?: {
    month?: string;
    year?: string;
  };
  endDate?: {
    month?: string;
    year?: string;
  };
  current?: boolean;
  highlighted: boolean;
  skills: string[];
  media: any[];
  verifications: number;
  recommendations: number;
}

export interface ProcessedPerson {
  name: string;
  username: string;
  professionalHeadline: string;
  bio?: string;
  location?: ProcessedLocation;
  profilePicture?: string;
  profileThumbnail?: string;
  verified: boolean;
  completion: number;
  memberSince: string;
  links: ProcessedLink[];
  isTest: boolean;
  theme: string;
}

export interface ProcessedStats {
  totalExperiences: number;
  totalSkills: number;
  totalConnections?: number;
  profileViews?: number;
  completionPercentage: number;
}

export interface ProcessedGenome {
  person: ProcessedPerson;
  skills: ProcessedSkill[];
  experiences: ProcessedExperience[];
  stats: ProcessedStats;
  lastUpdated: string;
}


export interface SearchResult {
  username: string;
  name: string;
  professionalHeadline: string;
  location: string;
  completion: number;
  verified: boolean;
  profilePicture?: string;
}

export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: any;
  timestamp?: string;
}


export interface RadarChartData {
  skill: string;
  fullName: string;
  primary: number;
  compare?: number;
  primaryPercentile: number;
  comparePercentile?: number;
  source: string;
}

export interface ComparisonResult {
  primaryUser: ProcessedPerson;
  compareUser: ProcessedPerson;
  commonSkills: ProcessedSkill[];
  uniqueSkillsPrimary: ProcessedSkill[];
  uniqueSkillsCompare: ProcessedSkill[];
  averagePercentileDiff: number;
  strongerSkills: string[];
  weakerSkills: string[];
  overallMatch: number;
}


export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf';
  includeData: boolean;
  includeComparison: boolean;
  theme: 'light' | 'dark';
  quality: number;
  watermark: boolean;
}

export interface ShareableProfile {
  username: string;
  compareUsername?: string;
  timestamp: number;
  expiresAt?: number;
  isPublic: boolean;
}


export enum PercentileTier {
  NOVICE = 'novice',
  BEGINNER = 'beginner',
  COMPETENT = 'competent',
  PROFICIENT = 'proficient',
  EXPERT = 'expert',
}

export interface PercentileTierInfo {
  tier: PercentileTier;
  label: string;
  color: string;
  backgroundColor: string;
  range: string;
  description: string;
  minPercentile: number;
  maxPercentile: number;
}

export interface SkillAnalysis {
  skill: ProcessedSkill;
  tier: PercentileTier;
  tierInfo: PercentileTierInfo;
  recommendations: string[];
  relatedSkills: string[];
  industryDemand: 'low' | 'medium' | 'high';
}


export interface GlobalSkillStats {
  skillName: string;
  totalUsers: number;
  averageProficiency: number;
  distribution: {
    percentile: number;
    proficiency: number;
    userCount: number;
  }[];
  trending: {
    direction: 'up' | 'down' | 'stable';
    change: number;
    period: string;
  };
  relatedSkills: string[];
  topIndustries: string[];
}


export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  exportFormat: 'png' | 'svg' | 'pdf';
  maxSkillsInRadar: number;
  showPercentiles: boolean;
  showSkillCodes: boolean;
  animationsEnabled: boolean;
  autoSaveComparisons: boolean;
  recentSearches: string[];
  favoriteProfiles: string[];
  privacySettings: {
    allowPublicSharing: boolean;
    showInSearch: boolean;
    allowAnalytics: boolean;
  };
}


export type ProficiencyLevel = 1 | 2 | 3 | 4 | 5;
export type ExperienceType = 'job' | 'education' | 'project' | 'award' | 'publication';
export type LinkType = 'linkedin' | 'github' | 'twitter' | 'website' | 'portfolio' | 'other';


export interface ProfileHeaderProps {
  person: ProcessedPerson;
  stats: ProcessedStats;
  onEdit?: () => void;
  isEditable?: boolean;
}

export interface SkillRadarProps {
  primaryData: ProcessedGenome;
  compareData?: ProcessedGenome;
  isCompareLoading?: boolean;
  compareError?: any;
  onRetry?: () => void;
  maxSkills?: number;
  showPercentiles?: boolean;
}

export interface ExperienceTimelineProps {
  experiences: ProcessedExperience[];
  showAll?: boolean;
  groupByType?: boolean;
  onExperienceClick?: (experience: ProcessedExperience) => void;
}
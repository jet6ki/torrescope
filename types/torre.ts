// Torre API response types
export interface TorreSkill {
  name: string;
  proficiency: number;
  recommendations?: number;
  additionalInfo?: {
    experience?: {
      years?: number;
      months?: number;
    };
  };
}

export interface TorreLanguage {
  language: string;
  proficiency: number;
  fluency?: string;
}

export interface TorreExperience {
  id: string;
  category: string;
  name: string;
  organizations?: Array<{
    name: string;
    id?: string;
  }>;
  skills?: Array<{
    name: string;
    proficiency?: number;
  }>;
  fromMonth?: string;
  fromYear?: string;
  toMonth?: string;
  toYear?: string;
  responsibilities?: string[];
  additionalInfo?: string;
}

export interface TorreGenome {
  skills?: TorreSkill[];
  languages?: TorreLanguage[];
  experiences?: TorreExperience[];
  interests?: Array<{
    name: string;
    proficiency?: number;
  }>;
  awards?: Array<{
    name: string;
    description?: string;
    date?: string;
  }>;
  education?: Array<{
    name: string;
    category: string;
    organizations?: Array<{
      name: string;
    }>;
  }>;
}

export interface TorreGenomeResponse {
  genome?: TorreGenome;
  person?: {
    name?: string;
    professionalHeadline?: string;
    location?: {
      name?: string;
      country?: string;
    };
    picture?: string;
    publicId?: string;
  };
  stats?: {
    opportunities?: number;
    views?: number;
    strengths?: number;
  };
}

// Processed data types for our application
export interface ProcessedSkill {
  name: string;
  proficiency: number;
  percentile: number;
}

export interface ProcessedGenome {
  username: string;
  person: {
    name: string;
    professionalHeadline: string;
    location: string;
    completion: number;
  };
  skills: ProcessedSkill[];
}

// API Error types
export interface ApiErrorResponse {
  error: string;
  code?: string;
  details?: any;
}

// Chart data types
export interface RadarChartData {
  skill: string;
  primary: number;
  compare?: number;
  primaryPercentile: number;
  comparePercentile?: number;
  fullName: string; // For tooltips
}

// Comparison types
export interface ComparisonResult {
  username: string;
  skills: ProcessedSkill[];
  commonSkills: number;
  averagePercentileDiff: number;
  strongerSkills: string[];
  weakerSkills: string[];
}

// Export configuration
export interface ExportOptions {
  format: 'png' | 'svg' | 'pdf';
  includeData: boolean;
  theme: 'light' | 'dark';
  quality: number;
}

// URL sharing types
export interface ShareableRadar {
  primaryUsername: string;
  compareUsername?: string;
  customData?: ProcessedGenome;
  timestamp: number;
}

// Percentile tier enums
export enum PercentileTier {
  LOW = 'low',
  MEDIUM = 'medium', 
  HIGH = 'high',
  EXPERT = 'expert',
}

export interface PercentileTierInfo {
  tier: PercentileTier;
  label: string;
  color: string;
  backgroundColor: string;
  range: string;
  description: string;
}

// Global skill statistics (for future implementation)
export interface GlobalSkillStats {
  skillName: string;
  totalUsers: number;
  averageProficiency: number;
  distribution: {
    percentile: number;
    proficiency: number;
  }[];
  trending: {
    direction: 'up' | 'down' | 'stable';
    change: number;
  };
}

// User preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  exportFormat: 'png' | 'svg';
  maxSkillsInRadar: number;
  showPercentiles: boolean;
  animationsEnabled: boolean;
  recentSearches: string[];
}
export interface SearchResult {
  username: string;
  name: string;
  professionalHeadline: string;
  location: string;
  verified: boolean;
  completion?: number;
  hasGenome?: boolean | null;
}

export interface User {
  username: string;
  name: string;
  professionalHeadline: string;
  location: string;
  verified: boolean;
  completion?: number;
}

export interface Skill {
  name: string;
  weight: number;
  recommendations: number;
}

export interface Experience {
  id: string;
  category: string;
  name: string;
  organizations: Array<{
    name: string;
    picture?: string;
  }>;
  fromMonth?: string;
  fromYear?: string;
  toMonth?: string;
  toYear?: string;
  additionalInfo?: string;
  responsibilities?: string[];
  achievements?: string[];
  media?: Array<{
    id: string;
    url: string;
    group: string;
  }>;
}

export interface GenomeData {
  person: {
    professionalHeadline: string;
    completion: number;
    showPhone: boolean;
    created: string;
    verified: boolean;
    flags: {
      benefits: boolean;
      canary: boolean;
      contactRequestsEnabled: boolean;
      enlauSource: boolean;
      fake: boolean;
      firstSignIn: boolean;
      hasEmail: boolean;
      hasPhone: boolean;
      importingLinkedIn: boolean;
      isInfluencer: boolean;
      isInvestor: boolean;
      isOrganization: boolean;
      isStudent: boolean;
      isTopPerformer: boolean;
      onBoarded: boolean;
      optInToCommunications: boolean;
      signedInToBiome: boolean;
      signedInToGenome: boolean;
      signedInToTorre: boolean;
      termsAccepted: boolean;
      torreVerified: boolean;
    };
    location: {
      name: string;
      shortName: string;
      country: string;
      latitude: number;
      longitude: number;
      timezone: string;
      timezoneOffSet: number;
    };
    theme: string;
    id: string;
    name: string;
    username: string;
    picture: string;
    hasEmail: boolean;
    links: Array<{
      id: string;
      name: string;
      address: string;
    }>;
    summaryOfBio: string;
    weight: number;
    publicId: string;
  };
  skills: Skill[];
  experiences: Experience[];
  strengths: Array<{
    id: string;
    name: string;
    weight: number;
    recommendations: number;
  }>;
  interests: Array<{
    id: string;
    name: string;
    weight: number;
  }>;
  awards: Array<{
    category: string;
    name: string;
    organizations: Array<{
      name: string;
      picture?: string;
    }>;
    date: string;
    additionalInfo?: string;
  }>;
  jobs: Array<{
    id: string;
    objective: string;
    type: string;
    status: string;
    remote: boolean;
    organizations: Array<{
      id: string;
      name: string;
      picture?: string;
    }>;
    locations: Array<{
      name: string;
      shortName: string;
      country: string;
    }>;
    skills: Array<{
      name: string;
      experience: string;
    }>;
    compensation: {
      visible: boolean;
      amount?: number;
      currency?: string;
      periodicity?: string;
    };
  }>;
  opportunities: Array<{
    id: string;
    objective: string;
    type: string;
    status: string;
    remote: boolean;
    organizations: Array<{
      id: string;
      name: string;
      picture?: string;
    }>;
    locations: Array<{
      name: string;
      shortName: string;
      country: string;
    }>;
    skills: Array<{
      name: string;
      experience: string;
    }>;
    compensation: {
      visible: boolean;
      amount?: number;
      currency?: string;
      periodicity?: string;
    };
  }>;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

export interface SearchApiResponse {
  suggestions: SearchResult[];
}

export interface UsersApiResponse {
  users: User[];
}

export type Theme = 'light' | 'dark' | 'system';
export interface TabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  username?: string;
}

export interface SearchBarProps {
  onUserSelect?: (username: string) => void;
  placeholder?: string;
  className?: string;
}

export interface HeaderProps {
  username?: string;
  showThemeToggle?: boolean;
}

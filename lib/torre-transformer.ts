import type {
  TorreGenomeResponse,
  TorreSkill,
  TorreLanguage,
  TorreExperience,
  TorrePerson,
  TorreLocation,
  TorreLink,
  ProcessedGenome,
  ProcessedPerson,
  ProcessedSkill,
  ProcessedExperience,
  ProcessedLocation,
  ProcessedLink,
  ProcessedOrganization,
  ProcessedStats,
  ProficiencyLevel,
  ExperienceType,
  LinkType,
} from '@/types/torre';
import { computePercentile } from './computePercentile';

/**
 * Converts Torre's string proficiency levels to numeric values
 */
export function convertProficiencyToNumber(proficiency: string | number | undefined): ProficiencyLevel {
  if (typeof proficiency === 'number') {
    return Math.min(5, Math.max(1, Math.round(proficiency))) as ProficiencyLevel;
  }
  
  if (typeof proficiency === 'string') {
    const prof = proficiency.toLowerCase().trim();
    switch (prof) {
      case 'novice':
      case 'beginner':
        return 1;
      case 'basic':
      case 'elementary':
        return 2;
      case 'competent':
      case 'intermediate':
        return 3;
      case 'proficient':
      case 'advanced':
        return 4;
      case 'expert':
      case 'native':
      case 'fluent':
        return 5;
      default:
        return 3;
    }
  }

  return 3;
}

/**
 * Determines the link type based on the URL or name
 */
export function determineLinkType(name: string, url: string): LinkType {
  const lowerName = name.toLowerCase();
  const lowerUrl = url.toLowerCase();
  
  if (lowerName.includes('linkedin') || lowerUrl.includes('linkedin.com')) return 'linkedin';
  if (lowerName.includes('github') || lowerUrl.includes('github.com')) return 'github';
  if (lowerName.includes('twitter') || lowerUrl.includes('twitter.com') || lowerUrl.includes('x.com')) return 'twitter';
  if (lowerName.includes('portfolio') || lowerName.includes('behance') || lowerName.includes('dribbble')) return 'portfolio';
  if (lowerName.includes('website') || lowerName.includes('blog') || lowerName.includes('personal')) return 'website';
  
  return 'other';
}

/**
 * Transforms Torre location data to processed format
 */
export function transformLocation(location?: TorreLocation): ProcessedLocation | undefined {
  if (!location) return undefined;
  
  const name = location.name || location.shortName || location.country || 'Unknown location';
  
  return {
    name,
    country: location.country,
    countryCode: location.countryCode,
    coordinates: location.latitude && location.longitude ? {
      lat: location.latitude,
      lng: location.longitude,
    } : undefined,
    timezone: location.timezone,
  };
}

/**
 * Transforms Torre links to processed format
 */
export function transformLinks(links: TorreLink[]): ProcessedLink[] {
  return links.map(link => ({
    id: link.id,
    name: link.name,
    url: link.address,
    icon: determineLinkType(link.name, link.address),
    verified: false,
  }));
}

/**
 * Transforms Torre person data to processed format
 */
export function transformPerson(person: TorrePerson): ProcessedPerson {
  return {
    name: person.name || 'Unknown',
    username: person.publicId || 'unknown',
    professionalHeadline: person.professionalHeadline || 'No headline',
    bio: person.summaryOfBio,
    location: transformLocation(person.location),
    profilePicture: person.picture,
    profileThumbnail: person.pictureThumbnail,
    verified: person.verified || false,
    completion: person.completion || 0,
    memberSince: person.created || new Date().toISOString(),
    links: transformLinks(person.links || []),
    isTest: person.isTest || false,
    theme: person.theme || 'default',
  };
}

/**
 * Transforms Torre skills to processed format
 */
export function transformSkills(
  strengths: TorreSkill[],
  experiences: TorreExperience[],
  languages: TorreLanguage[]
): ProcessedSkill[] {
  const skills: ProcessedSkill[] = [];
  const skillMap = new Map<string, ProcessedSkill>();

  strengths.forEach(strength => {
    if (strength.name && strength.name.trim()) {
      const proficiency = convertProficiencyToNumber(strength.proficiency);
      const skill: ProcessedSkill = {
        name: strength.name.trim(),
        proficiency,
        percentile: computePercentile(strength.name, proficiency),
        source: 'strengths',
        code: strength.code,
        recommendations: strength.recommendations || 0,
      };
      skillMap.set(skill.name.toLowerCase(), skill);
    }
  });

  experiences.forEach(exp => {
    if (exp.skills && Array.isArray(exp.skills)) {
      exp.skills.forEach(skill => {
        if (skill.name && skill.name.trim()) {
          const skillName = skill.name.trim();
          const key = skillName.toLowerCase();
          
          if (!skillMap.has(key)) {
            const proficiency = convertProficiencyToNumber(skill.proficiency);
            const processedSkill: ProcessedSkill = {
              name: skillName,
              proficiency,
              percentile: computePercentile(skillName, proficiency),
              source: 'experiences',
              recommendations: 0,
            };
            skillMap.set(key, processedSkill);
          }
        }
      });
    }
  });

  languages.forEach(lang => {
    if (lang.language && lang.language.trim()) {
      const skillName = lang.language.trim();
      const key = skillName.toLowerCase();
      
      if (!skillMap.has(key)) {
        const proficiency = convertProficiencyToNumber(lang.proficiency);
        const skill: ProcessedSkill = {
          name: skillName,
          proficiency,
          percentile: computePercentile(`${skillName}_language`, proficiency),
          source: 'languages',
          recommendations: 0,
        };
        skillMap.set(key, skill);
      }
    }
  });

  return Array.from(skillMap.values())
    .sort((a, b) => b.proficiency - a.proficiency)
    .slice(0, 20);
}

/**
 * Determines experience type from Torre category
 */
export function getExperienceType(category: string): ExperienceType {
  switch (category.toLowerCase()) {
    case 'jobs':
      return 'job';
    case 'education':
      return 'education';
    case 'projects':
      return 'project';
    case 'awards':
      return 'award';
    case 'publications':
      return 'publication';
    default:
      return 'job';
  }
}

/**
 * Transforms Torre organization to processed format
 */
export function transformOrganization(org: any): ProcessedOrganization | undefined {
  if (!org) return undefined;
  
  return {
    id: org.id || 0,
    name: org.name || 'Unknown Organization',
    logo: org.picture,
    publicId: org.publicId,
    website: org.website,
  };
}

/**
 * Transforms Torre experiences to processed format
 */
export function transformExperiences(experiences: TorreExperience[]): ProcessedExperience[] {
  return experiences
    .filter(exp => exp.name && exp.name.trim())
    .map(exp => ({
      id: exp.id,
      type: getExperienceType(exp.category),
      title: exp.name.trim(),
      organization: exp.organizations?.[0] ? transformOrganization(exp.organizations[0]) : undefined,
      description: exp.additionalInfo,
      responsibilities: exp.responsibilities || [],
      startDate: {
        month: exp.fromMonth,
        year: exp.fromYear,
      },
      endDate: {
        month: exp.toMonth,
        year: exp.toYear,
      },
      current: !exp.toMonth && !exp.toYear,
      highlighted: exp.highlighted || false,
      skills: exp.strengths?.map(s => s.name) || [],
      media: exp.media || [],
      verifications: exp.verifications || 0,
      recommendations: exp.recommendations || 0,
    }))
    .sort((a, b) => {
      const aEndYear = parseInt(a.endDate?.year || '9999');
      const bEndYear = parseInt(b.endDate?.year || '9999');
      if (aEndYear !== bEndYear) return bEndYear - aEndYear;
      
      const aStartYear = parseInt(a.startDate?.year || '0');
      const bStartYear = parseInt(b.startDate?.year || '0');
      return bStartYear - aStartYear;
    });
}

/**
 * Calculates processed stats from Torre data
 */
export function calculateStats(
  experiences: ProcessedExperience[],
  skills: ProcessedSkill[],
  person: ProcessedPerson
): ProcessedStats {
  return {
    totalExperiences: experiences.length,
    totalSkills: skills.length,
    completionPercentage: Math.round(person.completion * 100),
    profileViews: 0,
    totalConnections: 0,
  };
}

/**
 * Main transformation function - converts Torre API response to processed format
 */
export function transformTorreData(torreData: TorreGenomeResponse): ProcessedGenome {
  const person = transformPerson(torreData.person);
  const skills = transformSkills(
    torreData.strengths || [],
    torreData.experiences || [],
    torreData.languages || []
  );
  const experiences = transformExperiences([
    ...(torreData.jobs || []),
    ...(torreData.education || []),
    ...(torreData.projects || []),
    ...(torreData.awards || []),
    ...(torreData.publications || []),
  ]);
  const stats = calculateStats(experiences, skills, person);

  return {
    person,
    skills,
    experiences,
    stats,
    lastUpdated: new Date().toISOString(),
  };
}

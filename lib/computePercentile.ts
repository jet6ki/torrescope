const SKILL_PERCENTILES: Record<string, number[]> = {
  javascript: [1.2, 2.1, 2.8, 3.4, 4.0, 4.3, 4.6, 4.8, 4.9, 5.0],
  python: [1.1, 2.0, 2.7, 3.3, 3.9, 4.2, 4.5, 4.7, 4.9, 5.0],
  java: [1.0, 1.9, 2.6, 3.2, 3.8, 4.1, 4.4, 4.6, 4.8, 5.0],
  typescript: [1.3, 2.2, 2.9, 3.5, 4.1, 4.4, 4.7, 4.9, 4.95, 5.0],
  csharp: [1.1, 2.0, 2.7, 3.3, 3.9, 4.2, 4.5, 4.7, 4.9, 5.0],
  cpp: [0.9, 1.8, 2.5, 3.1, 3.7, 4.0, 4.3, 4.5, 4.7, 4.9],
  go: [1.4, 2.3, 3.0, 3.6, 4.2, 4.5, 4.8, 4.9, 4.95, 5.0],
  rust: [1.5, 2.4, 3.1, 3.7, 4.3, 4.6, 4.8, 4.9, 4.95, 5.0],
  php: [1.0, 1.9, 2.6, 3.2, 3.8, 4.1, 4.4, 4.6, 4.8, 5.0],
  ruby: [1.2, 2.1, 2.8, 3.4, 4.0, 4.3, 4.6, 4.8, 4.9, 5.0],
  react: [1.3, 2.2, 2.9, 3.5, 4.1, 4.4, 4.7, 4.9, 4.95, 5.0],
  angular: [1.1, 2.0, 2.7, 3.3, 3.9, 4.2, 4.5, 4.7, 4.9, 5.0],
  vue: [1.4, 2.3, 3.0, 3.6, 4.2, 4.5, 4.8, 4.9, 4.95, 5.0],
  nodejs: [1.2, 2.1, 2.8, 3.4, 4.0, 4.3, 4.6, 4.8, 4.9, 5.0],
  nextjs: [1.5, 2.4, 3.1, 3.7, 4.3, 4.6, 4.8, 4.9, 4.95, 5.0],
  sql: [1.0, 1.9, 2.6, 3.2, 3.8, 4.1, 4.4, 4.6, 4.8, 5.0],
  postgresql: [1.1, 2.0, 2.7, 3.3, 3.9, 4.2, 4.5, 4.7, 4.9, 5.0],
  mysql: [1.0, 1.9, 2.6, 3.2, 3.8, 4.1, 4.4, 4.6, 4.8, 5.0],
  mongodb: [1.2, 2.1, 2.8, 3.4, 4.0, 4.3, 4.6, 4.8, 4.9, 5.0],
  redis: [1.3, 2.2, 2.9, 3.5, 4.1, 4.4, 4.7, 4.9, 4.95, 5.0],
  aws: [1.1, 2.0, 2.7, 3.3, 3.9, 4.2, 4.5, 4.7, 4.9, 5.0],
  azure: [1.2, 2.1, 2.8, 3.4, 4.0, 4.3, 4.6, 4.8, 4.9, 5.0],
  docker: [1.2, 2.1, 2.8, 3.4, 4.0, 4.3, 4.6, 4.8, 4.9, 5.0],
  kubernetes: [1.4, 2.3, 3.0, 3.6, 4.2, 4.5, 4.8, 4.9, 4.95, 5.0],
  terraform: [1.5, 2.4, 3.1, 3.7, 4.3, 4.6, 4.8, 4.9, 4.95, 5.0],
  figma: [1.3, 2.2, 2.9, 3.5, 4.1, 4.4, 4.7, 4.9, 4.95, 5.0],
  photoshop: [1.1, 2.0, 2.7, 3.3, 3.9, 4.2, 4.5, 4.7, 4.9, 5.0],
  'ui/ux': [1.2, 2.1, 2.8, 3.4, 4.0, 4.3, 4.6, 4.8, 4.9, 5.0],
  _default: [1.0, 2.0, 2.7, 3.3, 3.8, 4.2, 4.5, 4.7, 4.9, 5.0],
};
const PERCENTILE_THRESHOLDS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 95];

/**
 * Computes the percentile rank for a given skill and proficiency level
 * @param skillName - The name of the skill
 * @param proficiency - The proficiency level (0-5)
 * @returns The percentile rank (0-100)
 */
export function computePercentile(skillName: string, proficiency: number): number {
  const normalizedSkill = normalizeSkillName(skillName);
  const distribution = SKILL_PERCENTILES[normalizedSkill] || SKILL_PERCENTILES._default;
  const clampedProficiency = Math.max(0, Math.min(5, proficiency));
  let percentile = 0;
  
  for (let i = 0; i < distribution.length; i++) {
    if (clampedProficiency <= distribution[i]) {
      percentile = PERCENTILE_THRESHOLDS[i];
      break;
    }
  }

  if (percentile === 0) {
    percentile = Math.min(100, 95 + (clampedProficiency - distribution[9]) * 10);
  }

  const variance = Math.random() * 4 - 2;
  percentile = Math.max(1, Math.min(100, Math.round(percentile + variance)));
  
  return percentile;
}

/**
 * Normalizes skill names for consistent lookup
 * @param skillName - The raw skill name
 * @returns Normalized skill name
 */
function normalizeSkillName(skillName: string): string {
  return skillName
    .toLowerCase()
    .replace(/[\s\-\.]/g, '')
    .replace(/\+/g, 'plus')
    .replace(/#/g, 'sharp')
    .replace(/[^\w]/g, '');
}

/**
 * Gets a color class based on percentile tier
 * @param percentile - The percentile rank (0-100)
 * @returns CSS class name for styling
 */
export function getPercentileColor(percentile: number): string {
  if (percentile >= 96) return 'skill-expert';
  if (percentile >= 80) return 'skill-high';
  if (percentile >= 50) return 'skill-medium';
  return 'skill-low';
}

/**
 * Gets a descriptive label for the percentile tier
 * @param percentile - The percentile rank (0-100)
 * @returns Human-readable tier description
 */
export function getPercentileTier(percentile: number): string {
  if (percentile >= 96) return 'Expert';
  if (percentile >= 80) return 'High';
  if (percentile >= 50) return 'Above Average';
  return 'Below Average';
}

/**
 * Batch compute percentiles for multiple skills
 * @param skills - Array of skills with name and proficiency
 * @returns Array of skills with computed percentiles
 */
export function computeBatchPercentiles(
  skills: Array<{ name: string; proficiency: number }>
): Array<{ name: string; proficiency: number; percentile: number }> {
  return skills.map((skill) => ({
    ...skill,
    percentile: computePercentile(skill.name, skill.proficiency),
  }));
}

/**
 * Generates mock skill distribution for testing purposes
 * @param skillName - The skill name
 * @param samples - Number of samples to generate
 * @returns Array of proficiency values
 */
export function generateMockDistribution(skillName: string, samples: number = 1000): number[] {
  const baseDistribution = SKILL_PERCENTILES[normalizeSkillName(skillName)] || SKILL_PERCENTILES._default;
  const result: number[] = [];
  
  for (let i = 0; i < samples; i++) {
    const percentileIndex = Math.floor(Math.random() * baseDistribution.length);
    const baseValue = baseDistribution[percentileIndex];
    const variance = (Math.random() - 0.5) * 0.4;
    result.push(Math.max(0, Math.min(5, baseValue + variance)));
  }
  
  return result.sort((a, b) => a - b);
}
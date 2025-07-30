import type { SearchResult, User } from '@/types';

export const USERS_DATASET: SearchResult[] = [
  { username: 'john', name: 'John Galac', professionalHeadline: 'Creative graphic / web designer', location: 'United States', verified: true },
  { username: 'diego', name: 'Diego Fernandes', professionalHeadline: 'Full Stack Developer', location: 'Brazil', verified: true },
  { username: 'laura', name: 'Laura Daniela Peña Castro', professionalHeadline: 'UX Designer', location: 'Colombia', verified: false },
  { username: 'jane', name: 'Jane Pitt', professionalHeadline: 'Product Designer', location: 'Canada', verified: true },
  { username: 'carlos', name: 'Carlos Mendez', professionalHeadline: 'Backend Developer', location: 'Argentina', verified: false },
  { username: 'renan', name: 'Renan Silva', professionalHeadline: 'Software Developer', location: 'Brazil', verified: true },
];

export const ALL_USERS_DATASET: User[] = [
  { username: 'john', name: 'John Galac', professionalHeadline: 'Creative graphic / web designer', location: 'United States', verified: true },
  { username: 'diego', name: 'Diego Fernandes', professionalHeadline: 'Full Stack Developer', location: 'Brazil', verified: true },
  { username: 'laura', name: 'Laura Daniela Peña Castro', professionalHeadline: 'UX Designer', location: 'Colombia', verified: false },
  { username: 'jane', name: 'Jane Pitt', professionalHeadline: 'Product Designer', location: 'Canada', verified: true },
  { username: 'carlos', name: 'Carlos Mendez', professionalHeadline: 'Backend Developer', location: 'Argentina', verified: false },
  { username: 'renan', name: 'Renan Silva', professionalHeadline: 'Software Developer', location: 'Brazil', verified: true },
  { username: 'maria', name: 'Maria Rodriguez', professionalHeadline: 'Data Scientist', location: 'Spain', verified: true },
  { username: 'alex', name: 'Alex Thompson', professionalHeadline: 'DevOps Engineer', location: 'United Kingdom', verified: false },
  { username: 'sofia', name: 'Sofia Chen', professionalHeadline: 'Mobile Developer', location: 'Singapore', verified: true },
  { username: 'lucas', name: 'Lucas Santos', professionalHeadline: 'Frontend Developer', location: 'Portugal', verified: false },
  { username: 'emma', name: 'Emma Wilson', professionalHeadline: 'Product Manager', location: 'Australia', verified: true },
  { username: 'david', name: 'David Kim', professionalHeadline: 'Machine Learning Engineer', location: 'South Korea', verified: true },
  { username: 'ana', name: 'Ana García', professionalHeadline: 'UI/UX Designer', location: 'Mexico', verified: false },
  { username: 'marco', name: 'Marco Rossi', professionalHeadline: 'Backend Engineer', location: 'Italy', verified: true },
  { username: 'lisa', name: 'Lisa Anderson', professionalHeadline: 'Technical Writer', location: 'Sweden', verified: false },
  { username: 'kevin', name: 'Kevin O\'Connor', professionalHeadline: 'Cloud Architect', location: 'Ireland', verified: true },
  { username: 'yuki', name: 'Yuki Tanaka', professionalHeadline: 'Game Developer', location: 'Japan', verified: false },
  { username: 'pierre', name: 'Pierre Dubois', professionalHeadline: 'Security Engineer', location: 'France', verified: true },
  { username: 'priya', name: 'Priya Sharma', professionalHeadline: 'Data Analyst', location: 'India', verified: false },
  { username: 'hans', name: 'Hans Mueller', professionalHeadline: 'Software Architect', location: 'Germany', verified: true },
  { username: 'elena', name: 'Elena Popov', professionalHeadline: 'Frontend Engineer', location: 'Russia', verified: false },
  { username: 'ahmed', name: 'Ahmed Hassan', professionalHeadline: 'Mobile App Developer', location: 'Egypt', verified: true },
  { username: 'nina', name: 'Nina Larsson', professionalHeadline: 'Product Designer', location: 'Norway', verified: false },
  { username: 'carlos2', name: 'Carlos Silva', professionalHeadline: 'DevOps Specialist', location: 'Chile', verified: true },
  { username: 'fatima', name: 'Fatima Al-Zahra', professionalHeadline: 'AI Researcher', location: 'UAE', verified: false },
];


export const searchUsers = (query: string): SearchResult[] => {
  if (!query || query.length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();

  return USERS_DATASET
    .filter(user =>
      user.username.toLowerCase().includes(normalizedQuery) ||
      user.name.toLowerCase().includes(normalizedQuery) ||
      user.professionalHeadline.toLowerCase().includes(normalizedQuery)
    )
    .sort((a, b) => {
      const aUsernameMatch = a.username.toLowerCase().startsWith(normalizedQuery);
      const bUsernameMatch = b.username.toLowerCase().startsWith(normalizedQuery);

      if (aUsernameMatch && !bUsernameMatch) return -1;
      if (!aUsernameMatch && bUsernameMatch) return 1;

      const aNameMatch = a.name.toLowerCase().startsWith(normalizedQuery);
      const bNameMatch = b.name.toLowerCase().startsWith(normalizedQuery);

      if (aNameMatch && !bNameMatch) return -1;
      if (!aNameMatch && bNameMatch) return 1;

      return a.username.localeCompare(b.username);
    })
    .slice(0, 10);
};

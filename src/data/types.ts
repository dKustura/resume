export type IconType =
  | 'legal'
  | 'software'
  | 'communications'
  | 'automotive'
  | 'healthcare'
  | 'cloud';

export interface ExperienceEntry {
  role: string;
  company: string;
  companyUrl: string;
  iconType: IconType;
  period: string;
  tech?: string[];
  bullets?: string[];
  note?: string;
}

export interface ProjectEntry {
  title: string;
  description?: string;
  period: string;
  tech?: string[];
  link?: string;
}

export interface ResearchEntry {
  title: string;
  link: string;
  subtitle?: string;
  description?: string;
  period: string;
  tech?: string[];
}

export interface EducationEntry {
  degree: string;
  school: string;
  period: string;
}

export interface TechItem {
  name: string;
  icon: string | null;
  darkInvert?: boolean;
}

export interface TechGroup {
  label: string;
  items: TechItem[];
}

export interface Personal {
  name: string;
  title: string;
  email: string;
  linkedin: string;
  github: string;
  avatar: string;
  interests: readonly string[];
}

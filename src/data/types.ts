import type { ImageMetadata } from 'astro'

export type IconType =
  | 'legal'
  | 'software'
  | 'communications'
  | 'automotive'
  | 'healthcare'
  | 'cloud'

export interface ExperienceRole {
  role: string
  period: string
  tech?: string[]
  bullets?: string[]
}

export interface ExperienceEntry {
  company: string
  companyUrl: string
  iconType: IconType
  note?: string
  roles: ExperienceRole[]
}

export interface ProjectEntry {
  title: string
  description?: string
  period: string
  tech?: string[]
  link?: string
}

export interface ResearchEntry {
  title: string
  link: string
  subtitle?: string
  description?: string
  period: string
  tech?: string[]
}

export interface EducationEntry {
  degree: string
  school: string
  period: string
}

export interface TechItem {
  name: string
  /** simple-icons slug, e.g. "nextdotjs" */
  icon: string | null
}

export interface TechGroup {
  label: string
  items: TechItem[]
}

export interface Personal {
  name: string
  title: string
  summary: string
  email: string
  linkedin: string
  github: string
  avatar: ImageMetadata
  interests: readonly (string | { label: string; url: string })[]
}

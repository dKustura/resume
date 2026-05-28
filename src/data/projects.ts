import type { ProjectEntry } from './types';

export const projects: ProjectEntry[] = [
  {
    title: 'Various static sites',
    description: 'Website for an event planning company and a personal bookshelf website.',
    period: '2021 – Present',
    tech: ['Astro'],
  },
  {
    title: 'Codequst',
    description: 'Own software agency website.',
    period: '2022 – Present',
    link: 'https://codequst.com',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS'],
  },
  {
    title: 'Nutripoint',
    description: 'Nutrition tracking and plan management app for nutritionists and their clients.',
    period: '2021 – 2022',
    tech: ['React', 'Redux', 'TypeScript', 'NestJS', 'Prisma', 'PostgreSQL'],
  },
  {
    title: 'Airsoft Zadar',
    description: 'Presentation and CMS web app for a local sports recreation club.',
    period: '2020 – 2021',
    tech: ['React', 'Redux', 'TypeScript', 'Firebase', 'Firestore', 'Google Cloud Functions'],
  },
  {
    title: 'Rudimentary social network',
    description: 'University project — a basic social network with real-time features.',
    period: 'Sep 2016 – Jan 2017',
    tech: ['Node.js', 'Express.js', 'Socket.io', 'MongoDB', 'Heroku'],
  },
];

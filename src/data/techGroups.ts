import type { TechGroup } from './types';

export const techGroups: TechGroup[] = [
  {
    label: 'Frontend',
    items: [
      { name: 'React', icon: 'react' },
      { name: 'Redux', icon: 'redux' },
      { name: 'Next.js', icon: 'nextdotjs', darkInvert: true },
      { name: 'Tailwind CSS', icon: 'tailwindcss' },
      { name: 'Material UI', icon: 'mui' },
      { name: 'shadcn/ui', icon: null },
      { name: 'SCSS', icon: 'sass' },
      { name: 'Astro', icon: 'astro' },
      { name: 'Vite', icon: 'vite' },
      { name: 'Webpack', icon: 'webpack' },
      { name: 'D3.js', icon: 'd3dotjs' },
      { name: 'Storybook', icon: 'storybook' },
      { name: 'CKEditor', icon: null },
    ],
  },
  {
    label: 'Languages',
    items: [
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'HTML/CSS', icon: 'html5' },
      { name: 'Python', icon: 'python' },
      { name: 'C#', icon: 'csharp' },
      { name: 'Scala', icon: 'scala' },
    ],
  },
  {
    label: 'Backend & API',
    items: [
      { name: 'Node.js', icon: 'nodedotjs' },
      { name: 'NestJS', icon: 'nestjs' },
      { name: 'Express.js', icon: 'express', darkInvert: true },
      { name: 'GraphQL', icon: 'graphql' },
      { name: 'Apollo', icon: 'apollographql', darkInvert: true },
      { name: 'REST APIs', icon: null },
      { name: '.NET', icon: 'dotnet' },
      { name: 'Play Framework', icon: null },
    ],
  },
  {
    label: 'Databases',
    items: [
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MySQL', icon: 'mysql' },
      { name: 'MS SQL Server', icon: 'microsoftsqlserver' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'Prisma', icon: 'prisma', darkInvert: true },
      { name: 'Firebase', icon: 'firebase' },
    ],
  },
  {
    label: 'Testing & Monitoring',
    items: [
      { name: 'Cypress', icon: 'cypress', darkInvert: true },
      { name: 'Playwright', icon: 'playwright' },
      { name: 'Sentry', icon: 'sentry', darkInvert: true },
    ],
  },
  {
    label: 'Tools & Infra',
    items: [
      { name: 'Git', icon: 'git' },
      { name: 'Docker', icon: 'docker' },
      { name: 'Google Cloud', icon: 'googlecloud' },
      { name: 'Cloudflare', icon: 'cloudflare' },
      { name: 'Claude Code', icon: 'anthropic', darkInvert: true },
    ],
  },
];

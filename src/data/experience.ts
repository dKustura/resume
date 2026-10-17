import type { ExperienceEntry } from './types';

export const experience: ExperienceEntry[] = [
  {
    company: 'Neota Logic',
    companyUrl: 'https://neota.com',
    iconType: 'legal',
    roles: [
      {
        role: 'Senior Fullstack Engineer',
        period: 'Sep 2026 – Present',
        tech: [
          'React',
          'TypeScript',
          'GraphQL',
          'Apollo',
          'Tailwind CSS',
          'CKEditor',
          'Storybook',
          'Scala',
          'Play Framework',
          'PostgreSQL',
        ],
        bullets: [
          'Moved into a full-stack role, building backend services in Scala and Play Framework on PostgreSQL while continuing to own core front-end functionality of the no-code platform.',
        ],
      },
      {
        role: 'Senior Frontend Engineer',
        period: 'Sep 2022 – Aug 2026',
        tech: [
          'React',
          'TypeScript',
          'GraphQL',
          'Apollo',
          'Tailwind CSS',
          'CKEditor',
          'Storybook',
        ],
        bullets: [
          'No-code platform that lets lawyers, accountants, compliance officers, consultants, and other non-programmers build web applications.',
          'Development and maintenance of the core front-end functionality — theming, building blocks, logic editors, authoring utilities, real-time updates, and validation.',
          'Development of advanced rich text editing experiences on CKEditor, integrating custom interactive and dynamic components that connect document content to underlying business logic.',
        ],
      },
    ],
  },
  {
    company: 'Codequst',
    companyUrl: 'https://codequst.com',
    iconType: 'software',
    roles: [
      {
        role: 'Founder',
        period: 'Jul 2022 – Present',
        tech: [
          'React',
          'TypeScript',
          'GraphQL',
          '.NET',
          'Node.js',
          'NestJS',
          'Storybook',
          'Cloudflare',
        ],
        bullets: [
          'Running my own software agency, delivering client projects including a real-time, web-based IDE for a no-code platform.',
          'Also working on launching a product of my own.',
        ],
      },
    ],
  },
  {
    company: 'heyPatient',
    companyUrl: 'https://en.heypatient.com',
    iconType: 'healthcare',
    note: 'Part-time',
    roles: [
      {
        role: 'Senior Frontend Engineer',
        period: 'Sep 2023 – Feb 2024',
        tech: [
          'React',
          'TypeScript',
          'Next.js',
          'GraphQL',
          'Sentry',
          'Storybook',
        ],
        bullets: [
          'A digital health platform used by hospitals to streamline patient data management and appointment workflows.',
          'Led the frontend implementation of a Medical ID OCR scanning feature deployed on specialized hospital terminals — dedicated hardware stations that let staff digitize patient identification documents in seconds rather than entering data manually.',
          'Developed and improved patient-facing and staff-facing dashboards, data management interfaces, and clinical forms used across hospital workflows.',
        ],
      },
    ],
  },
  {
    company: 'Infobip',
    companyUrl: 'https://www.infobip.com',
    iconType: 'communications',
    roles: [
      {
        role: 'Fullstack Software Engineer',
        period: 'Feb 2021 – Jun 2022',
        tech: [
          'React',
          'Redux',
          'TypeScript',
          'Webpack',
          'Storybook',
          '.NET',
          'MS SQL Server',
          'Docker',
        ],
        bullets: [
          "Built and maintained internal tools powering the company's SMS service management at a CPaaS company operating at significant scale.",
          'Projects spanned routing, billing, analytics, and internal user configuration across one of the core product lines.',
        ],
      },
    ],
  },
  {
    company: 'AVL',
    companyUrl: 'https://www.avl.com/en',
    iconType: 'automotive',
    roles: [
      {
        role: 'Fullstack Software Engineer',
        period: 'Mar 2019 – Jan 2021',
        tech: [
          'React',
          'Redux',
          'TypeScript',
          'Cypress',
          'Material UI',
          'Storybook',
          '.NET',
          'MySQL',
        ],
        bullets: [
          'Built web applications delivered to automotive OEMs including Ford and Daimler/Mercedes-Benz.',
          'Projects included vehicle and parts management systems, manufacturing pipeline tools, and related internal platforms.',
        ],
      },
    ],
  },
  {
    company: 'Ericsson Nikola Tesla',
    companyUrl: 'https://ericssonnikolatesla.com',
    iconType: 'cloud',
    roles: [
      {
        role: 'Fullstack Software Engineer',
        period: 'Jul 2017 – Dec 2017',
        tech: ['JavaScript', 'D3.js', 'Node.js', 'Storybook'],
      },
    ],
  },
];

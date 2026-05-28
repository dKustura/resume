import type { ExperienceEntry } from './types';

export const experience: ExperienceEntry[] = [
  {
    role: 'Senior Frontend Engineer',
    company: 'Neota Logic',
    companyUrl: 'https://neota.com',
    iconType: 'legal',
    period: 'Sep 2022 – Present',
    tech: ['React', 'TypeScript', 'GraphQL', 'CKEditor'],
    bullets: [
      'No-code platform that lets lawyers, accountants, compliance officers, consultants, and other non-programmers build web applications.',
      'Development and maintenance of the core front-end functionality — theming, building blocks, logic editors, authoring utilities, real-time updates, and validation.',
      'Development of advanced rich text editing experiences on CKEditor, integrating custom interactive and dynamic components that connect document content to underlying business logic.',
    ],
  },
  {
    role: 'Freelance Software Engineer',
    company: 'Codequst',
    companyUrl: 'https://codequst.com',
    iconType: 'software',
    period: 'Jul 2022 – Present',
    tech: ['React', 'TypeScript', 'GraphQL', '.NET', 'Node.js', 'NestJS'],
    bullets: [
      'Building a real-time IDE for a no-code platform on the web, among other client projects.',
    ],
  },
  {
    role: 'Senior Frontend Engineer',
    company: 'heyPatient',
    companyUrl: 'https://en.heypatient.com',
    iconType: 'healthcare',
    period: 'Sep 2023 – Feb 2024',
    tech: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Sentry'],
    note: 'Part-time',
    bullets: [
      'A digital health platform used by hospitals to streamline patient data management and appointment workflows.',
      'Led the frontend implementation of a Medical ID OCR scanning feature deployed on specialized hospital terminals — dedicated hardware stations that let staff digitize patient identification documents in seconds rather than entering data manually.',
      'Developed and improved patient-facing and staff-facing dashboards, data management interfaces, and clinical forms used across hospital workflows.',
    ],
  },
  {
    role: 'Fullstack Software Engineer',
    company: 'Infobip',
    companyUrl: 'https://www.infobip.com',
    iconType: 'communications',
    period: 'Feb 2021 – Jun 2022',
    tech: ['React', 'Redux', 'TypeScript', 'Webpack', '.NET Core', 'MS SQL Server', 'Docker'],
    bullets: [
      "Built and maintained internal tools powering the company's SMS service management at a CPaaS company operating at significant scale.",
      'Projects spanned routing, billing, analytics, and internal user configuration across one of the core product lines.',
    ],
  },
  {
    role: 'Fullstack Software Engineer',
    company: 'AVL',
    companyUrl: 'https://www.avl.com/en',
    iconType: 'automotive',
    period: 'Mar 2019 – Jan 2021',
    tech: ['React', 'Redux', 'TypeScript', 'Cypress', 'Material UI', '.NET Core', 'MySQL'],
    bullets: [
      'Built web applications delivered to automotive OEMs including Ford and Daimler/Mercedes-Benz.',
      'Projects included vehicle and parts management systems, manufacturing pipeline tools, and related internal platforms.',
    ],
  },
  {
    role: 'Fullstack Software Engineer',
    company: 'Ericsson Nikola Tesla',
    companyUrl: 'https://ericssonnikolatesla.com',
    iconType: 'cloud',
    period: 'Jul 2017 – Dec 2017',
    tech: ['JavaScript', 'D3.js', 'Node.js'],
  },
];

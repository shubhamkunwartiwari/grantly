export const SITE_CONFIG = {
  name: 'Grantly',
  tagline: 'Every scholarship you qualify for, in one calm place.',
  description:
    'A unified scholarship discovery and management platform. Discover opportunities, understand eligibility plainly, prepare your documents, and track deadlines across providers.',
  url: 'https://grantly.app',
  contact: {
    email: 'shubhamkunwartiwari@gmail.com',
    location: 'Bengaluru, India',
    officeHours: 'Monday to Friday, 9:00 AM – 6:00 PM IST',
    supportResponseTime: 'Typically within 24 business hours',
  },
  pillars: [
    {
      number: '01',
      id: 'discover',
      title: 'Discover',
      tagline: 'Find relevant scholarships fast',
      summary:
        'Unified search aggregating government, university, foundation, corporate, and NGO funding without predatory lead generation or sponsored clutter.',
    },
    {
      number: '02',
      id: 'understand',
      title: 'Understand',
      tagline: 'See plainly whether you qualify and why',
      summary:
        'Transparent eligibility criteria decomposed into plain language. Know immediately if you meet GPA, residency, or field rules without reading 40-page PDFs.',
    },
    {
      number: '03',
      id: 'apply',
      title: 'Apply',
      tagline: 'Know exactly what to prepare and in what order',
      summary:
        'Actionable step-by-step roadmaps with auto-generated document checklists, realistic effort estimates, and submission tips.',
    },
    {
      number: '04',
      id: 'track',
      title: 'Track',
      tagline: 'One place for deadlines, documents, and status',
      summary:
        'A distraction-free Kanban board with automated deadline countdowns, progress indicators, private notes, and iCal exports.',
    },
  ],
  links: {
    github: 'https://github.com',
    sampleNotice:
      'Grantly is a hackathon demonstration. All scholarship data, provider listings, and deadlines are fictional sample fixtures created for evaluation.',
  },
} as const;

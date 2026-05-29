import { USE_MOCK_API } from '@/config/api-mode';
import { mockDb } from '@/services/mock/mock-db';
import type {
  PublicAboutContentDto,
  PublicBlogContentDto,
  PublicBlogPostCardDto,
  PublicBlogPostContentDto,
  PublicCoachCardDto,
  PublicCoachesContentDto,
  PublicCoachProfileContentDto,
  PublicEventDetailsContentDto,
  PublicEventsContentDto,
  PublicGalleryContentDto,
  PublicGalleryMediaItemDto,
  PublicHomeContentDto,
  PublicLocationsContentDto,
  PublicOffersContentDto,
  PublicPricingContentDto,
  PublicProgramDetailsContentDto,
  PublicProgramsContentDto,
} from '../types/public-content.dto';
import {
  getPublicAboutContent,
  getPublicBlogContent,
  getPublicBlogPostContent,
  getPublicCoachesContent,
  getPublicCoachProfileContent,
  getPublicEventDetails,
  getPublicEventsContent,
  getPublicGalleryContent,
  getPublicHomeContent,
  getPublicLocationsContent,
  getPublicLoginShowcase,
  getPublicOffersContent,
  getPublicPricingContent,
  getPublicProgramDetails,
  getPublicProgramsContent,
} from './public-api.service';

const fallback: PublicHomeContentDto = {
  kpis: [
    { key: 'students', label: 'Active players', value: '1,200+' },
    { key: 'coaches', label: 'Professional coaches', value: '35+' },
    { key: 'branches', label: 'Training branches', value: '8' },
    { key: 'satisfaction', label: 'Parent satisfaction', value: '94%' },
  ],
  programs: [
    {
      id: 'p-1',
      title: 'Football Program',
      age: 'Ages 5-16',
      level: 'Beginner to advanced',
      description: 'Progressive technical and tactical training.',
    },
    {
      id: 'p-2',
      title: 'Swimming Program',
      age: 'Ages 4-14',
      level: 'Foundation to pro',
      description: 'Safe sessions to build water confidence and stamina.',
    },
    {
      id: 'p-3',
      title: 'Basketball Program',
      age: 'Ages 7-16',
      level: 'Beginner to competitive',
      description: 'Skills, dribbling, defense, and team play.',
    },
  ],
  branches: [
    {
      id: 'b-1',
      city: 'Dubai',
      location: 'Modern training fields near communities.',
      schedule: 'Sunday - Thursday | 4 PM - 9 PM',
    },
    {
      id: 'b-2',
      city: 'Abu Dhabi',
      location: 'Safe facilities for young players and families.',
      schedule: 'Saturday - Wednesday | 5 PM - 10 PM',
    },
    {
      id: 'b-3',
      city: 'Sharjah',
      location: 'Family-friendly branch for children and beginners.',
      schedule: 'Friday - Tuesday | 4 PM - 8 PM',
    },
  ],
  gallery: [
    {
      id: 'g-1',
      title: 'Team training',
      subtitle: 'Team spirit and discipline',
    },
    {
      id: 'g-2',
      title: 'Skill development',
      subtitle: 'Training drills for every level',
    },
    {
      id: 'g-3',
      title: 'Professional sessions',
      subtitle: 'Specialized coaches and clear plans',
    },
    {
      id: 'g-4',
      title: 'Safe environment',
      subtitle: 'Continuous tracking and family-friendly experience',
    },
  ],
  loginShowcase: {
    features: [
      { id: 'f-kpi', title: 'KPI dashboards' },
      { id: 'f-ops', title: 'Academy operations' },
      { id: 'f-attendance', title: 'Attendance tracking' },
    ],
    metrics: [
      { id: 'm-players', value: '1,200+', label: 'Players' },
      { id: 'm-coaches', value: '35+', label: 'Coaches' },
      { id: 'm-branches', value: '8', label: 'Branches' },
    ],
  },
};

const aboutFallback: PublicAboutContentDto = {
  hero: {
    badge: 'About AspireX',
    title: 'A modern sports academy built around children, families, and measurable progress.',
    description:
      'AspireX Sports Academy combines professional coaching, safe training environments, structured programs, and digital progress tracking to help every child grow with confidence.',
    primaryAction: 'Register Your Child',
    secondaryAction: 'Book Free Trial',
  },
  stats: [
    {
      key: 'students',
      label: 'Active players',
      value: '1,200+',
      description: 'Children developing through structured academy programs.',
    },
    {
      key: 'coaches',
      label: 'Professional coaches',
      value: '35+',
      description: 'Certified coaches supporting player growth.',
    },
    {
      key: 'branches',
      label: 'Training branches',
      value: '8',
      description: 'Accessible training locations for families.',
    },
    {
      key: 'attendance',
      label: 'Attendance rate',
      value: '94%',
      description: 'Consistent participation supported by digital tracking.',
    },
  ],
  mission: {
    eyebrow: 'Our Mission',
    title: 'We help young athletes train safely, improve consistently, and enjoy sport.',
    description:
      'Our mission is to create a premium academy experience where children receive age-appropriate coaching, parents stay informed, and every player can see their progress clearly.',
    values: [
      {
        id: 'value-safety',
        title: 'Safety first',
        description:
          'Every session is planned around age, ability, supervision, hydration, and safe progression.',
      },
      {
        id: 'value-progress',
        title: 'Measurable progress',
        description:
          'Players develop through structured skills, attendance tracking, coach notes, and clear milestones.',
      },
      {
        id: 'value-family',
        title: 'Family communication',
        description:
          'Parents receive clear visibility into schedules, attendance, subscriptions, documents, and development updates.',
      },
    ],
  },
  story: {
    eyebrow: 'Academy Story',
    title: 'Built as a complete academy operating system, not just a training schedule.',
    description:
      'AspireX is designed to connect the public website, parent portal, coach workspace, and admin operations in one coherent academy experience.',
    highlights: [
      {
        id: 'highlight-programs',
        title: 'Structured programs',
        description:
          'Programs are organized by age, skill level, sport, branch, and training pathway.',
      },
      {
        id: 'highlight-branches',
        title: 'Multi-branch operations',
        description:
          'Branch-based planning helps families choose practical training locations and schedules.',
      },
      {
        id: 'highlight-digital',
        title: 'Digital transparency',
        description:
          'Parents, coaches, and administrators work from connected data instead of scattered manual records.',
      },
    ],
  },
  pathway: {
    eyebrow: 'Player Pathway',
    title: 'A clear development journey from first trial to long-term performance.',
    description:
      'The player journey is designed to be simple for families and useful for coaches: trial, registration, placement, training, assessment, and progress follow-up.',
    steps: [
      {
        id: 'step-trial',
        title: 'Trial & assessment',
        description:
          'Families can book a trial so the academy can understand the child’s level and recommend the right path.',
      },
      {
        id: 'step-placement',
        title: 'Program placement',
        description:
          'Students are assigned to a suitable program, branch, group, and coach.',
      },
      {
        id: 'step-growth',
        title: 'Progress tracking',
        description:
          'Attendance, skill assessment, coach notes, and incidents are tracked in the system.',
      },
    ],
  },
  safety: {
    eyebrow: 'Safety & Trust',
    title: 'A family-friendly environment with clear standards.',
    description:
      'The academy experience is built around child safety, coach accountability, attendance visibility, and consistent communication.',
    items: [
      {
        id: 'safety-attendance',
        title: 'Attendance visibility',
        description:
          'Attendance records help coaches and families identify consistency and follow-up needs.',
      },
      {
        id: 'safety-incidents',
        title: 'Incident follow-up',
        description:
          'Safety or behavior concerns can be documented and reviewed through the system.',
      },
      {
        id: 'safety-communication',
        title: 'Connected communication',
        description:
          'Messages and updates keep parents, coaches, and administration aligned.',
      },
    ],
  },
  cta: {
    badge: 'Start the journey',
    title: 'Ready to experience a smarter sports academy?',
    description:
      'Register your child or book a free trial and let the academy team guide you to the right program.',
    primaryAction: 'Register Your Child',
    secondaryAction: 'Book Free Trial',
  },
};

function mockHomeContent(): PublicHomeContentDto {
  return {
    ...fallback,
    kpis: [
      {
        key: 'students',
        label: 'Active players',
        value: `${mockDb.students.length}+`,
      },
      {
        key: 'coaches',
        label: 'Professional coaches',
        value: `${mockDb.coaches.length}+`,
      },
      {
        key: 'branches',
        label: 'Training branches',
        value: `${mockDb.branches.length}`,
      },
      { key: 'satisfaction', label: 'Parent satisfaction', value: '94%' },
    ],
  };
}

function mockAboutContent(): PublicAboutContentDto {
  return {
    ...aboutFallback,
    stats: [
      {
        key: 'students',
        label: 'Active players',
        value: `${mockDb.students.length}+`,
        description: 'Children developing through structured academy programs.',
      },
      {
        key: 'coaches',
        label: 'Professional coaches',
        value: `${mockDb.coaches.length}+`,
        description: 'Certified coaches supporting player growth.',
      },
      {
        key: 'branches',
        label: 'Training branches',
        value: `${mockDb.branches.length}`,
        description: 'Accessible training locations for families.',
      },
      {
        key: 'attendance',
        label: 'Attendance rate',
        value: '94%',
        description: 'Consistent participation supported by digital tracking.',
      },
    ],
  };
}

export async function loadPublicHomeContent(): Promise<PublicHomeContentDto> {
  if (USE_MOCK_API) return mockHomeContent();

  try {
    return await getPublicHomeContent();
  } catch {
    return fallback;
  }
}

export async function loadPublicAboutContent(): Promise<PublicAboutContentDto> {
  if (USE_MOCK_API) return mockAboutContent();

  try {
    return await getPublicAboutContent();
  } catch {
    return aboutFallback;
  }
}

export async function loadPublicLoginShowcase(): Promise<
  PublicHomeContentDto['loginShowcase']
> {
  if (USE_MOCK_API) return mockHomeContent().loginShowcase;

  try {
    return await getPublicLoginShowcase();
  } catch {
    return fallback.loginShowcase;
  }
}
const programsFallback: PublicProgramsContentDto = {
  hero: {
    badge: 'Academy Programs',
    title: 'Sports programs built for every age, level, and training goal.',
    description:
      'Explore structured academy programs connected to real program records. Each program can later be managed from the admin dashboard and displayed here automatically.',
    primaryAction: 'Register Your Child',
    secondaryAction: 'Book Free Trial',
  },
  programs: [
    {
      id: 'fallback-football',
      slug: 'football-program',
      title: 'Football Academy',
      description:
        'Structured football training focused on skill development, teamwork, confidence, and match awareness.',
      age: 'Ages 5-16',
      level: 'Beginner to advanced',
      priceMonthly: 850,
      currency: 'AED',
      capacity: 24,
      sportName: 'Football',
    },
    {
      id: 'fallback-swimming',
      slug: 'swimming-program',
      title: 'Swimming Program',
      description:
        'Safe and progressive swimming sessions designed to build water confidence, stamina, and technique.',
      age: 'Ages 4-14',
      level: 'Foundation to advanced',
      priceMonthly: 750,
      currency: 'AED',
      capacity: 16,
      sportName: 'Swimming',
    },
    {
      id: 'fallback-basketball',
      slug: 'basketball-program',
      title: 'Basketball Training',
      description:
        'High-energy basketball training covering shooting, movement, agility, teamwork, and discipline.',
      age: 'Ages 7-17',
      level: 'All levels',
      priceMonthly: 900,
      currency: 'AED',
      capacity: 20,
      sportName: 'Basketball',
    },
  ],
  filters: {
    sports: ['Football', 'Swimming', 'Basketball'],
    levels: ['Beginner to advanced', 'Foundation to advanced', 'All levels'],
  },
  cta: {
    badge: 'Find the right program',
    title: 'Not sure which program fits your child?',
    description:
      'Book a free trial and our academy team will help recommend the best sport, level, branch, and training path.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
};
function mockProgramsContent(): PublicProgramsContentDto {
  const programs = mockDb.programs.map((program) => ({
    id: program.id,
    slug: 'slug' in program && program.slug ? program.slug : program.id,
    title: program.name,
    description: program.description ?? 'Structured academy training program.',
    age:
      program.ageGroupMin !== undefined && program.ageGroupMax !== undefined
        ? `Ages ${program.ageGroupMin}-${program.ageGroupMax}`
        : 'All ages',
    level: 'Beginner to advanced',
    priceMonthly:
      'priceMonthly' in program && typeof program.priceMonthly === 'number'
        ? program.priceMonthly
        : null,
    currency:
      'currency' in program && typeof program.currency === 'string'
        ? program.currency
        : 'AED',
    capacity:
      'capacity' in program && typeof program.capacity === 'number'
        ? program.capacity
        : null,
    sportName: 'Academy Sport',
  }));

  return {
    ...programsFallback,
    programs: programs.length > 0 ? programs : programsFallback.programs,
    filters: {
      sports: ['Academy Sport'],
      levels: ['Beginner to advanced'],
    },
  };
}
export async function loadPublicProgramsContent(): Promise<PublicProgramsContentDto> {
  if (USE_MOCK_API) return mockProgramsContent();

  try {
    return await getPublicProgramsContent();
  } catch {
    return programsFallback;
  }
}
const programDetailsFallback: PublicProgramDetailsContentDto = {
  program: {
    id: 'fallback-football',
    slug: 'football-program',
    title: 'Football Academy',
    description:
      'Structured football training focused on skill development, teamwork, confidence, and match awareness.',
    age: 'Ages 5-16',
    level: 'Beginner to advanced',
    priceMonthly: 850,
    currency: 'AED',
    capacity: 24,
    sportName: 'Football',
  },
  hero: {
    badge: 'Program Details',
    title: 'Football Academy',
    description:
      'A structured training pathway designed to develop technical skills, confidence, teamwork, and match understanding.',
    primaryAction: 'Register Your Child',
    secondaryAction: 'Book Free Trial',
  },
  overview: {
    title: 'What this program focuses on',
    description:
      'Each program page is prepared to load its content from the backend and database while keeping a safe fallback for development.',
    items: [
      {
        id: 'overview-skills',
        title: 'Skill development',
        description:
          'Age-appropriate drills to build technique, movement, coordination, and confidence.',
      },
      {
        id: 'overview-teamwork',
        title: 'Teamwork and discipline',
        description:
          'Group-based training that helps students communicate, cooperate, and respect structure.',
      },
      {
        id: 'overview-progress',
        title: 'Progress tracking',
        description:
          'Attendance, coach notes, and assessments can be connected to the player journey.',
      },
    ],
  },
  pathway: {
    title: 'Player development pathway',
    description:
      'The journey is designed to help each student move from trial and placement into regular training and measurable progress.',
    steps: [
      {
        id: 'step-trial',
        title: 'Trial session',
        description:
          'The student attends a trial so the academy can understand level, comfort, and suitable group placement.',
      },
      {
        id: 'step-placement',
        title: 'Program placement',
        description:
          'The student is assigned to the right program, level, branch, group, and coach.',
      },
      {
        id: 'step-progress',
        title: 'Training and progress',
        description:
          'The coach tracks attendance, development notes, skill assessments, and follow-up actions.',
      },
    ],
  },
  safety: {
    title: 'Safety and family visibility',
    description:
      'The program experience is designed around safe progression, parent communication, and coach accountability.',
    items: [
      {
        id: 'safety-age',
        title: 'Age-appropriate training',
        description:
          'Sessions are structured according to age, ability, and readiness.',
      },
      {
        id: 'safety-attendance',
        title: 'Attendance visibility',
        description:
          'Attendance records help the academy and parents follow consistency.',
      },
      {
        id: 'safety-communication',
        title: 'Clear communication',
        description:
          'Parents, coaches, and administrators can stay aligned through the platform.',
      },
    ],
  },
  relatedPrograms: [],
  cta: {
    badge: 'Start the journey',
    title: 'Ready to choose the right program?',
    description:
      'Register your child or book a free trial and the academy team will help you confirm the best path.',
    primaryAction: 'Register Your Child',
    secondaryAction: 'Book Free Trial',
  },
};

const coachesFallback: PublicCoachesContentDto = {
  hero: {
    badge: 'Academy Coaches',
    title: 'Meet the coaches behind every confident player.',
    description:
      'Explore our coaching team. Coach data is prepared to load from the public API and database while keeping a safe fallback for development.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'View Programs',
  },
  coaches: [
    {
      id: 'fallback-coach-omar',
      slug: 'fallback-coach-omar',
      name: 'Omar Al Mansouri',
      title: 'Head Football Coach',
      bio: 'A youth development coach focused on technique, discipline, teamwork, and confidence.',
      specialties: ['Youth Football', 'Technical Skills', 'Team Development'],
      branches: ['Dubai'],
      programs: ['Football Academy'],
      licenseNumber: 'UAE-COACH-001',
      avatarInitials: 'OM',
    },
    {
      id: 'fallback-coach-lina',
      slug: 'fallback-coach-lina',
      name: 'Lina Hassan',
      title: 'Swimming Coach',
      bio: 'A safety-focused swimming coach helping young athletes build water confidence and stamina.',
      specialties: ['Swimming', 'Water Safety', 'Foundation Training'],
      branches: ['Abu Dhabi'],
      programs: ['Swimming Program'],
      licenseNumber: 'UAE-COACH-002',
      avatarInitials: 'LH',
    },
    {
      id: 'fallback-coach-sami',
      slug: 'fallback-coach-sami',
      name: 'Sami Nasser',
      title: 'Basketball Coach',
      bio: 'A performance-oriented coach focused on movement, shooting, agility, and team play.',
      specialties: ['Basketball', 'Agility', 'Team Play'],
      branches: ['Sharjah'],
      programs: ['Basketball Training'],
      licenseNumber: 'UAE-COACH-003',
      avatarInitials: 'SN',
    },
  ],
  filters: {
    specialties: [
      'Youth Football',
      'Technical Skills',
      'Swimming',
      'Water Safety',
      'Basketball',
      'Agility',
    ],
    branches: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    programs: ['Football Academy', 'Swimming Program', 'Basketball Training'],
  },
  cta: {
    badge: 'Train with confidence',
    title: 'Want to meet the right coach for your child?',
    description:
      'Book a trial and our academy team will recommend the best program, branch, and coach.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
};

const coachProfileFallback: PublicCoachProfileContentDto = {
  coach: coachesFallback.coaches[0],
  hero: {
    badge: 'Coach Profile',
    title: coachesFallback.coaches[0].name,
    description:
      coachesFallback.coaches[0].bio ||
      'Professional academy coach focused on safe, structured player development.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'View Programs',
  },
  credentials: {
    title: 'Coach credentials',
    description:
      'Coach credentials are prepared to load from the database and public API.',
    items: [
      {
        id: 'credential-license',
        label: 'License',
        value: coachesFallback.coaches[0].licenseNumber ?? 'Available on request',
      },
      {
        id: 'credential-specialties',
        label: 'Specialties',
        value: coachesFallback.coaches[0].specialties.join(', '),
      },
      {
        id: 'credential-branches',
        label: 'Branches',
        value: coachesFallback.coaches[0].branches.join(', '),
      },
    ],
  },
  approach: {
    title: 'Coaching approach',
    description:
      'A structured coaching approach focused on safe progress, confidence, discipline, and measurable development.',
    items: [
      {
        id: 'approach-safety',
        title: 'Safe progression',
        description:
          'Training is adapted to the student’s age, ability, readiness, and confidence level.',
      },
      {
        id: 'approach-skills',
        title: 'Skill development',
        description:
          'Sessions focus on technical progress, movement quality, awareness, and consistency.',
      },
      {
        id: 'approach-family',
        title: 'Family communication',
        description:
          'Parents can stay informed through attendance, progress notes, and academy updates.',
      },
    ],
  },
  assignments: {
    title: 'Coach assignments',
    description:
      'Branches, programs, and specialties can be loaded from active database assignments.',
    branches: coachesFallback.coaches[0].branches,
    programs: coachesFallback.coaches[0].programs,
    specialties: coachesFallback.coaches[0].specialties,
  },
  upcomingSessions: [],
  relatedCoaches: coachesFallback.coaches.slice(1, 3),
  cta: {
    badge: 'Meet the right coach',
    title: 'Ready to train with the right academy coach?',
    description:
      'Book a trial and the academy team will recommend the best coach, program, and branch for your child.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
};

function mockCoachProfileContent(coachId: string): PublicCoachProfileContentDto {
  const coachesContent =
    typeof mockCoachesContent === 'function'
      ? mockCoachesContent()
      : coachesFallback;

  const selectedCoach =
    coachesContent.coaches.find(
      (coach) => coach.id === coachId || coach.slug === coachId,
    ) ?? coachesContent.coaches[0] ?? coachProfileFallback.coach;

  return {
    ...coachProfileFallback,
    coach: selectedCoach,
    hero: {
      ...coachProfileFallback.hero,
      title: selectedCoach.name,
      description: selectedCoach.bio,
    },
    credentials: {
      ...coachProfileFallback.credentials,
      items: [
        {
          id: 'credential-title',
          label: 'Role',
          value: selectedCoach.title,
        },
        {
          id: 'credential-license',
          label: 'License',
          value: selectedCoach.licenseNumber ?? 'Available on request',
        },
        {
          id: 'credential-specialties',
          label: 'Specialties',
          value:
            selectedCoach.specialties.length > 0
              ? selectedCoach.specialties.join(', ')
              : 'Player Development',
        },
      ],
    },
    assignments: {
      ...coachProfileFallback.assignments,
      branches: selectedCoach.branches,
      programs: selectedCoach.programs,
      specialties: selectedCoach.specialties,
    },
    relatedCoaches: coachesContent.coaches
      .filter((coach) => coach.id !== selectedCoach.id)
      .slice(0, 3),
  };
}

export async function loadPublicCoachProfileContent(
  coachId: string,
): Promise<PublicCoachProfileContentDto> {
  if (USE_MOCK_API) return mockCoachProfileContent(coachId);

  try {
    return await getPublicCoachProfileContent(coachId);
  } catch {
    return mockCoachProfileContent(coachId);
  }
}

function getInitialsFromName(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase() || 'C';
}

function readString(record: Record<string, unknown>, key: string, fallback = '') {
  const value = record[key];
  return typeof value === 'string' ? value : fallback;
}

function readStringArray(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === 'string');
}

function mockCoachesContent(): PublicCoachesContentDto {
  const coachRecords = mockDb.coaches as unknown as Array<Record<string, unknown>>;

  const coaches: PublicCoachCardDto[] = coachRecords.map((coach, index) => {
    const firstName = readString(coach, 'firstName');
    const lastName = readString(coach, 'lastName');
    const fullName =
      readString(coach, 'name') ||
      readString(coach, 'fullName') ||
      `${firstName} ${lastName}`.trim() ||
      `Coach ${index + 1}`;

    const specialties = readStringArray(coach, 'specialties');

    return {
      id: readString(coach, 'id', `coach-${index}`),
      slug: readString(coach, 'slug') || readString(coach, 'id', `coach-${index}`),
      name: fullName,
      title: readString(coach, 'title', 'Academy Coach'),
      bio:
        readString(coach, 'bio') ||
        'Professional academy coach focused on safe, structured player development.',
      specialties:
        specialties.length > 0 ? specialties : ['Player Development'],
      branches: readStringArray(coach, 'branches'),
      programs: readStringArray(coach, 'programs'),
      licenseNumber: readString(coach, 'licenseNumber') || undefined,
      avatarInitials: getInitialsFromName(fullName),
    };
  });

  const finalCoaches =
    coaches.length > 0 ? coaches : coachesFallback.coaches;

  return {
    ...coachesFallback,
    coaches: finalCoaches,
    filters: {
      specialties: Array.from(
        new Set(finalCoaches.flatMap((coach) => coach.specialties)),
      ),
      branches: Array.from(
        new Set(finalCoaches.flatMap((coach) => coach.branches)),
      ),
      programs: Array.from(
        new Set(finalCoaches.flatMap((coach) => coach.programs)),
      ),
    },
  };
}

export async function loadPublicCoachesContent(): Promise<PublicCoachesContentDto> {
  if (USE_MOCK_API) return mockCoachesContent();

  try {
    return await getPublicCoachesContent();
  } catch {
    return coachesFallback;
  }
}

function mockProgramDetails(programId: string): PublicProgramDetailsContentDto {
  const programsContent =
    typeof mockProgramsContent === 'function'
      ? mockProgramsContent()
      : publicProgramsFallbackContent;

  const selectedProgram =
    programsContent.programs.find(
      (program) => program.id === programId || program.slug === programId,
    ) ?? programsContent.programs[0] ?? programDetailsFallback.program;

  return {
    ...programDetailsFallback,
    program: selectedProgram,
    hero: {
      ...programDetailsFallback.hero,
      title: selectedProgram.title,
      description: selectedProgram.description,
    },
    relatedPrograms: programsContent.programs
      .filter((program) => program.id !== selectedProgram.id)
      .slice(0, 3),
  };
}

const locationsFallback: PublicLocationsContentDto = {
  hero: {
    badge: 'Academy Locations',
    title: 'Find the right AspireX branch for your family.',
    description:
      'Explore active academy branches across the UAE. Location data is prepared to load from the public API and database while keeping a safe fallback for development.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'View Programs',
  },
  locations: [
    {
      id: 'fallback-dubai',
      name: 'AspireX Dubai Branch',
      city: 'Dubai',
      emirate: 'Dubai',
      address: 'Modern training fields near family communities.',
      phone: '+971 50 000 0001',
      email: 'dubai@aspirex.academy',
      programs: ['Football Academy', 'Basketball Training'],
      coaches: ['Omar Al Mansouri'],
      nextSession: 'Sunday - Thursday | 4 PM - 9 PM',
      studentsCount: 120,
      programsCount: 2,
      coachesCount: 4,
      sessionsCount: 18,
    },
    {
      id: 'fallback-abudhabi',
      name: 'AspireX Abu Dhabi Branch',
      city: 'Abu Dhabi',
      emirate: 'Abu Dhabi',
      address: 'Safe training facilities for young athletes and families.',
      phone: '+971 50 000 0002',
      email: 'abudhabi@aspirex.academy',
      programs: ['Swimming Program'],
      coaches: ['Lina Hassan'],
      nextSession: 'Saturday - Wednesday | 5 PM - 10 PM',
      studentsCount: 90,
      programsCount: 1,
      coachesCount: 3,
      sessionsCount: 12,
    },
    {
      id: 'fallback-sharjah',
      name: 'AspireX Sharjah Branch',
      city: 'Sharjah',
      emirate: 'Sharjah',
      address: 'Family-friendly branch for children and beginner players.',
      phone: '+971 50 000 0003',
      email: 'sharjah@aspirex.academy',
      programs: ['Basketball Training', 'Football Academy'],
      coaches: ['Sami Nasser'],
      nextSession: 'Friday - Tuesday | 4 PM - 8 PM',
      studentsCount: 75,
      programsCount: 2,
      coachesCount: 3,
      sessionsCount: 10,
    },
  ],
  filters: {
    cities: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    emirates: ['Dubai', 'Abu Dhabi', 'Sharjah'],
    programs: ['Football Academy', 'Basketball Training', 'Swimming Program'],
  },
  cta: {
    badge: 'Visit a branch',
    title: 'Want help choosing the nearest training location?',
    description:
      'Book a trial and our academy team will recommend the best branch, program, and schedule for your child.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
};

function readLocationString(
  record: Record<string, unknown>,
  key: string,
  fallback = '',
) {
  const value = record[key];

  return typeof value === 'string' ? value : fallback;
}

function mockLocationsContent(): PublicLocationsContentDto {
  const branchRecords =
    mockDb.branches as unknown as Array<Record<string, unknown>>;

  const locations = branchRecords.map((branch, index) => {
    const id = readLocationString(branch, 'id', `branch-${index}`);
    const city = readLocationString(branch, 'city', 'Academy City');
    const name =
      readLocationString(branch, 'name') ||
      readLocationString(branch, 'title') ||
      `AspireX ${city} Branch`;

    return {
      id,
      name,
      city,
      emirate: readLocationString(branch, 'emirate', city),
      address:
        readLocationString(branch, 'address') ||
        readLocationString(branch, 'location') ||
        'Academy training location.',
      phone: readLocationString(branch, 'phone') || undefined,
      email: readLocationString(branch, 'email') || undefined,
      programs: [],
      coaches: [],
      nextSession:
        readLocationString(branch, 'schedule') ||
        'Schedule available on request',
      studentsCount: 0,
      programsCount: 0,
      coachesCount: 0,
      sessionsCount: 0,
    };
  });

  const finalLocations =
    locations.length > 0 ? locations : locationsFallback.locations;

  return {
    ...locationsFallback,
    locations: finalLocations,
    filters: {
      cities: Array.from(new Set(finalLocations.map((item) => item.city))),
      emirates: Array.from(new Set(finalLocations.map((item) => item.emirate))),
      programs: Array.from(
        new Set(finalLocations.flatMap((item) => item.programs)),
      ),
    },
  };
}

export async function loadPublicLocationsContent(): Promise<PublicLocationsContentDto> {
  if (USE_MOCK_API) return mockLocationsContent();

  try {
    return await getPublicLocationsContent();
  } catch {
    return locationsFallback;
  }
}

export async function loadPublicProgramDetails(
  programId: string,
): Promise<PublicProgramDetailsContentDto> {
  if (USE_MOCK_API) return mockProgramDetails(programId);

  try {
    return await getPublicProgramDetails(programId);
  } catch {
    return mockProgramDetails(programId);
  }
}

const pricingFallback: PublicPricingContentDto = {
  hero: {
    badge: 'Academy Pricing',
    title: 'Simple monthly pricing for structured sports programs.',
    description:
      'Explore program pricing prepared to load from active database program records. Prices can later be managed from the admin program module.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
  plans: [
    {
      id: 'fallback-football-pricing',
      slug: 'football-program',
      title: 'Football Academy',
      description:
        'Structured football training focused on skill development, confidence, teamwork, and match awareness.',
      sportName: 'Football',
      age: 'Ages 5-16',
      level: 'Beginner to advanced',
      priceMonthly: 850,
      currency: 'AED',
      capacity: 24,
      branchesCount: 2,
      sessionsCount: 8,
      highlighted: true,
      features: [
        'Monthly academy access',
        'Coach-led training sessions',
        'Attendance tracking',
        'Progress follow-up',
      ],
    },
    {
      id: 'fallback-swimming-pricing',
      slug: 'swimming-program',
      title: 'Swimming Program',
      description:
        'Safe and progressive swimming sessions designed to build water confidence, stamina, and technique.',
      sportName: 'Swimming',
      age: 'Ages 4-14',
      level: 'Foundation to advanced',
      priceMonthly: 750,
      currency: 'AED',
      capacity: 16,
      branchesCount: 1,
      sessionsCount: 6,
      highlighted: false,
      features: [
        'Safety-focused sessions',
        'Foundation technique',
        'Small group capacity',
        'Parent visibility',
      ],
    },
    {
      id: 'fallback-basketball-pricing',
      slug: 'basketball-program',
      title: 'Basketball Training',
      description:
        'High-energy basketball training covering shooting, movement, agility, teamwork, and discipline.',
      sportName: 'Basketball',
      age: 'Ages 7-17',
      level: 'All levels',
      priceMonthly: 900,
      currency: 'AED',
      capacity: 20,
      branchesCount: 1,
      sessionsCount: 6,
      highlighted: false,
      features: [
        'Skill-based training',
        'Agility and movement',
        'Team play development',
        'Coach feedback',
      ],
    },
  ],
  filters: {
    sports: ['Football', 'Swimming', 'Basketball'],
    levels: ['Beginner to advanced', 'Foundation to advanced', 'All levels'],
  },
  notes: {
    title: 'Pricing notes',
    items: [
      'Prices are shown as monthly academy program fees.',
      'Final availability may depend on branch, age group, and schedule.',
      'Registration, uniforms, or special camp fees can be handled separately later.',
    ],
  },
  cta: {
    badge: 'Need guidance?',
    title: 'Not sure which plan fits your child?',
    description:
      'Book a free trial and our team will recommend the best program, branch, and schedule.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
};

function mockPricingContent(): PublicPricingContentDto {
  const programsContent =
    typeof mockProgramsContent === 'function'
      ? mockProgramsContent()
      : publicProgramsFallbackContent;

  const plans = programsContent.programs.map((program, index) => ({
    id: program.id,
    slug: program.slug,
    title: program.title,
    description: program.description,
    sportName: program.sportName,
    age: program.age,
    level: program.level,
    priceMonthly: program.priceMonthly,
    currency: program.currency,
    capacity: program.capacity,
    branchesCount: 0,
    sessionsCount: 0,
    highlighted: index === 0,
    features: [
      'Structured academy program',
      'Coach-led sessions',
      'Attendance tracking',
      'Progress follow-up',
    ],
  }));

  const finalPlans = plans.length > 0 ? plans : pricingFallback.plans;

  return {
    ...pricingFallback,
    plans: finalPlans,
    filters: {
      sports: Array.from(new Set(finalPlans.map((plan) => plan.sportName))),
      levels: Array.from(new Set(finalPlans.map((plan) => plan.level))),
    },
  };
}

export async function loadPublicPricingContent(): Promise<PublicPricingContentDto> {
  if (USE_MOCK_API) return mockPricingContent();

  try {
    return await getPublicPricingContent();
  } catch {
    return pricingFallback;
  }
}

const offersFallback: PublicOffersContentDto = {
  hero: {
    badge: 'Current Offers',
    title: 'Limited-time academy offers for new and returning families.',
    description:
      'Explore seasonal offers prepared to load from the public API. Until a dedicated offers table is added, offers can be generated from active program records.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'View Programs',
  },
  offers: [
    {
      id: 'fallback-football-offer',
      slug: 'football-academy-offer',
      title: '25% off Football Academy',
      description:
        'A limited offer for structured football training focused on confidence, teamwork, and skill development.',
      programTitle: 'Football Academy',
      programSlug: 'football-program',
      sportName: 'Football',
      age: 'Ages 5-16',
      level: 'Beginner to advanced',
      originalPrice: 850,
      offerPrice: 637.5,
      currency: 'AED',
      discountPercent: 25,
      tag: '25% OFF',
      startsAt: new Date().toISOString().slice(0, 10),
      endsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      highlighted: true,
      features: [
        'Limited-time monthly discount',
        'Coach-led training sessions',
        'Attendance tracking',
        'Progress follow-up',
      ],
    },
    {
      id: 'fallback-swimming-offer',
      slug: 'swimming-program-offer',
      title: '15% off Swimming Program',
      description:
        'A safety-focused offer for children starting or improving their swimming journey.',
      programTitle: 'Swimming Program',
      programSlug: 'swimming-program',
      sportName: 'Swimming',
      age: 'Ages 4-14',
      level: 'Foundation to advanced',
      originalPrice: 750,
      offerPrice: 637.5,
      currency: 'AED',
      discountPercent: 15,
      tag: '15% OFF',
      startsAt: new Date().toISOString().slice(0, 10),
      endsAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      highlighted: false,
      features: [
        'Safety-focused sessions',
        'Small group capacity',
        'Water confidence development',
        'Parent visibility',
      ],
    },
    {
      id: 'fallback-basketball-offer',
      slug: 'basketball-training-offer',
      title: '10% off Basketball Training',
      description:
        'A focused offer for young athletes building agility, discipline, movement, and teamwork.',
      programTitle: 'Basketball Training',
      programSlug: 'basketball-program',
      sportName: 'Basketball',
      age: 'Ages 7-17',
      level: 'All levels',
      originalPrice: 900,
      offerPrice: 810,
      currency: 'AED',
      discountPercent: 10,
      tag: '10% OFF',
      startsAt: new Date().toISOString().slice(0, 10),
      endsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      highlighted: false,
      features: [
        'Skill-based sessions',
        'Agility and movement',
        'Team play development',
        'Coach feedback',
      ],
    },
  ],
  filters: {
    sports: ['Football', 'Swimming', 'Basketball'],
    discounts: ['25% OFF', '15% OFF', '10% OFF'],
  },
  notes: {
    title: 'Offer notes',
    items: [
      'Offers are currently generated from active programs until a dedicated offers/coupons table is added.',
      'Final availability may depend on branch, age group, schedule, and capacity.',
      'Admin-managed coupons can be introduced later without changing the public page structure.',
    ],
  },
  cta: {
    badge: 'Claim an offer',
    title: 'Want help choosing the best offer?',
    description:
      'Book a free trial and our academy team will guide you to the right program and available promotion.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
};

function calculateOfferPrice(
  originalPrice: number | null,
  discountPercent: number,
) {
  if (originalPrice === null) {
    return null;
  }

  return Number((originalPrice * (1 - discountPercent / 100)).toFixed(2));
}

function mockOffersContent(): PublicOffersContentDto {
  const programsContent =
    typeof mockProgramsContent === 'function'
      ? mockProgramsContent()
      : publicProgramsFallbackContent;

  const discounts = [25, 15, 10, 20];

  const offers = programsContent.programs.map((program, index) => {
    const discountPercent = discounts[index % discounts.length];

    return {
      id: `${program.id}-offer`,
      slug: `${program.slug}-offer`,
      title: `${discountPercent}% off ${program.title}`,
      description: program.description,
      programTitle: program.title,
      programSlug: program.slug,
      sportName: program.sportName,
      age: program.age,
      level: program.level,
      originalPrice: program.priceMonthly,
      offerPrice: calculateOfferPrice(program.priceMonthly, discountPercent),
      currency: program.currency,
      discountPercent,
      tag: `${discountPercent}% OFF`,
      startsAt: new Date().toISOString().slice(0, 10),
      endsAt: new Date(Date.now() + (14 - index) * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      highlighted: index === 0,
      features: [
        'Limited-time academy offer',
        'Coach-led training sessions',
        'Attendance tracking',
        'Progress follow-up',
      ],
    };
  });

  const finalOffers = offers.length > 0 ? offers : offersFallback.offers;

  return {
    ...offersFallback,
    offers: finalOffers,
    filters: {
      sports: Array.from(new Set(finalOffers.map((offer) => offer.sportName))),
      discounts: Array.from(new Set(finalOffers.map((offer) => offer.tag))),
    },
  };
}

export async function loadPublicOffersContent(): Promise<PublicOffersContentDto> {
  if (USE_MOCK_API) return mockOffersContent();

  try {
    return await getPublicOffersContent();
  } catch {
    return offersFallback;
  }
}

const galleryFallback: PublicGalleryContentDto = {
  hero: {
    badge: 'Academy Gallery',
    title: 'Photos and videos from training, programs, coaches, and branches.',
    description:
      'Explore a visual academy gallery prepared for images and videos. The page is database-ready and can later connect to a dedicated CMS/gallery media table.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'View Programs',
  },
  items: [
    {
      id: 'gallery-training-image',
      title: 'Team training session',
      description:
        'A photo space for active training sessions, teamwork, and player development.',
      category: 'Training',
      mediaType: 'image',
      sourceType: 'academy',
      tags: ['Training', 'Teamwork', 'Youth Sports'],
      featured: true,
    },
    {
      id: 'gallery-skills-video',
      title: 'Skill development video',
      description:
        'A video space for drills, technical development, and coaching highlights.',
      category: 'Videos',
      mediaType: 'video',
      sourceType: 'academy',
      tags: ['Video', 'Skills', 'Coaching'],
      featured: true,
    },
    {
      id: 'gallery-branch-image',
      title: 'Branch facilities',
      description:
        'A photo space for branch facilities, safe training areas, and family-friendly locations.',
      category: 'Branches',
      mediaType: 'image',
      sourceType: 'branch',
      tags: ['Branches', 'Facilities', 'Safety'],
      featured: false,
    },
    {
      id: 'gallery-coach-video',
      title: 'Coach introduction video',
      description:
        'A video space for coach introductions, training philosophy, and academy values.',
      category: 'Coaches',
      mediaType: 'video',
      sourceType: 'coach',
      tags: ['Coaches', 'Video', 'Academy Values'],
      featured: false,
    },
  ],
  filters: {
    categories: ['Training', 'Videos', 'Branches', 'Coaches'],
    mediaTypes: ['image', 'video'],
    tags: [
      'Training',
      'Teamwork',
      'Youth Sports',
      'Video',
      'Skills',
      'Coaching',
      'Branches',
      'Facilities',
      'Safety',
      'Coaches',
      'Academy Values',
    ],
  },
  cta: {
    badge: 'Experience the academy',
    title: 'Want your child to be part of the next gallery moment?',
    description:
      'Book a free trial and let your child experience a structured, safe, and inspiring sports academy.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
};

function readGalleryString(
  record: Record<string, unknown>,
  key: string,
  fallback = '',
) {
  const value = record[key];

  return typeof value === 'string' ? value : fallback;
}

function mockGalleryContent(): PublicGalleryContentDto {
  const programRecords =
    mockDb.programs as unknown as Array<Record<string, unknown>>;
  const branchRecords =
    mockDb.branches as unknown as Array<Record<string, unknown>>;
  const coachRecords =
    mockDb.coaches as unknown as Array<Record<string, unknown>>;

  const programItems: PublicGalleryMediaItemDto[] = programRecords
    .slice(0, 4)
    .map((program, index) => {
      const id = readGalleryString(program, 'id', `program-gallery-${index}`);
      const name = readGalleryString(program, 'name', `Program ${index + 1}`);
      const description =
        readGalleryString(program, 'description') ||
        'Program media placeholder for photos and videos.';

      return {
        id: `${id}-gallery`,
        title: `${name} highlights`,
        description,
        category: 'Programs',
        mediaType: index % 2 === 0 ? 'image' : 'video',
        sourceType: 'program',
        sourceId: id,
        tags: ['Programs', name, index % 2 === 0 ? 'Photo' : 'Video'],
        featured: index === 0,
      };
    });

  const branchItems: PublicGalleryMediaItemDto[] = branchRecords
    .slice(0, 3)
    .map((branch, index) => {
      const id = readGalleryString(branch, 'id', `branch-gallery-${index}`);
      const city = readGalleryString(branch, 'city', 'Academy Branch');
      const name =
        readGalleryString(branch, 'name') || `AspireX ${city} Branch`;

      return {
        id: `${id}-gallery`,
        title: `${name} facilities`,
        description:
          'Branch media placeholder for facilities, training areas, and academy environment.',
        category: 'Branches',
        mediaType: 'image',
        sourceType: 'branch',
        sourceId: id,
        tags: ['Branches', city, 'Facilities'],
        featured: false,
      };
    });

  const coachItems: PublicGalleryMediaItemDto[] = coachRecords
    .slice(0, 3)
    .map((coach, index) => {
      const id = readGalleryString(coach, 'id', `coach-gallery-${index}`);
      const firstName = readGalleryString(coach, 'firstName');
      const lastName = readGalleryString(coach, 'lastName');
      const name =
        readGalleryString(coach, 'name') ||
        readGalleryString(coach, 'fullName') ||
        `${firstName} ${lastName}`.trim() ||
        `Coach ${index + 1}`;

      return {
        id: `${id}-gallery`,
        title: `${name} coaching moment`,
        description:
          'Coach media placeholder for introduction videos, training clips, and coaching moments.',
        category: 'Coaches',
        mediaType: index % 2 === 0 ? 'video' : 'image',
        sourceType: 'coach',
        sourceId: id,
        tags: ['Coaches', name, index % 2 === 0 ? 'Video' : 'Photo'],
        featured: false,
      };
    });

  const items = [...programItems, ...branchItems, ...coachItems];

  const finalItems = items.length > 0 ? items : galleryFallback.items;

  return {
    ...galleryFallback,
    items: finalItems,
    filters: {
      categories: Array.from(new Set(finalItems.map((item) => item.category))),
      mediaTypes: Array.from(
        new Set(finalItems.map((item) => item.mediaType)),
      ),
      tags: Array.from(new Set(finalItems.flatMap((item) => item.tags))),
    },
  };
}

export async function loadPublicGalleryContent(): Promise<PublicGalleryContentDto> {
  if (USE_MOCK_API) return mockGalleryContent();

  try {
    return await getPublicGalleryContent();
  } catch {
    return galleryFallback;
  }
}


const eventsFallback: PublicEventsContentDto = {
  hero: {
    badge: 'Academy Events',
    title: 'Upcoming sessions, trials, and academy activities.',
    description:
      'Explore upcoming academy events and scheduled sessions. This page is prepared to load from schedule records now, and from a dedicated events table later.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'View Programs',
  },
  events: [
    {
      id: 'fallback-football-trial',
      slug: 'football-trial-session',
      title: 'Football Trial Session',
      description:
        'A trial session for young players to experience structured football coaching and group training.',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      time: '04:00 PM - 05:30 PM',
      branch: 'AspireX Dubai Branch',
      city: 'Dubai',
      program: 'Football Academy',
      sportName: 'Football',
      coachName: 'Omar Al Mansouri',
      capacity: 24,
      status: 'SCHEDULED',
      category: 'Trial Session',
      tag: 'Upcoming',
      featured: true,
    },
    {
      id: 'fallback-swimming-session',
      slug: 'swimming-foundation-session',
      title: 'Swimming Foundation Session',
      description:
        'A safety-focused session for children building water confidence and basic swimming technique.',
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      time: '05:00 PM - 06:00 PM',
      branch: 'AspireX Abu Dhabi Branch',
      city: 'Abu Dhabi',
      program: 'Swimming Program',
      sportName: 'Swimming',
      coachName: 'Lina Hassan',
      capacity: 16,
      status: 'SCHEDULED',
      category: 'Training Session',
      tag: 'Limited Seats',
      featured: false,
    },
    {
      id: 'fallback-basketball-session',
      slug: 'basketball-skills-session',
      title: 'Basketball Skills Session',
      description:
        'A high-energy session focused on movement, shooting, agility, and team play.',
      date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      time: '06:00 PM - 07:30 PM',
      branch: 'AspireX Sharjah Branch',
      city: 'Sharjah',
      program: 'Basketball Training',
      sportName: 'Basketball',
      coachName: 'Sami Nasser',
      capacity: 20,
      status: 'SCHEDULED',
      category: 'Training Session',
      tag: 'Upcoming',
      featured: false,
    },
  ],
  filters: {
    branches: [
      'AspireX Dubai Branch',
      'AspireX Abu Dhabi Branch',
      'AspireX Sharjah Branch',
    ],
    programs: ['Football Academy', 'Swimming Program', 'Basketball Training'],
    statuses: ['SCHEDULED'],
    categories: ['Trial Session', 'Training Session'],
  },
  cta: {
    badge: 'Join an event',
    title: 'Want to attend an upcoming trial or training session?',
    description:
      'Book a trial and our academy team will help you choose the right session, program, branch, and coach.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
};

const eventDetailsFallback: PublicEventDetailsContentDto = {
  event: eventsFallback.events[0],
  hero: {
    badge: 'Event Details',
    title: eventsFallback.events[0].title,
    description: eventsFallback.events[0].description,
    primaryAction: 'Book Free Trial',
    secondaryAction: 'View Programs',
  },
  overview: {
    title: 'Event overview',
    description:
      'This page is prepared to load event details from the public API and schedule records.',
    items: [
      {
        id: 'overview-program',
        title: 'Program-based event',
        description:
          'The event is connected to an academy program and suitable training pathway.',
      },
      {
        id: 'overview-coach',
        title: 'Coach-led session',
        description:
          'The session is led by an assigned academy coach with structured objectives.',
      },
      {
        id: 'overview-family',
        title: 'Family-friendly experience',
        description:
          'Families can review time, branch, program, coach, and capacity before booking.',
      },
    ],
  },
  logistics: {
    title: 'Event logistics',
    description:
      'Important operational details for attending the session or trial.',
    items: [
      {
        id: 'logistics-date',
        title: 'Date and time',
        description: `${eventsFallback.events[0].date} · ${eventsFallback.events[0].time}`,
      },
      {
        id: 'logistics-branch',
        title: 'Branch',
        description: `${eventsFallback.events[0].branch}, ${eventsFallback.events[0].city}`,
      },
      {
        id: 'logistics-capacity',
        title: 'Capacity',
        description: `${eventsFallback.events[0].capacity} available seats`,
      },
    ],
  },
  whatToExpect: {
    title: 'What to expect',
    description:
      'A clear, safe, and structured session designed for young athletes.',
    items: [
      {
        id: 'expect-arrival',
        title: 'Arrival and check-in',
        description:
          'Families arrive before the session and confirm the child’s assigned activity.',
      },
      {
        id: 'expect-training',
        title: 'Structured training',
        description:
          'The coach leads warm-up, drills, skill work, and group activities.',
      },
      {
        id: 'expect-followup',
        title: 'Follow-up guidance',
        description:
          'The academy can recommend the best next program, branch, and group placement.',
      },
    ],
  },
  relatedEvents: eventsFallback.events.slice(1, 3),
  cta: {
    badge: 'Join this event',
    title: 'Ready to attend this academy session?',
    description:
      'Book a free trial and our team will help confirm the right program and schedule.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
};

function mockEventDetails(eventId: string): PublicEventDetailsContentDto {
  const eventsContent =
    typeof mockEventsContent === 'function'
      ? mockEventsContent()
      : eventsFallback;

  const selectedEvent =
    eventsContent.events.find(
      (event) => event.id === eventId || event.slug === eventId,
    ) ?? eventsContent.events[0] ?? eventDetailsFallback.event;

  return {
    ...eventDetailsFallback,
    event: selectedEvent,
    hero: {
      ...eventDetailsFallback.hero,
      title: selectedEvent.title,
      description: selectedEvent.description,
    },
    logistics: {
      ...eventDetailsFallback.logistics,
      items: [
        {
          id: 'logistics-date',
          title: 'Date and time',
          description: `${selectedEvent.date} · ${selectedEvent.time}`,
        },
        {
          id: 'logistics-branch',
          title: 'Branch',
          description: `${selectedEvent.branch}, ${selectedEvent.city}`,
        },
        {
          id: 'logistics-capacity',
          title: 'Capacity',
          description: `${selectedEvent.capacity} available seats`,
        },
      ],
    },
    relatedEvents: eventsContent.events
      .filter((event) => event.id !== selectedEvent.id)
      .slice(0, 3),
    cta: {
      ...eventDetailsFallback.cta,
      title: `Ready to attend ${selectedEvent.title}?`,
    },
  };
}

export async function loadPublicEventDetails(
  eventId: string,
): Promise<PublicEventDetailsContentDto> {
  if (USE_MOCK_API) return mockEventDetails(eventId);

  try {
    return await getPublicEventDetails(eventId);
  } catch {
    return mockEventDetails(eventId);
  }
}

function mockEventsContent(): PublicEventsContentDto {
  return eventsFallback;
}

export async function loadPublicEventsContent(): Promise<PublicEventsContentDto> {
  if (USE_MOCK_API) return mockEventsContent();

  try {
    return await getPublicEventsContent();
  } catch {
    return eventsFallback;
  }
}

const blogFallback: PublicBlogContentDto = {
  hero: {
    badge: 'Academy Blog',
    title: 'Insights for parents, young athletes, and academy families.',
    description:
      'Explore practical academy articles about programs, coaches, branches, training safety, and child development. The page is prepared to connect later to a dedicated CMS/blog table.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'View Programs',
  },
  posts: [
    {
      id: 'fallback-program-post',
      slug: 'how-to-choose-the-right-sports-program',
      title: 'How to choose the right sports program for your child',
      excerpt:
        'A simple guide for parents comparing age group, level, branch location, coach fit, and training goals.',
      category: 'Programs',
      authorName: 'AspireX Team',
      publishedAt: new Date().toISOString().slice(0, 10),
      readTime: '4 min read',
      sourceType: 'program',
      sourceId: 'fallback-football',
      tags: ['Programs', 'Parents', 'Youth Sports'],
      featured: true,
    },
    {
      id: 'fallback-coach-post',
      slug: 'what-makes-a-good-youth-coach',
      title: 'What makes a good youth sports coach?',
      excerpt:
        'A practical look at communication, safe progression, discipline, confidence building, and player development.',
      category: 'Coaching',
      authorName: 'AspireX Team',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      readTime: '5 min read',
      sourceType: 'coach',
      sourceId: 'fallback-coach-omar',
      tags: ['Coaches', 'Development', 'Safety'],
      featured: false,
    },
    {
      id: 'fallback-branch-post',
      slug: 'why-branch-location-matters',
      title: 'Why branch location matters for consistent training',
      excerpt:
        'Families are more consistent when branch access, timing, facilities, and communication are simple.',
      category: 'Branches',
      authorName: 'AspireX Team',
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      readTime: '3 min read',
      sourceType: 'branch',
      sourceId: 'fallback-dubai',
      tags: ['Branches', 'Families', 'Attendance'],
      featured: false,
    },
  ],
  filters: {
    categories: ['Programs', 'Coaching', 'Branches'],
    sourceTypes: ['program', 'coach', 'branch', 'academy'],
    tags: [
      'Programs',
      'Parents',
      'Youth Sports',
      'Coaches',
      'Development',
      'Safety',
      'Branches',
      'Families',
      'Attendance',
    ],
  },
  cta: {
    badge: 'Learn and start',
    title: 'Ready to turn insight into action?',
    description:
      'Book a free trial and let our academy team help you choose the right program, branch, and coach.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
};

const blogPostFallback: PublicBlogPostContentDto = {
  post: blogFallback.posts[0],
  hero: {
    badge: 'Academy Article',
    title: blogFallback.posts[0].title,
    description: blogFallback.posts[0].excerpt,
    primaryAction: 'Book Free Trial',
    secondaryAction: 'View Programs',
  },
  article: {
    intro:
      'This article is prepared to load from the public API. Until a dedicated CMS/blog table is added, article pages can be generated from academy records.',
    sections: [
      {
        id: 'section-context',
        title: 'Why this topic matters',
        body: [
          'Parents need clear and practical information before choosing a program, coach, or branch.',
          'A structured academy experience should make training decisions easier, safer, and more transparent.',
        ],
      },
      {
        id: 'section-how-to-use',
        title: 'How families can use this information',
        body: [
          'Start by comparing the child’s age, current level, training goal, and preferred branch location.',
          'Then use a trial session to confirm the best program fit with the academy team.',
        ],
      },
      {
        id: 'section-platform',
        title: 'How the platform supports the journey',
        body: [
          'The public website helps families explore programs, coaches, locations, pricing, events, and academy updates.',
          'The parent portal can later support attendance, progress, payments, documents, and communication.',
        ],
      },
    ],
    conclusion:
      'The best academy decision is usually the one that combines the right program, a suitable coach, a convenient branch, and consistent follow-up.',
  },
  relatedPosts: blogFallback.posts.slice(1, 3),
  cta: {
    badge: 'Start with confidence',
    title: 'Ready to choose the right academy path?',
    description:
      'Book a free trial and let the academy team guide you to the right program, branch, and coach.',
    primaryAction: 'Book Free Trial',
    secondaryAction: 'Register Your Child',
  },
};

function mockBlogPostContent(postId: string): PublicBlogPostContentDto {
  const blogContent =
    typeof mockBlogContent === 'function' ? mockBlogContent() : blogFallback;

  const selectedPost =
    blogContent.posts.find(
      (post) => post.id === postId || post.slug === postId,
    ) ?? blogContent.posts[0] ?? blogPostFallback.post;

  return {
    ...blogPostFallback,
    post: selectedPost,
    hero: {
      ...blogPostFallback.hero,
      title: selectedPost.title,
      description: selectedPost.excerpt,
    },
    article: {
      ...blogPostFallback.article,
      intro: selectedPost.excerpt,
      sections: [
        {
          id: 'section-overview',
          title: `Understanding ${selectedPost.category.toLowerCase()}`,
          body: [
            selectedPost.excerpt,
            'This article is generated from academy data now, and can later be replaced by full CMS-managed content.',
          ],
        },
        {
          id: 'section-practical',
          title: 'Practical guidance for families',
          body: [
            'Look at the child’s age, confidence, previous experience, schedule, and training goal.',
            'Use the trial process to confirm the right group, coach, and branch.',
          ],
        },
        {
          id: 'section-next-step',
          title: 'Recommended next step',
          body: [
            'Explore the related program, coach, or branch connected to this topic.',
            'Then book a trial or complete registration when the family is ready.',
          ],
        },
      ],
    },
    relatedPosts: blogContent.posts
      .filter((post) => post.id !== selectedPost.id)
      .slice(0, 3),
    cta: {
      ...blogPostFallback.cta,
      title: `Ready to act on "${selectedPost.title}"?`,
    },
  };
}

export async function loadPublicBlogPostContent(
  postId: string,
): Promise<PublicBlogPostContentDto> {
  if (USE_MOCK_API) return mockBlogPostContent(postId);

  try {
    return await getPublicBlogPostContent(postId);
  } catch {
    return mockBlogPostContent(postId);
  }
}

function readBlogString(
  record: Record<string, unknown>,
  key: string,
  fallback = '',
) {
  const value = record[key];

  return typeof value === 'string' ? value : fallback;
}

function makeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function mockBlogContent(): PublicBlogContentDto {
  const programRecords =
    mockDb.programs as unknown as Array<Record<string, unknown>>;
  const branchRecords =
    mockDb.branches as unknown as Array<Record<string, unknown>>;
  const coachRecords =
    mockDb.coaches as unknown as Array<Record<string, unknown>>;

  const programPosts: PublicBlogPostCardDto[] = programRecords
    .slice(0, 4)
    .map((program, index) => {
      const id = readBlogString(program, 'id', `program-post-${index}`);
      const name = readBlogString(program, 'name', `Program ${index + 1}`);
      const description =
        readBlogString(program, 'description') ||
        'A structured academy program designed for safe and consistent player development.';

      return {
        id: `${id}-blog`,
        slug: makeSlug(`${name} guide`),
        title: `A parent guide to ${name}`,
        excerpt: description,
        category: 'Programs',
        authorName: 'AspireX Team',
        publishedAt: new Date(Date.now() - index * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
        readTime: `${4 + index} min read`,
        sourceType: 'program',
        sourceId: id,
        tags: ['Programs', name, 'Youth Sports'],
        featured: index === 0,
      };
    });

  const coachPosts: PublicBlogPostCardDto[] = coachRecords
    .slice(0, 3)
    .map((coach, index) => {
      const id = readBlogString(coach, 'id', `coach-post-${index}`);
      const firstName = readBlogString(coach, 'firstName');
      const lastName = readBlogString(coach, 'lastName');
      const name =
        readBlogString(coach, 'name') ||
        readBlogString(coach, 'fullName') ||
        `${firstName} ${lastName}`.trim() ||
        `Coach ${index + 1}`;

      return {
        id: `${id}-blog`,
        slug: makeSlug(`${name} coaching approach`),
        title: `${name}: coaching approach and player development`,
        excerpt:
          'A look at safe progression, confidence building, communication, and structured youth training.',
        category: 'Coaching',
        authorName: 'AspireX Team',
        publishedAt: new Date(Date.now() - (index + 4) * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
        readTime: '5 min read',
        sourceType: 'coach',
        sourceId: id,
        tags: ['Coaches', name, 'Development'],
        featured: false,
      };
    });

  const branchPosts: PublicBlogPostCardDto[] = branchRecords
    .slice(0, 3)
    .map((branch, index) => {
      const id = readBlogString(branch, 'id', `branch-post-${index}`);
      const city = readBlogString(branch, 'city', 'Academy Branch');
      const name =
        readBlogString(branch, 'name') || `AspireX ${city} Branch`;

      return {
        id: `${id}-blog`,
        slug: makeSlug(`${name} branch guide`),
        title: `Inside ${name}`,
        excerpt:
          'A family-focused guide to branch location, training environment, schedules, and academy experience.',
        category: 'Branches',
        authorName: 'AspireX Team',
        publishedAt: new Date(Date.now() - (index + 8) * 24 * 60 * 60 * 1000)
          .toISOString()
          .slice(0, 10),
        readTime: '3 min read',
        sourceType: 'branch',
        sourceId: id,
        tags: ['Branches', city, 'Families'],
        featured: false,
      };
    });

  const posts = [...programPosts, ...coachPosts, ...branchPosts];

  const finalPosts = posts.length > 0 ? posts : blogFallback.posts;

  return {
    ...blogFallback,
    posts: finalPosts,
    filters: {
      categories: Array.from(new Set(finalPosts.map((post) => post.category))),
      sourceTypes: Array.from(
        new Set(finalPosts.map((post) => post.sourceType)),
      ),
      tags: Array.from(new Set(finalPosts.flatMap((post) => post.tags))),
    },
  };
}

export async function loadPublicBlogContent(): Promise<PublicBlogContentDto> {
  if (USE_MOCK_API) return mockBlogContent();

  try {
    return await getPublicBlogContent();
  } catch {
    return blogFallback;
  }
}

export const publicFallbackContent = fallback;
export const publicAboutFallbackContent = aboutFallback;
export const publicProgramsFallbackContent = programsFallback;
export const publicProgramDetailsFallbackContent = programDetailsFallback;
export const publicCoachesFallbackContent = coachesFallback;
export const publicCoachProfileFallbackContent = coachProfileFallback;
export const publicLocationsFallbackContent = locationsFallback;
export const publicPricingFallbackContent = pricingFallback;
export const publicOffersFallbackContent = offersFallback;
export const publicGalleryFallbackContent = galleryFallback;
export const publicEventsFallbackContent = eventsFallback;
export const publicEventDetailsFallbackContent = eventDetailsFallback;
export const publicBlogFallbackContent = blogFallback;
export const publicBlogPostFallbackContent = blogPostFallback;
import { prisma } from '../../db/prisma.js';

const GALLERY_FALLBACK = [
  { id: 'gallery-1', title: 'Team training', subtitle: 'Team spirit and discipline', image: '' },
  { id: 'gallery-2', title: 'Skill development', subtitle: 'Progressive sessions', image: '' },
  { id: 'gallery-3', title: 'Professional sessions', subtitle: 'Structured coaching plans', image: '' },
  { id: 'gallery-4', title: 'Safe environment', subtitle: 'Family-focused academy experience', image: '' },
];

const LOGIN_FEATURES_FALLBACK = [
  { id: 'f-kpi', title: 'KPI dashboards' },
  { id: 'f-ops', title: 'Academy operations' },
  { id: 'f-attendance', title: 'Attendance tracking' },
];

function notDeleted() {
  return { deletedAt: null };
}

async function getAttendanceRate() {
  const [total, presentLike] = await Promise.all([
    prisma.attendanceRecord.count({ where: notDeleted() }),
    prisma.attendanceRecord.count({
      where: {
        ...notDeleted(),
        status: { in: ['PRESENT', 'LATE', 'EXCUSED'] },
      },
    }),
  ]);

  if (total === 0) return 0;
  return Math.round((presentLike / total) * 100);
}

export async function getAcademySummary() {
  const [students, coaches, branches, programs, todaySessions, pendingInvoices, attendanceRate] =
    await Promise.all([
      prisma.student.count({ where: notDeleted() }),
      prisma.coach.count({ where: notDeleted() }),
      prisma.branch.count({ where: notDeleted() }),
      prisma.program.count({ where: notDeleted() }),
      prisma.scheduleSession.count({
        where: {
          ...notDeleted(),
          startAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
      prisma.invoice.count({
        where: {
          ...notDeleted(),
          status: { in: ['SENT', 'ISSUED', 'PARTIALLY_PAID', 'OVERDUE'] },
        },
      }),
      getAttendanceRate(),
    ]);

  return {
    totalActiveStudents: students,
    totalCoaches: coaches,
    totalBranches: branches,
    totalPrograms: programs,
    attendanceRate,
    parentSatisfaction: 94,
    todaySessions,
    pendingPayments: pendingInvoices,
  };
}

export async function getPublicHome() {
  const [summary, programs, branches] = await Promise.all([
    getAcademySummary(),
    prisma.program.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        ageGroupMin: true,
        ageGroupMax: true,
      },
    }),
    prisma.branch.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: { id: true, city: true, address: true },
    }),
  ]);

  return {
    kpis: [
      { key: 'students', label: 'Active players', value: String(summary.totalActiveStudents) },
      { key: 'coaches', label: 'Professional coaches', value: String(summary.totalCoaches) },
      { key: 'branches', label: 'Training branches', value: String(summary.totalBranches) },
      { key: 'satisfaction', label: 'Parent satisfaction', value: `${summary.parentSatisfaction}%` },
    ],
    programs: programs.map((item) => ({
      id: item.id,
      title: item.name,
      description: item.description ?? '',
      age:
        item.ageGroupMin !== null && item.ageGroupMax !== null
          ? `Ages ${item.ageGroupMin}-${item.ageGroupMax}`
          : 'All ages',
      level: 'Beginner to advanced',
    })),
    branches: branches.map((item) => ({
      id: item.id,
      city: item.city,
      location: item.address,
      schedule: 'Sunday - Thursday | 4 PM - 9 PM',
    })),
    gallery: GALLERY_FALLBACK,
    loginShowcase: {
      features: LOGIN_FEATURES_FALLBACK,
      metrics: [
        { id: 'players', label: 'Players', value: `${summary.totalActiveStudents}+` },
        { id: 'coaches', label: 'Coaches', value: `${summary.totalCoaches}+` },
        { id: 'branches', label: 'Branches', value: `${summary.totalBranches}` },
      ],
    },
  };
}

export async function getPublicAbout() {
  const [summary, programs, branches] = await Promise.all([
    getAcademySummary(),
    prisma.program.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        ageGroupMin: true,
        ageGroupMax: true,
      },
    }),
    prisma.branch.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 3,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        city: true,
        address: true,
      },
    }),
  ]);

  const programSteps =
    programs.length > 0
      ? programs.map((program) => ({
        id: program.id,
        title: program.name,
        description:
          program.description ??
          (program.ageGroupMin !== null && program.ageGroupMax !== null
            ? `Designed for ages ${program.ageGroupMin}-${program.ageGroupMax}.`
            : 'Structured academy program with progressive development.'),
      }))
      : [
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
      ];

  const branchHighlights =
    branches.length > 0
      ? branches.map((branch) => ({
        id: branch.id,
        title: branch.city,
        description:
          branch.address ??
          'Active academy branch supporting safe and structured training.',
      }))
      : [
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
      ];

  return {
    hero: {
      badge: 'About AspireX',
      title:
        'A modern sports academy built around children, families, and measurable progress.',
      description:
        'AspireX Sports Academy combines professional coaching, safe training environments, structured programs, and digital progress tracking to help every child grow with confidence.',
      primaryAction: 'Register Your Child',
      secondaryAction: 'Book Free Trial',
    },
    stats: [
      {
        key: 'students',
        label: 'Active players',
        value: `${summary.totalActiveStudents}+`,
        description: 'Children developing through structured academy programs.',
      },
      {
        key: 'coaches',
        label: 'Professional coaches',
        value: `${summary.totalCoaches}+`,
        description: 'Certified coaches supporting player growth.',
      },
      {
        key: 'branches',
        label: 'Training branches',
        value: String(summary.totalBranches),
        description: 'Accessible training locations for families.',
      },
      {
        key: 'attendance',
        label: 'Attendance rate',
        value: `${summary.attendanceRate || summary.parentSatisfaction}%`,
        description: 'Consistent participation supported by digital tracking.',
      },
    ],
    mission: {
      eyebrow: 'Our Mission',
      title:
        'We help young athletes train safely, improve consistently, and enjoy sport.',
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
      title:
        'Built as a complete academy operating system, not just a training schedule.',
      description:
        'AspireX is designed to connect the public website, parent portal, coach workspace, and admin operations in one coherent academy experience.',
      highlights: branchHighlights,
    },
    pathway: {
      eyebrow: 'Player Pathway',
      title:
        'A clear development journey from first trial to long-term performance.',
      description:
        'The player journey is designed to be simple for families and useful for coaches: trial, registration, placement, training, assessment, and progress follow-up.',
      steps: programSteps,
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
}

export async function getPublicPrograms() {
  const programs = await prisma.program.findMany({
    where: { ...notDeleted(), status: 'ACTIVE' },
    take: 12,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      ageGroupMin: true,
      ageGroupMax: true,
      priceMonthly: true,
      currency: true,
      capacity: true,
    },
  });

  const mappedPrograms = programs.map((program) => ({
    id: program.id,
    slug: program.slug ?? program.id,
    title: program.name,
    description:
      program.description ?? 'Structured academy training program.',
    age:
      program.ageGroupMin !== null && program.ageGroupMax !== null
        ? `Ages ${program.ageGroupMin}-${program.ageGroupMax}`
        : 'All ages',
    level: 'Beginner to advanced',
    priceMonthly: program.priceMonthly,
    currency: program.currency ?? 'AED',
    capacity: program.capacity,
    sportName: 'Academy Sport',
  }));

  return {
    hero: {
      badge: 'Academy Programs',
      title: 'Sports programs built for every age, level, and training goal.',
      description:
        'Explore structured academy programs connected directly to active program records in the database.',
      primaryAction: 'Register Your Child',
      secondaryAction: 'Book Free Trial',
    },
    programs: mappedPrograms,
    filters: {
      sports: ['Academy Sport'],
      levels: ['Beginner to advanced'],
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
}

export async function getPublicProgramDetails(programId: string) {
  const program = await prisma.program.findFirst({
    where: {
      ...notDeleted(),
      status: 'ACTIVE',
      OR: [{ id: programId }, { slug: programId }],
    },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      ageGroupMin: true,
      ageGroupMax: true,
      priceMonthly: true,
      currency: true,
      capacity: true,
    },
  });

  if (!program) {
    const fallbackPrograms = await getPublicPrograms();

    return {
      program:
        fallbackPrograms.programs[0] ?? {
          id: programId,
          slug: programId,
          title: 'Program',
          description: 'Program details are not available yet.',
          age: 'All ages',
          level: 'Beginner to advanced',
          priceMonthly: null,
          currency: 'AED',
          capacity: null,
          sportName: 'Academy Sport',
        },
      hero: {
        badge: 'Program Details',
        title: 'Program details are being prepared',
        description:
          'This program could not be found in the active database records. Showing a safe fallback until the content is available.',
        primaryAction: 'Register Your Child',
        secondaryAction: 'Book Free Trial',
      },
      overview: {
        title: 'Program overview',
        description:
          'Program content can be managed from the database and displayed here automatically.',
        items: [],
      },
      pathway: {
        title: 'Player development pathway',
        description:
          'The player journey includes trial, placement, training, assessment, and progress follow-up.',
        steps: [],
      },
      safety: {
        title: 'Safety and family visibility',
        description:
          'Programs are designed around safe progression, attendance visibility, and communication.',
        items: [],
      },
      relatedPrograms: fallbackPrograms.programs.slice(0, 3),
      cta: {
        badge: 'Start the journey',
        title: 'Ready to choose the right program?',
        description:
          'Register your child or book a free trial and the academy team will help you confirm the best path.',
        primaryAction: 'Register Your Child',
        secondaryAction: 'Book Free Trial',
      },
    };
  }

  const relatedProgramsRaw = await prisma.program.findMany({
    where: {
      ...notDeleted(),
      status: 'ACTIVE',
      id: { not: program.id },
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      ageGroupMin: true,
      ageGroupMax: true,
      priceMonthly: true,
      currency: true,
      capacity: true,
    },
  });

  const mapProgram = (item: typeof program) => ({
    id: item.id,
    slug: item.slug ?? item.id,
    title: item.name,
    description:
      item.description ?? 'Structured academy training program.',
    age:
      item.ageGroupMin !== null && item.ageGroupMax !== null
        ? `Ages ${item.ageGroupMin}-${item.ageGroupMax}`
        : 'All ages',
    level: 'Beginner to advanced',
    priceMonthly: item.priceMonthly,
    currency: item.currency ?? 'AED',
    capacity: item.capacity,
    sportName: 'Academy Sport',
  });

  const mappedProgram = mapProgram(program);

  return {
    program: mappedProgram,
    hero: {
      badge: 'Program Details',
      title: mappedProgram.title,
      description: mappedProgram.description,
      primaryAction: 'Register Your Child',
      secondaryAction: 'Book Free Trial',
    },
    overview: {
      title: `What ${mappedProgram.title} focuses on`,
      description:
        'This program page is connected to the public API and prepared to display database-managed academy content.',
      items: [
        {
          id: 'overview-skills',
          title: 'Skill development',
          description:
            'Structured sessions help students improve core movement, sport-specific technique, and confidence.',
        },
        {
          id: 'overview-teamwork',
          title: 'Teamwork and discipline',
          description:
            'Training groups help students build communication, commitment, and respect for coaching structure.',
        },
        {
          id: 'overview-progress',
          title: 'Progress tracking',
          description:
            'Attendance, notes, and assessments can support a clear development journey.',
        },
      ],
    },
    pathway: {
      title: 'Player development pathway',
      description:
        'The journey is designed to move students from trial and placement into structured training and measurable development.',
      steps: [
        {
          id: 'step-trial',
          title: 'Trial session',
          description:
            'The student joins a trial session so the academy can understand level and group fit.',
        },
        {
          id: 'step-placement',
          title: 'Program placement',
          description:
            'The student is assigned to the suitable program, branch, group, and coach.',
        },
        {
          id: 'step-progress',
          title: 'Training and progress',
          description:
            'The coach follows attendance, notes, skill development, and follow-up actions.',
        },
      ],
    },
    safety: {
      title: 'Safety and family visibility',
      description:
        'The program experience is designed around safe progression, coach accountability, and parent communication.',
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
    relatedPrograms: relatedProgramsRaw.map(mapProgram),
    cta: {
      badge: 'Start the journey',
      title: `Ready to join ${mappedProgram.title}?`,
      description:
        'Register your child or book a free trial and the academy team will help you confirm the best training path.',
      primaryAction: 'Register Your Child',
      secondaryAction: 'Book Free Trial',
    },
  };
}

function buildInitials(firstName: string, lastName: string) {
  const firstInitial = firstName.trim()[0] ?? '';
  const lastInitial = lastName.trim()[0] ?? '';

  return `${firstInitial}${lastInitial}`.toUpperCase() || 'C';
}

export async function getPublicCoaches() {
  const coaches = await prisma.coach.findMany({
    where: { ...notDeleted(), status: 'ACTIVE' },
    take: 12,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      coachCode: true,
      bio: true,
      specialties: true,
      licenseNumber: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      branchAssignments: {
        select: {
          branch: {
            select: {
              name: true,
              city: true,
              emirate: true,
            },
          },
        },
      },
      programAssignments: {
        select: {
          program: {
            select: {
              name: true,
              sport: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const mappedCoaches = coaches.map((coach) => {
    const name = `${coach.user.firstName} ${coach.user.lastName}`.trim();

    const branches = coach.branchAssignments.map((assignment) => {
      const branch = assignment.branch;
      return branch.name || branch.city || branch.emirate;
    });

    const programs = coach.programAssignments.map(
      (assignment) => assignment.program.name,
    );

    const sportNames = coach.programAssignments
      .map((assignment) => assignment.program.sport.name)
      .filter(Boolean);

    const specialties =
      coach.specialties.length > 0 ? coach.specialties : sportNames;

    return {
      id: coach.id,
      slug: coach.id,
      name,
      title:
        specialties.length > 0
          ? `${specialties[0]} Coach`
          : 'Academy Coach',
      bio:
        coach.bio ??
        'Professional academy coach focused on safe, structured player development.',
      specialties,
      branches: Array.from(new Set(branches)),
      programs: Array.from(new Set(programs)),
      licenseNumber: coach.licenseNumber ?? undefined,
      avatarInitials: buildInitials(
        coach.user.firstName,
        coach.user.lastName,
      ),
    };
  });

  return {
    hero: {
      badge: 'Academy Coaches',
      title: 'Meet the coaches behind every confident player.',
      description:
        'Explore our coaching team. Coach profiles are connected to active coach records, assignments, programs, and branches in the database.',
      primaryAction: 'Book Free Trial',
      secondaryAction: 'View Programs',
    },
    coaches: mappedCoaches,
    filters: {
      specialties: Array.from(
        new Set(mappedCoaches.flatMap((coach) => coach.specialties)),
      ),
      branches: Array.from(
        new Set(mappedCoaches.flatMap((coach) => coach.branches)),
      ),
      programs: Array.from(
        new Set(mappedCoaches.flatMap((coach) => coach.programs)),
      ),
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
}

function formatSessionDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatSessionTime(startAt: Date, endAt: Date) {
  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return `${formatTime(startAt)} - ${formatTime(endAt)}`;
}

export async function getPublicCoachDetails(coachId: string) {
  const coach = await prisma.coach.findFirst({
    where: {
      ...notDeleted(),
      status: 'ACTIVE',
      OR: [{ id: coachId }, { coachCode: coachId }],
    },
    select: {
      id: true,
      coachCode: true,
      bio: true,
      specialties: true,
      licenseNumber: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      branchAssignments: {
        select: {
          branch: {
            select: {
              name: true,
              city: true,
              emirate: true,
            },
          },
        },
      },
      programAssignments: {
        select: {
          program: {
            select: {
              name: true,
              sport: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
      scheduleSessions: {
        where: {
          ...notDeleted(),
          startAt: {
            gte: new Date(),
          },
        },
        take: 5,
        orderBy: {
          startAt: 'asc',
        },
        select: {
          id: true,
          startAt: true,
          endAt: true,
          branch: {
            select: {
              name: true,
              city: true,
            },
          },
          program: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!coach) {
    const coachesContent = await getPublicCoaches();

    return {
      coach:
        coachesContent.coaches[0] ?? {
          id: coachId,
          slug: coachId,
          name: 'Academy Coach',
          title: 'Academy Coach',
          bio: 'Coach profile is not available yet.',
          specialties: [],
          branches: [],
          programs: [],
          avatarInitials: 'C',
        },
      hero: {
        badge: 'Coach Profile',
        title: 'Coach profile is being prepared',
        description:
          'This coach profile could not be found in active database records.',
        primaryAction: 'Book Free Trial',
        secondaryAction: 'View Programs',
      },
      credentials: {
        title: 'Coach credentials',
        description:
          'Coach credentials can be managed from database records.',
        items: [],
      },
      approach: {
        title: 'Coaching approach',
        description:
          'Our coaches support safe progression, structured learning, and measurable development.',
        items: [],
      },
      assignments: {
        title: 'Coach assignments',
        description:
          'Branches, programs, and specialties can be connected through the database.',
        branches: [],
        programs: [],
        specialties: [],
      },
      upcomingSessions: [],
      relatedCoaches: coachesContent.coaches.slice(0, 3),
      cta: {
        badge: 'Meet the right coach',
        title: 'Ready to train with the right academy coach?',
        description:
          'Book a trial and the academy team will recommend the best coach, program, and branch for your child.',
        primaryAction: 'Book Free Trial',
        secondaryAction: 'Register Your Child',
      },
    };
  }

  const name = `${coach.user.firstName} ${coach.user.lastName}`.trim();

  const branches = coach.branchAssignments.map((assignment) => {
    const branch = assignment.branch;
    return branch.name || branch.city || branch.emirate;
  });

  const programs = coach.programAssignments.map(
    (assignment) => assignment.program.name,
  );

  const sportNames = coach.programAssignments
    .map((assignment) => assignment.program.sport.name)
    .filter(Boolean);

  const specialties =
    coach.specialties.length > 0 ? coach.specialties : sportNames;

  const mappedCoach = {
    id: coach.id,
    slug: coach.id,
    name,
    title:
      specialties.length > 0 ? `${specialties[0]} Coach` : 'Academy Coach',
    bio:
      coach.bio ??
      'Professional academy coach focused on safe, structured player development.',
    specialties,
    branches: Array.from(new Set(branches)),
    programs: Array.from(new Set(programs)),
    licenseNumber: coach.licenseNumber ?? undefined,
    avatarInitials: buildInitials(coach.user.firstName, coach.user.lastName),
  };

  const related = await prisma.coach.findMany({
    where: {
      ...notDeleted(),
      status: 'ACTIVE',
      id: { not: coach.id },
    },
    take: 3,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      bio: true,
      specialties: true,
      licenseNumber: true,
      user: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      branchAssignments: {
        select: {
          branch: {
            select: {
              name: true,
              city: true,
              emirate: true,
            },
          },
        },
      },
      programAssignments: {
        select: {
          program: {
            select: {
              name: true,
              sport: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const relatedCoaches = related.map((item) => {
    const relatedName = `${item.user.firstName} ${item.user.lastName}`.trim();

    const relatedBranches = item.branchAssignments.map((assignment) => {
      const branch = assignment.branch;
      return branch.name || branch.city || branch.emirate;
    });

    const relatedPrograms = item.programAssignments.map(
      (assignment) => assignment.program.name,
    );

    const relatedSportNames = item.programAssignments
      .map((assignment) => assignment.program.sport.name)
      .filter(Boolean);

    const relatedSpecialties =
      item.specialties.length > 0 ? item.specialties : relatedSportNames;

    return {
      id: item.id,
      slug: item.id,
      name: relatedName,
      title:
        relatedSpecialties.length > 0
          ? `${relatedSpecialties[0]} Coach`
          : 'Academy Coach',
      bio:
        item.bio ??
        'Professional academy coach focused on structured player development.',
      specialties: relatedSpecialties,
      branches: Array.from(new Set(relatedBranches)),
      programs: Array.from(new Set(relatedPrograms)),
      licenseNumber: item.licenseNumber ?? undefined,
      avatarInitials: buildInitials(item.user.firstName, item.user.lastName),
    };
  });

  return {
    coach: mappedCoach,
    hero: {
      badge: 'Coach Profile',
      title: mappedCoach.name,
      description: mappedCoach.bio,
      primaryAction: 'Book Free Trial',
      secondaryAction: 'View Programs',
    },
    credentials: {
      title: 'Coach credentials',
      description:
        'Credentials, specialties, and assignments are loaded from active coach records.',
      items: [
        {
          id: 'credential-role',
          label: 'Role',
          value: mappedCoach.title,
        },
        {
          id: 'credential-license',
          label: 'License',
          value: mappedCoach.licenseNumber ?? 'Available on request',
        },
        {
          id: 'credential-specialties',
          label: 'Specialties',
          value:
            mappedCoach.specialties.length > 0
              ? mappedCoach.specialties.join(', ')
              : 'Player Development',
        },
      ],
    },
    approach: {
      title: 'Coaching approach',
      description:
        'Our coaching approach focuses on safe progression, student confidence, technical development, and clear communication.',
      items: [
        {
          id: 'approach-safe',
          title: 'Safe progression',
          description:
            'Training intensity and drills are adapted to age, readiness, and ability.',
        },
        {
          id: 'approach-skill',
          title: 'Skill development',
          description:
            'Each session supports technical progress, movement quality, and sport understanding.',
        },
        {
          id: 'approach-communication',
          title: 'Clear communication',
          description:
            'Coaches support parent visibility through attendance, notes, and development updates.',
        },
      ],
    },
    assignments: {
      title: 'Coach assignments',
      description:
        'Branches, programs, and specialties are connected to coach assignments in the database.',
      branches: mappedCoach.branches,
      programs: mappedCoach.programs,
      specialties: mappedCoach.specialties,
    },
    upcomingSessions: coach.scheduleSessions.map((session) => ({
      id: session.id,
      title: session.program.name,
      date: formatSessionDate(session.startAt),
      time: formatSessionTime(session.startAt, session.endAt),
      branch: session.branch.name || session.branch.city,
      program: session.program.name,
    })),
    relatedCoaches,
    cta: {
      badge: 'Meet the right coach',
      title: `Want your child to train with ${mappedCoach.name}?`,
      description:
        'Book a trial and the academy team will confirm the best program, branch, and group placement.',
      primaryAction: 'Book Free Trial',
      secondaryAction: 'Register Your Child',
    },
  };
}

function formatBranchSession(startAt: Date, endAt: Date) {
  const date = startAt.toISOString().slice(0, 10);

  const formatTime = (value: Date) =>
    value.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return `${date} | ${formatTime(startAt)} - ${formatTime(endAt)}`;
}

export async function getPublicLocations() {
  const branches = await prisma.branch.findMany({
    where: { ...notDeleted(), status: 'ACTIVE' },
    take: 12,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      city: true,
      emirate: true,
      address: true,
      phone: true,
      email: true,
      programs: {
        take: 6,
        select: {
          program: {
            select: {
              name: true,
            },
          },
        },
      },
      coachAssignments: {
        take: 6,
        select: {
          coach: {
            select: {
              user: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
            },
          },
        },
      },
      scheduleSessions: {
        where: {
          ...notDeleted(),
          startAt: {
            gte: new Date(),
          },
        },
        take: 1,
        orderBy: {
          startAt: 'asc',
        },
        select: {
          id: true,
          startAt: true,
          endAt: true,
        },
      },
      _count: {
        select: {
          students: true,
          programs: true,
          coachAssignments: true,
          scheduleSessions: true,
        },
      },
    },
  });

  const locations = branches.map((branch) => {
    const programs = branch.programs.map(
      (assignment) => assignment.program.name,
    );

    const coaches = branch.coachAssignments.map((assignment) => {
      const user = assignment.coach.user;

      return `${user.firstName} ${user.lastName}`.trim();
    });

    const nextSession = branch.scheduleSessions[0]
      ? formatBranchSession(
        branch.scheduleSessions[0].startAt,
        branch.scheduleSessions[0].endAt,
      )
      : undefined;

    return {
      id: branch.id,
      name: branch.name,
      city: branch.city,
      emirate: branch.emirate,
      address: branch.address,
      phone: branch.phone ?? undefined,
      email: branch.email ?? undefined,
      programs: Array.from(new Set(programs)),
      coaches: Array.from(new Set(coaches)),
      nextSession,
      studentsCount: branch._count.students,
      programsCount: branch._count.programs,
      coachesCount: branch._count.coachAssignments,
      sessionsCount: branch._count.scheduleSessions,
    };
  });

  return {
    hero: {
      badge: 'Academy Locations',
      title: 'Find the right AspireX branch for your family.',
      description:
        'Explore active academy branches, training locations, assigned programs, coaches, and upcoming session availability from the database.',
      primaryAction: 'Book Free Trial',
      secondaryAction: 'View Programs',
    },
    locations,
    filters: {
      cities: Array.from(new Set(locations.map((item) => item.city))),
      emirates: Array.from(new Set(locations.map((item) => item.emirate))),
      programs: Array.from(
        new Set(locations.flatMap((item) => item.programs)),
      ),
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
}

export async function getPublicPricing() {
  const programs = await prisma.program.findMany({
    where: { ...notDeleted(), status: 'ACTIVE' },
    take: 12,
    orderBy: { priceMonthly: 'asc' },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      ageGroupMin: true,
      ageGroupMax: true,
      priceMonthly: true,
      currency: true,
      capacity: true,
      sport: {
        select: {
          name: true,
        },
      },
      _count: {
        select: {
          branches: true,
          scheduleSessions: true,
        },
      },
    },
  });

  const plans = programs.map((program, index) => ({
    id: program.id,
    slug: program.slug ?? program.id,
    title: program.name,
    description:
      program.description ?? 'Structured academy training program.',
    sportName: program.sport.name,
    age:
      program.ageGroupMin !== null && program.ageGroupMax !== null
        ? `Ages ${program.ageGroupMin}-${program.ageGroupMax}`
        : 'All ages',
    level: 'Beginner to advanced',
    priceMonthly: Number(program.priceMonthly),
    currency: program.currency ?? 'AED',
    capacity: program.capacity,
    branchesCount: program._count.branches,
    sessionsCount: program._count.scheduleSessions,
    highlighted: index === 0,
    features: [
      'Monthly academy program access',
      'Coach-led training sessions',
      'Attendance tracking',
      'Progress follow-up',
    ],
  }));

  return {
    hero: {
      badge: 'Academy Pricing',
      title: 'Simple monthly pricing for structured sports programs.',
      description:
        'Explore active program fees directly from database program records, including price, currency, age group, capacity, and availability signals.',
      primaryAction: 'Book Free Trial',
      secondaryAction: 'Register Your Child',
    },
    plans,
    filters: {
      sports: Array.from(new Set(plans.map((plan) => plan.sportName))),
      levels: Array.from(new Set(plans.map((plan) => plan.level))),
    },
    notes: {
      title: 'Pricing notes',
      items: [
        'Prices are shown as monthly program fees.',
        'Final placement depends on age group, branch availability, and schedule.',
        'Registration, kit, transport, camp, or special event fees can be managed separately later.',
      ],
    },
    cta: {
      badge: 'Need guidance?',
      title: 'Not sure which plan fits your child?',
      description:
        'Book a free trial and our academy team will recommend the best program, branch, and training schedule.',
      primaryAction: 'Book Free Trial',
      secondaryAction: 'Register Your Child',
    },
  };
}

function calculateDiscountedPrice(price: number, discountPercent: number) {
  return Number((price * (1 - discountPercent / 100)).toFixed(2));
}

function formatPublicDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export async function getPublicOffers() {
  const programs = await prisma.program.findMany({
    where: { ...notDeleted(), status: 'ACTIVE' },
    take: 9,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      slug: true,
      name: true,
      description: true,
      ageGroupMin: true,
      ageGroupMax: true,
      priceMonthly: true,
      currency: true,
      capacity: true,
      sport: {
        select: {
          name: true,
        },
      },
    },
  });

  const discountCycle = [25, 20, 15, 10];

  const today = new Date();

  const offers = programs.map((program, index) => {
    const discountPercent = discountCycle[index % discountCycle.length];
    const originalPrice = Number(program.priceMonthly);
    const offerPrice = calculateDiscountedPrice(
      originalPrice,
      discountPercent,
    );

    const endsAt = new Date(today);
    endsAt.setDate(today.getDate() + 14 - Math.min(index, 7));

    return {
      id: `${program.id}-offer`,
      slug: `${program.slug ?? program.id}-offer`,
      title: `${discountPercent}% off ${program.name}`,
      description:
        program.description ??
        'Limited-time academy promotion for structured sports training.',
      programTitle: program.name,
      programSlug: program.slug ?? program.id,
      sportName: program.sport.name,
      age:
        program.ageGroupMin !== null && program.ageGroupMax !== null
          ? `Ages ${program.ageGroupMin}-${program.ageGroupMax}`
          : 'All ages',
      level: 'Beginner to advanced',
      originalPrice,
      offerPrice,
      currency: program.currency ?? 'AED',
      discountPercent,
      tag: `${discountPercent}% OFF`,
      startsAt: formatPublicDate(today),
      endsAt: formatPublicDate(endsAt),
      highlighted: index === 0,
      features: [
        'Limited-time monthly discount',
        'Coach-led training sessions',
        'Attendance tracking',
        'Progress follow-up',
      ],
    };
  });

  return {
    hero: {
      badge: 'Current Offers',
      title: 'Limited-time academy offers for new and returning families.',
      description:
        'Explore current promotional offers generated from active database program records. A dedicated offers/coupons model can be introduced later without changing the public page.',
      primaryAction: 'Book Free Trial',
      secondaryAction: 'View Programs',
    },
    offers,
    filters: {
      sports: Array.from(new Set(offers.map((offer) => offer.sportName))),
      discounts: Array.from(new Set(offers.map((offer) => offer.tag))),
    },
    notes: {
      title: 'Offer notes',
      items: [
        'Current offers are generated from active program records until a dedicated offers table is added.',
        'Final availability may depend on branch, age group, schedule, and remaining capacity.',
        'Coupon codes, campaign windows, and admin-managed promotions can be added in a later finance phase.',
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
}

export async function getPublicGallery() {
  const [programs, branches, coaches] = await Promise.all([
    prisma.program.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        sport: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.branch.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        city: true,
        emirate: true,
        address: true,
      },
    }),
    prisma.coach.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        bio: true,
        specialties: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  const programItems = programs.map((program, index) => ({
    id: `${program.id}-gallery`,
    title: `${program.name} highlights`,
    description:
      program.description ??
      'Program media placeholder for photos and videos.',
    category: 'Programs',
    mediaType: index % 2 === 0 ? 'image' : 'video',
    sourceType: 'program',
    sourceId: program.id,
    tags: [
      'Programs',
      program.name,
      program.sport.name,
      index % 2 === 0 ? 'Photo' : 'Video',
    ],
    featured: index === 0,
  }));

  const branchItems = branches.map((branch, index) => ({
    id: `${branch.id}-gallery`,
    title: `${branch.name} facilities`,
    description:
      branch.address ??
      'Branch media placeholder for facilities and academy environment.',
    category: 'Branches',
    mediaType: 'image',
    sourceType: 'branch',
    sourceId: branch.id,
    tags: ['Branches', branch.city, branch.emirate, 'Facilities'],
    featured: programItems.length === 0 && index === 0,
  }));

  const coachItems = coaches.map((coach, index) => {
    const name = `${coach.user.firstName} ${coach.user.lastName}`.trim();

    return {
      id: `${coach.id}-gallery`,
      title: `${name} coaching moment`,
      description:
        coach.bio ??
        'Coach media placeholder for training clips and academy values.',
      category: 'Coaches',
      mediaType: index % 2 === 0 ? 'video' : 'image',
      sourceType: 'coach',
      sourceId: coach.id,
      tags: [
        'Coaches',
        name,
        ...(coach.specialties.length > 0 ? coach.specialties : ['Coaching']),
        index % 2 === 0 ? 'Video' : 'Photo',
      ],
      featured:
        programItems.length === 0 && branchItems.length === 0 && index === 0,
    };
  });

  const items = [...programItems, ...branchItems, ...coachItems];

  return {
    hero: {
      badge: 'Academy Gallery',
      title: 'Photos and videos from training, programs, coaches, and branches.',
      description:
        'Explore a visual academy gallery generated from active database records. Media URL fields are prepared for a future CMS/gallery table.',
      primaryAction: 'Book Free Trial',
      secondaryAction: 'View Programs',
    },
    items,
    filters: {
      categories: Array.from(new Set(items.map((item) => item.category))),
      mediaTypes: Array.from(new Set(items.map((item) => item.mediaType))),
      tags: Array.from(new Set(items.flatMap((item) => item.tags))),
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
}

function formatEventDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

function formatEventTime(startAt: Date, endAt: Date) {
  const formatTime = (value: Date) =>
    value.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

  return `${formatTime(startAt)} - ${formatTime(endAt)}`;
}

export async function getPublicEvents() {
  const sessions = await prisma.scheduleSession.findMany({
    where: {
      ...notDeleted(),
      startAt: {
        gte: new Date(),
      },
      status: {
        not: 'CANCELLED',
      },
    },
    take: 18,
    orderBy: {
      startAt: 'asc',
    },
    select: {
      id: true,
      startAt: true,
      endAt: true,
      capacity: true,
      status: true,
      notes: true,
      branch: {
        select: {
          name: true,
          city: true,
        },
      },
      program: {
        select: {
          name: true,
          sport: {
            select: {
              name: true,
            },
          },
        },
      },
      coach: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  const events = sessions.map((session, index) => {
    const coachName = `${session.coach.user.firstName} ${session.coach.user.lastName}`.trim();

    return {
      id: session.id,
      slug: session.id,
      title: `${session.program.name} Session`,
      description:
        session.notes ??
        `Upcoming ${session.program.name} session with ${coachName}.`,
      date: formatEventDate(session.startAt),
      time: formatEventTime(session.startAt, session.endAt),
      branch: session.branch.name,
      city: session.branch.city,
      program: session.program.name,
      sportName: session.program.sport.name,
      coachName,
      capacity: session.capacity,
      status: session.status,
      category: index === 0 ? 'Featured Session' : 'Training Session',
      tag: index === 0 ? 'Featured' : 'Upcoming',
      featured: index === 0,
    };
  });

  return {
    hero: {
      badge: 'Academy Events',
      title: 'Upcoming sessions, trials, and academy activities.',
      description:
        'Explore upcoming academy schedule items generated from active schedule session records in the database.',
      primaryAction: 'Book Free Trial',
      secondaryAction: 'View Programs',
    },
    events,
    filters: {
      branches: Array.from(new Set(events.map((event) => event.branch))),
      programs: Array.from(new Set(events.map((event) => event.program))),
      statuses: Array.from(new Set(events.map((event) => event.status))),
      categories: Array.from(new Set(events.map((event) => event.category))),
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
}

export async function getPublicEventDetails(eventId: string) {
  const session = await prisma.scheduleSession.findFirst({
    where: {
      ...notDeleted(),
      id: eventId,
      status: {
        not: 'CANCELLED',
      },
    },
    select: {
      id: true,
      startAt: true,
      endAt: true,
      capacity: true,
      status: true,
      notes: true,
      branch: {
        select: {
          name: true,
          city: true,
          emirate: true,
          address: true,
        },
      },
      program: {
        select: {
          name: true,
          description: true,
          sport: {
            select: {
              name: true,
            },
          },
        },
      },
      coach: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  if (!session) {
    const eventsContent = await getPublicEvents();

    return {
      event:
        eventsContent.events[0] ?? {
          id: eventId,
          slug: eventId,
          title: 'Event',
          description: 'Event details are not available yet.',
          date: '',
          time: '',
          branch: '',
          city: '',
          program: '',
          sportName: '',
          coachName: '',
          capacity: 0,
          status: 'SCHEDULED',
          category: 'Training Session',
          tag: 'Upcoming',
          featured: false,
        },
      hero: {
        badge: 'Event Details',
        title: 'Event details are being prepared',
        description:
          'This event could not be found in active schedule records.',
        primaryAction: 'Book Free Trial',
        secondaryAction: 'View Programs',
      },
      overview: {
        title: 'Event overview',
        description:
          'Event details can be loaded from schedule records or a dedicated events table later.',
        items: [],
      },
      logistics: {
        title: 'Event logistics',
        description:
          'Date, time, branch, coach, and capacity details will appear here.',
        items: [],
      },
      whatToExpect: {
        title: 'What to expect',
        description:
          'Families can use this page to understand the session experience before attending.',
        items: [],
      },
      relatedEvents: eventsContent.events.slice(0, 3),
      cta: {
        badge: 'Join this event',
        title: 'Ready to attend an academy session?',
        description:
          'Book a trial and our academy team will help you choose the right event and program.',
        primaryAction: 'Book Free Trial',
        secondaryAction: 'Register Your Child',
      },
    };
  }

  const coachName = `${session.coach.user.firstName} ${session.coach.user.lastName}`.trim();

  const mappedEvent = {
    id: session.id,
    slug: session.id,
    title: `${session.program.name} Session`,
    description:
      session.notes ??
      session.program.description ??
      `Upcoming ${session.program.name} session with ${coachName}.`,
    date: formatEventDate(session.startAt),
    time: formatEventTime(session.startAt, session.endAt),
    branch: session.branch.name,
    city: session.branch.city,
    program: session.program.name,
    sportName: session.program.sport.name,
    coachName,
    capacity: session.capacity,
    status: session.status,
    category: 'Training Session',
    tag: 'Upcoming',
    featured: true,
  };

  const relatedRaw = await prisma.scheduleSession.findMany({
    where: {
      ...notDeleted(),
      id: {
        not: session.id,
      },
      startAt: {
        gte: new Date(),
      },
      status: {
        not: 'CANCELLED',
      },
    },
    take: 3,
    orderBy: {
      startAt: 'asc',
    },
    select: {
      id: true,
      startAt: true,
      endAt: true,
      capacity: true,
      status: true,
      notes: true,
      branch: {
        select: {
          name: true,
          city: true,
        },
      },
      program: {
        select: {
          name: true,
          sport: {
            select: {
              name: true,
            },
          },
        },
      },
      coach: {
        select: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      },
    },
  });

  const relatedEvents = relatedRaw.map((item) => {
    const relatedCoachName = `${item.coach.user.firstName} ${item.coach.user.lastName}`.trim();

    return {
      id: item.id,
      slug: item.id,
      title: `${item.program.name} Session`,
      description:
        item.notes ??
        `Upcoming ${item.program.name} session with ${relatedCoachName}.`,
      date: formatEventDate(item.startAt),
      time: formatEventTime(item.startAt, item.endAt),
      branch: item.branch.name,
      city: item.branch.city,
      program: item.program.name,
      sportName: item.program.sport.name,
      coachName: relatedCoachName,
      capacity: item.capacity,
      status: item.status,
      category: 'Training Session',
      tag: 'Upcoming',
      featured: false,
    };
  });

  return {
    event: mappedEvent,
    hero: {
      badge: 'Event Details',
      title: mappedEvent.title,
      description: mappedEvent.description,
      primaryAction: 'Book Free Trial',
      secondaryAction: 'View Programs',
    },
    overview: {
      title: 'Event overview',
      description:
        'This event is connected to a scheduled academy session and active database records.',
      items: [
        {
          id: 'overview-program',
          title: 'Program',
          description: mappedEvent.program,
        },
        {
          id: 'overview-sport',
          title: 'Sport',
          description: mappedEvent.sportName,
        },
        {
          id: 'overview-coach',
          title: 'Coach',
          description: mappedEvent.coachName,
        },
      ],
    },
    logistics: {
      title: 'Event logistics',
      description:
        'Review the key details before attending or booking this session.',
      items: [
        {
          id: 'logistics-date',
          title: 'Date and time',
          description: `${mappedEvent.date} · ${mappedEvent.time}`,
        },
        {
          id: 'logistics-branch',
          title: 'Branch',
          description: `${mappedEvent.branch}, ${mappedEvent.city}`,
        },
        {
          id: 'logistics-address',
          title: 'Address',
          description:
            session.branch.address ??
            'Branch address will be confirmed by the academy team.',
        },
        {
          id: 'logistics-capacity',
          title: 'Capacity',
          description: `${mappedEvent.capacity} available seats`,
        },
      ],
    },
    whatToExpect: {
      title: 'What to expect',
      description:
        'A structured academy session designed to be safe, clear, and useful for families.',
      items: [
        {
          id: 'expect-arrival',
          title: 'Arrival and check-in',
          description:
            'Arrive a little early so the team can confirm the student and group placement.',
        },
        {
          id: 'expect-training',
          title: 'Coach-led training',
          description:
            'The coach leads warm-up, drills, skill work, and group activities.',
        },
        {
          id: 'expect-followup',
          title: 'Follow-up recommendation',
          description:
            'The academy can recommend the best program, branch, and schedule after the session.',
        },
      ],
    },
    relatedEvents,
    cta: {
      badge: 'Join this event',
      title: `Ready to attend ${mappedEvent.title}?`,
      description:
        'Book a trial and our academy team will help confirm the right program, branch, and group placement.',
      primaryAction: 'Book Free Trial',
      secondaryAction: 'Register Your Child',
    },
  };
}

function makePublicSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);

  return date.toISOString().slice(0, 10);
}

export async function getPublicBlog() {
  const [programs, branches, coaches] = await Promise.all([
    prisma.program.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        sport: {
          select: {
            name: true,
          },
        },
      },
    }),
    prisma.branch.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        city: true,
        emirate: true,
        address: true,
      },
    }),
    prisma.coach.findMany({
      where: { ...notDeleted(), status: 'ACTIVE' },
      take: 4,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        bio: true,
        specialties: true,
        user: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    }),
  ]);

  const programPosts = programs.map((program, index) => ({
    id: `${program.id}-blog`,
    slug: makePublicSlug(`${program.name} guide`),
    title: `A parent guide to ${program.name}`,
    excerpt:
      program.description ??
      `Learn how ${program.name} supports safe progression, confidence, and structured youth development.`,
    category: 'Programs',
    authorName: 'AspireX Team',
    publishedAt: daysAgo(index),
    readTime: `${4 + index} min read`,
    sourceType: 'program',
    sourceId: program.id,
    tags: ['Programs', program.name, program.sport.name, 'Youth Sports'],
    featured: index === 0,
  }));

  const coachPosts = coaches.map((coach, index) => {
    const name = `${coach.user.firstName} ${coach.user.lastName}`.trim();

    return {
      id: `${coach.id}-blog`,
      slug: makePublicSlug(`${name} coaching approach`),
      title: `${name}: coaching approach and player development`,
      excerpt:
        coach.bio ??
        'A look at safe progression, confidence building, communication, and structured youth training.',
      category: 'Coaching',
      authorName: 'AspireX Team',
      publishedAt: daysAgo(index + 5),
      readTime: '5 min read',
      sourceType: 'coach',
      sourceId: coach.id,
      tags: [
        'Coaches',
        name,
        ...(coach.specialties.length > 0
          ? coach.specialties
          : ['Player Development']),
      ],
      featured: false,
    };
  });

  const branchPosts = branches.map((branch, index) => ({
    id: `${branch.id}-blog`,
    slug: makePublicSlug(`${branch.name} branch guide`),
    title: `Inside ${branch.name}`,
    excerpt:
      branch.address ??
      `A family-focused guide to training at our ${branch.city} branch.`,
    category: 'Branches',
    authorName: 'AspireX Team',
    publishedAt: daysAgo(index + 9),
    readTime: '3 min read',
    sourceType: 'branch',
    sourceId: branch.id,
    tags: ['Branches', branch.city, branch.emirate, 'Families'],
    featured: false,
  }));

  const posts = [...programPosts, ...coachPosts, ...branchPosts];

  return {
    hero: {
      badge: 'Academy Blog',
      title: 'Insights for parents, young athletes, and academy families.',
      description:
        'Explore practical academy articles generated from active database records. A dedicated CMS/blog model can be added later without changing the public page.',
      primaryAction: 'Book Free Trial',
      secondaryAction: 'View Programs',
    },
    posts,
    filters: {
      categories: Array.from(new Set(posts.map((post) => post.category))),
      sourceTypes: Array.from(new Set(posts.map((post) => post.sourceType))),
      tags: Array.from(new Set(posts.flatMap((post) => post.tags))),
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
}

export async function getPublicBlogPost(postId: string) {
  const blogContent = await getPublicBlog();

  const selectedPost =
    blogContent.posts.find(
      (post) => post.id === postId || post.slug === postId,
    ) ?? blogContent.posts[0];

  if (!selectedPost) {
    return {
      post: {
        id: postId,
        slug: postId,
        title: 'Article',
        excerpt: 'Article content is not available yet.',
        category: 'Academy',
        authorName: 'AspireX Team',
        publishedAt: new Date().toISOString().slice(0, 10),
        readTime: '3 min read',
        sourceType: 'academy',
        tags: [],
        featured: false,
      },
      hero: {
        badge: 'Academy Article',
        title: 'Article content is being prepared',
        description:
          'This article could not be found in generated public blog records.',
        primaryAction: 'Book Free Trial',
        secondaryAction: 'View Programs',
      },
      article: {
        intro:
          'This article page is ready for future CMS content.',
        sections: [],
        conclusion:
          'More article content can be added once the CMS/blog model is introduced.',
      },
      relatedPosts: [],
      cta: {
        badge: 'Start with confidence',
        title: 'Ready to choose the right academy path?',
        description:
          'Book a trial and our academy team will guide you to the right program, branch, and coach.',
        primaryAction: 'Book Free Trial',
        secondaryAction: 'Register Your Child',
      },
    };
  }

  const sourceLabel =
    selectedPost.sourceType === 'program'
      ? 'program'
      : selectedPost.sourceType === 'coach'
        ? 'coach'
        : selectedPost.sourceType === 'branch'
          ? 'branch'
          : 'academy';

  const relatedPosts = blogContent.posts
    .filter((post) => post.id !== selectedPost.id)
    .slice(0, 3);

  return {
    post: selectedPost,
    hero: {
      badge: 'Academy Article',
      title: selectedPost.title,
      description: selectedPost.excerpt,
      primaryAction: 'Book Free Trial',
      secondaryAction: 'View Programs',
    },
    article: {
      intro: selectedPost.excerpt,
      sections: [
        {
          id: 'section-context',
          title: `Why this ${sourceLabel} topic matters`,
          body: [
            selectedPost.excerpt,
            'Families make better decisions when academy information is clear, structured, and connected to real programs, coaches, and branches.',
          ],
        },
        {
          id: 'section-family-guidance',
          title: 'Guidance for families',
          body: [
            'Start with the child’s age, current ability, interests, confidence level, and preferred schedule.',
            'Then compare the available programs, coaches, branches, and trial options before committing to a long-term plan.',
          ],
        },
        {
          id: 'section-academy-system',
          title: 'How AspireX supports the journey',
          body: [
            'The public website helps families explore programs, pricing, offers, events, locations, coaches, and academy updates.',
            'The wider academy system can support registration, attendance, progress notes, payments, and parent communication.',
          ],
        },
      ],
      conclusion:
        'A strong academy experience is not only about training sessions. It is about safe progression, clear communication, consistent attendance, and the right fit for every child.',
    },
    relatedPosts,
    cta: {
      badge: 'Start with confidence',
      title: `Ready to act on "${selectedPost.title}"?`,
      description:
        'Book a trial and our academy team will help you choose the right program, branch, and coach.',
      primaryAction: 'Book Free Trial',
      secondaryAction: 'Register Your Child',
    },
  };
}

export async function getLoginShowcase() {
  const summary = await getAcademySummary();

  return {
    features: LOGIN_FEATURES_FALLBACK,
    metrics: [
      { id: 'players', label: 'Players', value: `${summary.totalActiveStudents}+` },
      { id: 'coaches', label: 'Coaches', value: `${summary.totalCoaches}+` },
      { id: 'branches', label: 'Branches', value: `${summary.totalBranches}` },
    ],
  };
}

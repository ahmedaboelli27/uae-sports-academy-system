export interface PublicKpiDto {
  key: string;
  label: string;
  value: string;
}

export interface PublicProgramDto {
  id: string;
  title: string;
  age: string;
  level: string;
  description: string;
  image?: string;
}

export interface PublicBranchDto {
  id: string;
  city: string;
  location: string;
  schedule: string;
}

export interface PublicGalleryItemDto {
  id: string;
  title: string;
  subtitle: string;
  image?: string;
}

export interface PublicLoginFeatureDto {
  id: string;
  title: string;
}

export interface PublicLoginMetricDto {
  id: string;
  label: string;
  value: string;
}

export interface PublicHomeContentDto {
  kpis: PublicKpiDto[];
  programs: PublicProgramDto[];
  branches: PublicBranchDto[];
  gallery: PublicGalleryItemDto[];
  loginShowcase: {
    features: PublicLoginFeatureDto[];
    metrics: PublicLoginMetricDto[];
  };
}
export interface PublicAboutHeroDto {
  badge: string;
  title: string;
  description: string;
  primaryAction: string;
  secondaryAction: string;
}

export interface PublicAboutStatDto {
  key: string;
  label: string;
  value: string;
  description: string;
}

export interface PublicAboutValueDto {
  id: string;
  title: string;
  description: string;
}

export interface PublicAboutHighlightDto {
  id: string;
  title: string;
  description: string;
}

export interface PublicAboutStepDto {
  id: string;
  title: string;
  description: string;
}

export interface PublicAboutContentDto {
  hero: PublicAboutHeroDto;
  stats: PublicAboutStatDto[];
  mission: {
    eyebrow: string;
    title: string;
    description: string;
    values: PublicAboutValueDto[];
  };
  story: {
    eyebrow: string;
    title: string;
    description: string;
    highlights: PublicAboutHighlightDto[];
  };
  pathway: {
    eyebrow: string;
    title: string;
    description: string;
    steps: PublicAboutStepDto[];
  };
  safety: {
    eyebrow: string;
    title: string;
    description: string;
    items: PublicAboutValueDto[];
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export interface PublicProgramCardDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  age: string;
  level: string;
  priceMonthly: number | null;
  currency: string;
  capacity: number | null;
  sportName: string;
}

export interface PublicProgramsContentDto {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  programs: PublicProgramCardDto[];
  filters: {
    sports: string[];
    levels: string[];
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export interface PublicProgramDetailsFeatureDto {
  id: string;
  title: string;
  description: string;
}

export interface PublicProgramDetailsStepDto {
  id: string;
  title: string;
  description: string;
}

export interface PublicProgramDetailsContentDto {
  program: PublicProgramCardDto;
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  overview: {
    title: string;
    description: string;
    items: PublicProgramDetailsFeatureDto[];
  };
  pathway: {
    title: string;
    description: string;
    steps: PublicProgramDetailsStepDto[];
  };
  safety: {
    title: string;
    description: string;
    items: PublicProgramDetailsFeatureDto[];
  };
  relatedPrograms: PublicProgramCardDto[];
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export interface PublicCoachCardDto {
  id: string;
  slug: string;
  name: string;
  title: string;
  bio: string;
  specialties: string[];
  branches: string[];
  programs: string[];
  licenseNumber?: string;
  avatarInitials: string;
}

export interface PublicCoachesContentDto {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  coaches: PublicCoachCardDto[];
  filters: {
    specialties: string[];
    branches: string[];
    programs: string[];
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export interface PublicCoachProfileCredentialDto {
  id: string;
  label: string;
  value: string;
}

export interface PublicCoachProfileFeatureDto {
  id: string;
  title: string;
  description: string;
}

export interface PublicCoachProfileSessionDto {
  id: string;
  title: string;
  date: string;
  time: string;
  branch: string;
  program: string;
}

export interface PublicCoachProfileContentDto {
  coach: PublicCoachCardDto;
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  credentials: {
    title: string;
    description: string;
    items: PublicCoachProfileCredentialDto[];
  };
  approach: {
    title: string;
    description: string;
    items: PublicCoachProfileFeatureDto[];
  };
  assignments: {
    title: string;
    description: string;
    branches: string[];
    programs: string[];
    specialties: string[];
  };
  upcomingSessions: PublicCoachProfileSessionDto[];
  relatedCoaches: PublicCoachCardDto[];
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export interface PublicLocationDto {
  id: string;
  name: string;
  city: string;
  emirate: string;
  address: string;
  phone?: string;
  email?: string;
  programs: string[];
  coaches: string[];
  nextSession?: string;
  studentsCount: number;
  programsCount: number;
  coachesCount: number;
  sessionsCount: number;
}

export interface PublicLocationsContentDto {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  locations: PublicLocationDto[];
  filters: {
    cities: string[];
    emirates: string[];
    programs: string[];
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export interface PublicPricingPlanDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  sportName: string;
  age: string;
  level: string;
  priceMonthly: number | null;
  currency: string;
  capacity: number | null;
  branchesCount: number;
  sessionsCount: number;
  features: string[];
  highlighted: boolean;
}

export interface PublicPricingContentDto {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  plans: PublicPricingPlanDto[];
  filters: {
    sports: string[];
    levels: string[];
  };
  notes: {
    title: string;
    items: string[];
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export interface PublicOfferDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  programTitle: string;
  programSlug: string;
  sportName: string;
  age: string;
  level: string;
  originalPrice: number | null;
  offerPrice: number | null;
  currency: string;
  discountPercent: number;
  tag: string;
  startsAt: string;
  endsAt: string;
  highlighted: boolean;
  features: string[];
}

export interface PublicOffersContentDto {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  offers: PublicOfferDto[];
  filters: {
    sports: string[];
    discounts: string[];
  };
  notes: {
    title: string;
    items: string[];
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export type PublicGalleryMediaType = 'image' | 'video';

export interface PublicGalleryMediaItemDto {
  id: string;
  title: string;
  description: string;
  category: string;
  mediaType: PublicGalleryMediaType;
  imageUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  sourceType: 'program' | 'coach' | 'branch' | 'academy';
  sourceId?: string;
  tags: string[];
  featured: boolean;
}

export interface PublicGalleryContentDto {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  items: PublicGalleryMediaItemDto[];
  filters: {
    categories: string[];
    mediaTypes: PublicGalleryMediaType[];
    tags: string[];
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export interface PublicEventDto {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  time: string;
  branch: string;
  city: string;
  program: string;
  sportName: string;
  coachName: string;
  capacity: number;
  status: string;
  category: string;
  tag: string;
  featured: boolean;
}

export interface PublicEventsContentDto {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  events: PublicEventDto[];
  filters: {
    branches: string[];
    programs: string[];
    statuses: string[];
    categories: string[];
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export interface PublicEventDetailsFeatureDto {
  id: string;
  title: string;
  description: string;
}

export interface PublicEventDetailsContentDto {
  event: PublicEventDto;
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  overview: {
    title: string;
    description: string;
    items: PublicEventDetailsFeatureDto[];
  };
  logistics: {
    title: string;
    description: string;
    items: PublicEventDetailsFeatureDto[];
  };
  whatToExpect: {
    title: string;
    description: string;
    items: PublicEventDetailsFeatureDto[];
  };
  relatedEvents: PublicEventDto[];
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export type PublicBlogPostSourceType = 'program' | 'coach' | 'branch' | 'academy';

export interface PublicBlogPostCardDto {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  authorName: string;
  publishedAt: string;
  readTime: string;
  sourceType: PublicBlogPostSourceType;
  sourceId?: string;
  tags: string[];
  featured: boolean;
}

export interface PublicBlogContentDto {
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  posts: PublicBlogPostCardDto[];
  filters: {
    categories: string[];
    sourceTypes: PublicBlogPostSourceType[];
    tags: string[];
  };
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
export interface PublicBlogPostSectionDto {
  id: string;
  title: string;
  body: string[];
}

export interface PublicBlogPostContentDto {
  post: PublicBlogPostCardDto;
  hero: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
  article: {
    intro: string;
    sections: PublicBlogPostSectionDto[];
    conclusion: string;
  };
  relatedPosts: PublicBlogPostCardDto[];
  cta: {
    badge: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
}
import { ENDPOINTS } from '@/services/api/endpoints';
import { getJson } from '@/services/api/http';
import type {
  PublicAboutContentDto,
  PublicBlogContentDto,
  PublicBlogPostCardDto,
  PublicBlogPostContentDto,
  PublicBlogPostSourceType,
  PublicCoachCardDto,
  PublicCoachesContentDto,
  PublicCoachProfileContentDto,
  PublicEventDetailsContentDto,
  PublicEventDto,
  PublicEventsContentDto,
  PublicGalleryContentDto,
  PublicGalleryMediaItemDto,
  PublicGalleryMediaType,
  PublicHomeContentDto,
  PublicLocationDto,
  PublicLocationsContentDto,
  PublicOfferDto,
  PublicOffersContentDto,
  PublicPricingContentDto,
  PublicPricingPlanDto,
  PublicProgramCardDto,
  PublicProgramDetailsContentDto,
  PublicProgramsContentDto,
} from '../types/public-content.dto';

interface BackendProgramDetailsResponse {
  program?: Partial<PublicProgramDetailsContentDto['program']>;
  hero?: Partial<PublicProgramDetailsContentDto['hero']>;
  overview?: Partial<PublicProgramDetailsContentDto['overview']>;
  pathway?: Partial<PublicProgramDetailsContentDto['pathway']>;
  safety?: Partial<PublicProgramDetailsContentDto['safety']>;
  relatedPrograms?: Array<
    Partial<PublicProgramDetailsContentDto['relatedPrograms'][number]>
  >;
  cta?: Partial<PublicProgramDetailsContentDto['cta']>;
}

function normalizeProgramCard(
  item: Partial<PublicProgramDetailsContentDto['program']> | undefined,
  index = 0,
): PublicProgramCardDto {
  return {
    id: item?.id ?? `program-${index}`,
    slug: item?.slug ?? item?.id ?? `program-${index}`,
    title: item?.title ?? '',
    description: item?.description ?? '',
    age: item?.age ?? '',
    level: item?.level ?? '',
    priceMonthly: item?.priceMonthly ?? null,
    currency: item?.currency ?? 'AED',
    capacity: item?.capacity ?? null,
    sportName: item?.sportName ?? '',
  };
}

function normalizeProgramDetails(
  data: BackendProgramDetailsResponse,
): PublicProgramDetailsContentDto {
  return {
    program: normalizeProgramCard(data.program),
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    overview: {
      title: data.overview?.title ?? '',
      description: data.overview?.description ?? '',
      items: (data.overview?.items ?? []).map((item, index) => ({
        id: item.id ?? `overview-${index}`,
        title: item.title ?? '',
        description: item.description ?? '',
      })),
    },
    pathway: {
      title: data.pathway?.title ?? '',
      description: data.pathway?.description ?? '',
      steps: (data.pathway?.steps ?? []).map((item, index) => ({
        id: item.id ?? `pathway-${index}`,
        title: item.title ?? '',
        description: item.description ?? '',
      })),
    },
    safety: {
      title: data.safety?.title ?? '',
      description: data.safety?.description ?? '',
      items: (data.safety?.items ?? []).map((item, index) => ({
        id: item.id ?? `safety-${index}`,
        title: item.title ?? '',
        description: item.description ?? '',
      })),
    },
    relatedPrograms: (data.relatedPrograms ?? []).map((item, index) =>
      normalizeProgramCard(item, index),
    ),
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

interface BackendCoachesResponse {
  hero?: Partial<PublicCoachesContentDto['hero']>;
  coaches?: Array<Partial<PublicCoachCardDto>>;
  filters?: Partial<PublicCoachesContentDto['filters']>;
  cta?: Partial<PublicCoachesContentDto['cta']>;
}

function normalizeCoachCard(
  item: Partial<PublicCoachCardDto> | undefined,
  index = 0,
): PublicCoachCardDto {
  return {
    id: item?.id ?? `coach-${index}`,
    slug: item?.slug ?? item?.id ?? `coach-${index}`,
    name: item?.name ?? '',
    title: item?.title ?? 'Academy Coach',
    bio: item?.bio ?? '',
    specialties: item?.specialties ?? [],
    branches: item?.branches ?? [],
    programs: item?.programs ?? [],
    licenseNumber: item?.licenseNumber,
    avatarInitials: item?.avatarInitials ?? 'C',
  };
}

function normalizeCoaches(
  data: BackendCoachesResponse,
): PublicCoachesContentDto {
  return {
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    coaches: (data.coaches ?? []).map((item, index) =>
      normalizeCoachCard(item, index),
    ),
    filters: {
      specialties: data.filters?.specialties ?? [],
      branches: data.filters?.branches ?? [],
      programs: data.filters?.programs ?? [],
    },
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

interface BackendLocationsResponse {
  hero?: Partial<PublicLocationsContentDto['hero']>;
  locations?: Array<Partial<PublicLocationDto>>;
  filters?: Partial<PublicLocationsContentDto['filters']>;
  cta?: Partial<PublicLocationsContentDto['cta']>;
}

function normalizeLocation(
  item: Partial<PublicLocationDto> | undefined,
  index = 0,
): PublicLocationDto {
  return {
    id: item?.id ?? `location-${index}`,
    name: item?.name ?? '',
    city: item?.city ?? '',
    emirate: item?.emirate ?? '',
    address: item?.address ?? '',
    phone: item?.phone,
    email: item?.email,
    programs: item?.programs ?? [],
    coaches: item?.coaches ?? [],
    nextSession: item?.nextSession,
    studentsCount: item?.studentsCount ?? 0,
    programsCount: item?.programsCount ?? 0,
    coachesCount: item?.coachesCount ?? 0,
    sessionsCount: item?.sessionsCount ?? 0,
  };
}

function normalizeLocations(
  data: BackendLocationsResponse,
): PublicLocationsContentDto {
  return {
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    locations: (data.locations ?? []).map((item, index) =>
      normalizeLocation(item, index),
    ),
    filters: {
      cities: data.filters?.cities ?? [],
      emirates: data.filters?.emirates ?? [],
      programs: data.filters?.programs ?? [],
    },
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

interface BackendPricingResponse {
  hero?: Partial<PublicPricingContentDto['hero']>;
  plans?: Array<Partial<PublicPricingPlanDto>>;
  filters?: Partial<PublicPricingContentDto['filters']>;
  notes?: Partial<PublicPricingContentDto['notes']>;
  cta?: Partial<PublicPricingContentDto['cta']>;
}

function normalizePricingPlan(
  item: Partial<PublicPricingPlanDto> | undefined,
  index = 0,
): PublicPricingPlanDto {
  return {
    id: item?.id ?? `pricing-plan-${index}`,
    slug: item?.slug ?? item?.id ?? `pricing-plan-${index}`,
    title: item?.title ?? '',
    description: item?.description ?? '',
    sportName: item?.sportName ?? '',
    age: item?.age ?? '',
    level: item?.level ?? '',
    priceMonthly: item?.priceMonthly ?? null,
    currency: item?.currency ?? 'AED',
    capacity: item?.capacity ?? null,
    branchesCount: item?.branchesCount ?? 0,
    sessionsCount: item?.sessionsCount ?? 0,
    features: item?.features ?? [],
    highlighted: item?.highlighted ?? false,
  };
}

function normalizePricing(
  data: BackendPricingResponse,
): PublicPricingContentDto {
  return {
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    plans: (data.plans ?? []).map((item, index) =>
      normalizePricingPlan(item, index),
    ),
    filters: {
      sports: data.filters?.sports ?? [],
      levels: data.filters?.levels ?? [],
    },
    notes: {
      title: data.notes?.title ?? '',
      items: data.notes?.items ?? [],
    },
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

interface BackendOffersResponse {
  hero?: Partial<PublicOffersContentDto['hero']>;
  offers?: Array<Partial<PublicOfferDto>>;
  filters?: Partial<PublicOffersContentDto['filters']>;
  notes?: Partial<PublicOffersContentDto['notes']>;
  cta?: Partial<PublicOffersContentDto['cta']>;
}

function normalizeOffer(
  item: Partial<PublicOfferDto> | undefined,
  index = 0,
): PublicOfferDto {
  return {
    id: item?.id ?? `offer-${index}`,
    slug: item?.slug ?? item?.id ?? `offer-${index}`,
    title: item?.title ?? '',
    description: item?.description ?? '',
    programTitle: item?.programTitle ?? '',
    programSlug: item?.programSlug ?? '',
    sportName: item?.sportName ?? '',
    age: item?.age ?? '',
    level: item?.level ?? '',
    originalPrice: item?.originalPrice ?? null,
    offerPrice: item?.offerPrice ?? null,
    currency: item?.currency ?? 'AED',
    discountPercent: item?.discountPercent ?? 0,
    tag: item?.tag ?? '',
    startsAt: item?.startsAt ?? '',
    endsAt: item?.endsAt ?? '',
    highlighted: item?.highlighted ?? false,
    features: item?.features ?? [],
  };
}

function normalizeOffers(data: BackendOffersResponse): PublicOffersContentDto {
  return {
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    offers: (data.offers ?? []).map((item, index) =>
      normalizeOffer(item, index),
    ),
    filters: {
      sports: data.filters?.sports ?? [],
      discounts: data.filters?.discounts ?? [],
    },
    notes: {
      title: data.notes?.title ?? '',
      items: data.notes?.items ?? [],
    },
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

interface BackendGalleryResponse {
  hero?: Partial<PublicGalleryContentDto['hero']>;
  items?: Array<Partial<PublicGalleryMediaItemDto>>;
  filters?: Partial<PublicGalleryContentDto['filters']>;
  cta?: Partial<PublicGalleryContentDto['cta']>;
}

function normalizeGalleryMediaType(
  value: unknown,
): PublicGalleryMediaType {
  return value === 'video' ? 'video' : 'image';
}

function normalizeGalleryItem(
  item: Partial<PublicGalleryMediaItemDto> | undefined,
  index = 0,
): PublicGalleryMediaItemDto {
  return {
    id: item?.id ?? `gallery-item-${index}`,
    title: item?.title ?? '',
    description: item?.description ?? '',
    category: item?.category ?? 'Academy',
    mediaType: normalizeGalleryMediaType(item?.mediaType),
    imageUrl: item?.imageUrl,
    videoUrl: item?.videoUrl,
    thumbnailUrl: item?.thumbnailUrl,
    sourceType: item?.sourceType ?? 'academy',
    sourceId: item?.sourceId,
    tags: item?.tags ?? [],
    featured: item?.featured ?? false,
  };
}

function normalizeGallery(
  data: BackendGalleryResponse,
): PublicGalleryContentDto {
  return {
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    items: (data.items ?? []).map((item, index) =>
      normalizeGalleryItem(item, index),
    ),
    filters: {
      categories: data.filters?.categories ?? [],
      mediaTypes: data.filters?.mediaTypes ?? ['image', 'video'],
      tags: data.filters?.tags ?? [],
    },
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

interface BackendEventsResponse {
  hero?: Partial<PublicEventsContentDto['hero']>;
  events?: Array<Partial<PublicEventDto>>;
  filters?: Partial<PublicEventsContentDto['filters']>;
  cta?: Partial<PublicEventsContentDto['cta']>;
}

function normalizeEvent(
  item: Partial<PublicEventDto> | undefined,
  index = 0,
): PublicEventDto {
  return {
    id: item?.id ?? `event-${index}`,
    slug: item?.slug ?? item?.id ?? `event-${index}`,
    title: item?.title ?? '',
    description: item?.description ?? '',
    date: item?.date ?? '',
    time: item?.time ?? '',
    branch: item?.branch ?? '',
    city: item?.city ?? '',
    program: item?.program ?? '',
    sportName: item?.sportName ?? '',
    coachName: item?.coachName ?? '',
    capacity: item?.capacity ?? 0,
    status: item?.status ?? '',
    category: item?.category ?? 'Session',
    tag: item?.tag ?? '',
    featured: item?.featured ?? false,
  };
}

function normalizeEvents(data: BackendEventsResponse): PublicEventsContentDto {
  return {
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    events: (data.events ?? []).map((item, index) =>
      normalizeEvent(item, index),
    ),
    filters: {
      branches: data.filters?.branches ?? [],
      programs: data.filters?.programs ?? [],
      statuses: data.filters?.statuses ?? [],
      categories: data.filters?.categories ?? [],
    },
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

interface BackendEventDetailsResponse {
  event?: Partial<PublicEventDetailsContentDto['event']>;
  hero?: Partial<PublicEventDetailsContentDto['hero']>;
  overview?: Partial<PublicEventDetailsContentDto['overview']>;
  logistics?: Partial<PublicEventDetailsContentDto['logistics']>;
  whatToExpect?: Partial<PublicEventDetailsContentDto['whatToExpect']>;
  relatedEvents?: Array<
    Partial<PublicEventDetailsContentDto['relatedEvents'][number]>
  >;
  cta?: Partial<PublicEventDetailsContentDto['cta']>;
}

function normalizeEventDetails(
  data: BackendEventDetailsResponse,
): PublicEventDetailsContentDto {
  return {
    event: normalizeEvent(data.event),
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    overview: {
      title: data.overview?.title ?? '',
      description: data.overview?.description ?? '',
      items: (data.overview?.items ?? []).map((item, index) => ({
        id: item.id ?? `overview-${index}`,
        title: item.title ?? '',
        description: item.description ?? '',
      })),
    },
    logistics: {
      title: data.logistics?.title ?? '',
      description: data.logistics?.description ?? '',
      items: (data.logistics?.items ?? []).map((item, index) => ({
        id: item.id ?? `logistics-${index}`,
        title: item.title ?? '',
        description: item.description ?? '',
      })),
    },
    whatToExpect: {
      title: data.whatToExpect?.title ?? '',
      description: data.whatToExpect?.description ?? '',
      items: (data.whatToExpect?.items ?? []).map((item, index) => ({
        id: item.id ?? `expect-${index}`,
        title: item.title ?? '',
        description: item.description ?? '',
      })),
    },
    relatedEvents: (data.relatedEvents ?? []).map((item, index) =>
      normalizeEvent(item, index),
    ),
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

interface BackendBlogResponse {
  hero?: Partial<PublicBlogContentDto['hero']>;
  posts?: Array<Partial<PublicBlogPostCardDto>>;
  filters?: Partial<PublicBlogContentDto['filters']>;
  cta?: Partial<PublicBlogContentDto['cta']>;
}

function normalizeBlogSourceType(value: unknown): PublicBlogPostSourceType {
  if (
    value === 'program' ||
    value === 'coach' ||
    value === 'branch' ||
    value === 'academy'
  ) {
    return value;
  }

  return 'academy';
}

interface BackendBlogPostResponse {
  post?: Partial<PublicBlogPostContentDto['post']>;
  hero?: Partial<PublicBlogPostContentDto['hero']>;
  article?: Partial<PublicBlogPostContentDto['article']>;
  relatedPosts?: Array<Partial<PublicBlogPostContentDto['relatedPosts'][number]>>;
  cta?: Partial<PublicBlogPostContentDto['cta']>;
}

function normalizeBlogPostContent(
  data: BackendBlogPostResponse,
): PublicBlogPostContentDto {
  return {
    post: normalizeBlogPost(data.post),
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    article: {
      intro: data.article?.intro ?? '',
      sections: (data.article?.sections ?? []).map((section, index) => ({
        id: section.id ?? `section-${index}`,
        title: section.title ?? '',
        body: section.body ?? [],
      })),
      conclusion: data.article?.conclusion ?? '',
    },
    relatedPosts: (data.relatedPosts ?? []).map((post, index) =>
      normalizeBlogPost(post, index),
    ),
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

export async function getPublicBlogPostContent(
  postId: string,
): Promise<PublicBlogPostContentDto> {
  const data = await getJson<BackendBlogPostResponse>(
    ENDPOINTS.public.blogPost(postId),
  );

  return normalizeBlogPostContent(data);
}

function normalizeBlogPost(
  item: Partial<PublicBlogPostCardDto> | undefined,
  index = 0,
): PublicBlogPostCardDto {
  return {
    id: item?.id ?? `blog-post-${index}`,
    slug: item?.slug ?? item?.id ?? `blog-post-${index}`,
    title: item?.title ?? '',
    excerpt: item?.excerpt ?? '',
    category: item?.category ?? 'Academy',
    authorName: item?.authorName ?? 'AspireX Team',
    publishedAt: item?.publishedAt ?? '',
    readTime: item?.readTime ?? '3 min read',
    sourceType: normalizeBlogSourceType(item?.sourceType),
    sourceId: item?.sourceId,
    tags: item?.tags ?? [],
    featured: item?.featured ?? false,
  };
}

function normalizeBlog(data: BackendBlogResponse): PublicBlogContentDto {
  return {
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    posts: (data.posts ?? []).map((item, index) =>
      normalizeBlogPost(item, index),
    ),
    filters: {
      categories: data.filters?.categories ?? [],
      sourceTypes: data.filters?.sourceTypes ?? [
        'program',
        'coach',
        'branch',
        'academy',
      ],
      tags: data.filters?.tags ?? [],
    },
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

export async function getPublicBlogContent(): Promise<PublicBlogContentDto> {
  const data = await getJson<BackendBlogResponse>(ENDPOINTS.public.blog);

  return normalizeBlog(data);
}

export async function getPublicEventDetails(
  eventId: string,
): Promise<PublicEventDetailsContentDto> {
  const data = await getJson<BackendEventDetailsResponse>(
    ENDPOINTS.public.eventDetails(eventId),
  );

  return normalizeEventDetails(data);
}

export async function getPublicEventsContent(): Promise<PublicEventsContentDto> {
  const data = await getJson<BackendEventsResponse>(ENDPOINTS.public.events);

  return normalizeEvents(data);
}

export async function getPublicGalleryContent(): Promise<PublicGalleryContentDto> {
  const data = await getJson<BackendGalleryResponse>(ENDPOINTS.public.gallery);

  return normalizeGallery(data);
}

export async function getPublicOffersContent(): Promise<PublicOffersContentDto> {
  const data = await getJson<BackendOffersResponse>(ENDPOINTS.public.offers);

  return normalizeOffers(data);
}

export async function getPublicPricingContent(): Promise<PublicPricingContentDto> {
  const data = await getJson<BackendPricingResponse>(
    ENDPOINTS.public.pricing,
  );

  return normalizePricing(data);
}

export async function getPublicLocationsContent(): Promise<PublicLocationsContentDto> {
  const data = await getJson<BackendLocationsResponse>(
    ENDPOINTS.public.locations,
  );

  return normalizeLocations(data);
}

export async function getPublicCoachesContent(): Promise<PublicCoachesContentDto> {
  const data = await getJson<BackendCoachesResponse>(ENDPOINTS.public.coaches);
  return normalizeCoaches(data);
}

export async function getPublicProgramDetails(
  programId: string,
): Promise<PublicProgramDetailsContentDto> {
  const data = await getJson<BackendProgramDetailsResponse>(
    ENDPOINTS.public.programDetails(programId),
  );

  return normalizeProgramDetails(data);
}

interface BackendHomeResponse {
  kpis?: Array<{ key?: string; label?: string; value?: string }>;
  programs?: Array<{
    id?: string;
    title?: string;
    age?: string;
    level?: string;
    description?: string;
    image?: string;
  }>;
  branches?: Array<{
    id?: string;
    city?: string;
    location?: string;
    schedule?: string;
  }>;
  gallery?: Array<{
    id?: string;
    title?: string;
    subtitle?: string;
    image?: string;
  }>;
  loginShowcase?: {
    features?: Array<{ id?: string; title?: string }>;
    metrics?: Array<{ id?: string; label?: string; value?: string }>;
  };
}

interface BackendAboutResponse {
  hero?: Partial<PublicAboutContentDto['hero']>;
  stats?: Array<Partial<PublicAboutContentDto['stats'][number]>>;
  mission?: Partial<PublicAboutContentDto['mission']>;
  story?: Partial<PublicAboutContentDto['story']>;
  pathway?: Partial<PublicAboutContentDto['pathway']>;
  safety?: Partial<PublicAboutContentDto['safety']>;
  cta?: Partial<PublicAboutContentDto['cta']>;
}

interface BackendProgramsResponse {
  hero?: Partial<PublicProgramsContentDto['hero']>;
  programs?: Array<Partial<PublicProgramsContentDto['programs'][number]>>;
  filters?: Partial<PublicProgramsContentDto['filters']>;
  cta?: Partial<PublicProgramsContentDto['cta']>;
}

function normalizePrograms(
  data: BackendProgramsResponse,
): PublicProgramsContentDto {
  return {
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    programs: (data.programs ?? []).map((item, index) => ({
      id: item.id ?? `program-${index}`,
      slug: item.slug ?? item.id ?? `program-${index}`,
      title: item.title ?? '',
      description: item.description ?? '',
      age: item.age ?? '',
      level: item.level ?? '',
      priceMonthly: item.priceMonthly ?? null,
      currency: item.currency ?? 'AED',
      capacity: item.capacity ?? null,
      sportName: item.sportName ?? '',
    })),
    filters: {
      sports: data.filters?.sports ?? [],
      levels: data.filters?.levels ?? [],
    },
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

function normalizeHome(data: BackendHomeResponse): PublicHomeContentDto {
  return {
    kpis: (data.kpis ?? []).map((item, index) => ({
      key: item.key ?? `kpi-${index}`,
      label: item.label ?? '',
      value: item.value ?? '',
    })),
    programs: (data.programs ?? []).map((item, index) => ({
      id: item.id ?? `program-${index}`,
      title: item.title ?? '',
      age: item.age ?? '',
      level: item.level ?? '',
      description: item.description ?? '',
      image: item.image,
    })),
    branches: (data.branches ?? []).map((item, index) => ({
      id: item.id ?? `branch-${index}`,
      city: item.city ?? '',
      location: item.location ?? '',
      schedule: item.schedule ?? '',
    })),
    gallery: (data.gallery ?? []).map((item, index) => ({
      id: item.id ?? `gallery-${index}`,
      title: item.title ?? '',
      subtitle: item.subtitle ?? '',
      image: item.image,
    })),
    loginShowcase: {
      features: (data.loginShowcase?.features ?? []).map((item, index) => ({
        id: item.id ?? `feature-${index}`,
        title: item.title ?? '',
      })),
      metrics: (data.loginShowcase?.metrics ?? []).map((item, index) => ({
        id: item.id ?? `metric-${index}`,
        label: item.label ?? '',
        value: item.value ?? '',
      })),
    },
  };
}

function normalizeAbout(data: BackendAboutResponse): PublicAboutContentDto {
  return {
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    stats: (data.stats ?? []).map((item, index) => ({
      key: item.key ?? `about-stat-${index}`,
      label: item.label ?? '',
      value: item.value ?? '',
      description: item.description ?? '',
    })),
    mission: {
      eyebrow: data.mission?.eyebrow ?? '',
      title: data.mission?.title ?? '',
      description: data.mission?.description ?? '',
      values: (data.mission?.values ?? []).map((item, index) => ({
        id: item.id ?? `mission-value-${index}`,
        title: item.title ?? '',
        description: item.description ?? '',
      })),
    },
    story: {
      eyebrow: data.story?.eyebrow ?? '',
      title: data.story?.title ?? '',
      description: data.story?.description ?? '',
      highlights: (data.story?.highlights ?? []).map((item, index) => ({
        id: item.id ?? `story-highlight-${index}`,
        title: item.title ?? '',
        description: item.description ?? '',
      })),
    },
    pathway: {
      eyebrow: data.pathway?.eyebrow ?? '',
      title: data.pathway?.title ?? '',
      description: data.pathway?.description ?? '',
      steps: (data.pathway?.steps ?? []).map((item, index) => ({
        id: item.id ?? `pathway-step-${index}`,
        title: item.title ?? '',
        description: item.description ?? '',
      })),
    },
    safety: {
      eyebrow: data.safety?.eyebrow ?? '',
      title: data.safety?.title ?? '',
      description: data.safety?.description ?? '',
      items: (data.safety?.items ?? []).map((item, index) => ({
        id: item.id ?? `safety-item-${index}`,
        title: item.title ?? '',
        description: item.description ?? '',
      })),
    },
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

export async function getPublicHomeContent(): Promise<PublicHomeContentDto> {
  const data = await getJson<BackendHomeResponse>(ENDPOINTS.public.home);
  return normalizeHome(data);
}

export async function getPublicAboutContent(): Promise<PublicAboutContentDto> {
  const data = await getJson<BackendAboutResponse>(ENDPOINTS.public.about);
  return normalizeAbout(data);
}

export async function getPublicLoginShowcase(): Promise<
  PublicHomeContentDto['loginShowcase']
> {
  const data = await getJson<BackendHomeResponse['loginShowcase']>(
    ENDPOINTS.public.loginShowcase,
  );

  return {
    features: (data?.features ?? []).map((item, index) => ({
      id: item.id ?? `feature-${index}`,
      title: item.title ?? '',
    })),
    metrics: (data?.metrics ?? []).map((item, index) => ({
      id: item.id ?? `metric-${index}`,
      label: item.label ?? '',
      value: item.value ?? '',
    })),
  };
}
interface BackendCoachProfileResponse {
  coach?: Partial<PublicCoachProfileContentDto['coach']>;
  hero?: Partial<PublicCoachProfileContentDto['hero']>;
  credentials?: Partial<PublicCoachProfileContentDto['credentials']>;
  approach?: Partial<PublicCoachProfileContentDto['approach']>;
  assignments?: Partial<PublicCoachProfileContentDto['assignments']>;
  upcomingSessions?: Array<
    Partial<PublicCoachProfileContentDto['upcomingSessions'][number]>
  >;
  relatedCoaches?: Array<
    Partial<PublicCoachProfileContentDto['relatedCoaches'][number]>
  >;
  cta?: Partial<PublicCoachProfileContentDto['cta']>;
}

function normalizeCoachProfile(
  data: BackendCoachProfileResponse,
): PublicCoachProfileContentDto {
  return {
    coach: normalizeCoachCard(data.coach),
    hero: {
      badge: data.hero?.badge ?? '',
      title: data.hero?.title ?? '',
      description: data.hero?.description ?? '',
      primaryAction: data.hero?.primaryAction ?? '',
      secondaryAction: data.hero?.secondaryAction ?? '',
    },
    credentials: {
      title: data.credentials?.title ?? '',
      description: data.credentials?.description ?? '',
      items: (data.credentials?.items ?? []).map((item, index) => ({
        id: item.id ?? `credential-${index}`,
        label: item.label ?? '',
        value: item.value ?? '',
      })),
    },
    approach: {
      title: data.approach?.title ?? '',
      description: data.approach?.description ?? '',
      items: (data.approach?.items ?? []).map((item, index) => ({
        id: item.id ?? `approach-${index}`,
        title: item.title ?? '',
        description: item.description ?? '',
      })),
    },
    assignments: {
      title: data.assignments?.title ?? '',
      description: data.assignments?.description ?? '',
      branches: data.assignments?.branches ?? [],
      programs: data.assignments?.programs ?? [],
      specialties: data.assignments?.specialties ?? [],
    },
    upcomingSessions: (data.upcomingSessions ?? []).map((item, index) => ({
      id: item.id ?? `session-${index}`,
      title: item.title ?? '',
      date: item.date ?? '',
      time: item.time ?? '',
      branch: item.branch ?? '',
      program: item.program ?? '',
    })),
    relatedCoaches: (data.relatedCoaches ?? []).map((item, index) =>
      normalizeCoachCard(item, index),
    ),
    cta: {
      badge: data.cta?.badge ?? '',
      title: data.cta?.title ?? '',
      description: data.cta?.description ?? '',
      primaryAction: data.cta?.primaryAction ?? '',
      secondaryAction: data.cta?.secondaryAction ?? '',
    },
  };
}

export async function getPublicCoachProfileContent(
  coachId: string,
): Promise<PublicCoachProfileContentDto> {
  const data = await getJson<BackendCoachProfileResponse>(
    ENDPOINTS.public.coachDetails(coachId),
  );

  return normalizeCoachProfile(data);
}


export async function getPublicProgramsContent(): Promise<PublicProgramsContentDto> {
  const data = await getJson<BackendProgramsResponse>(ENDPOINTS.public.programs);
  return normalizePrograms(data);
}
import { ENDPOINTS } from '@/services/api/endpoints';
import { getJson, patchJson } from '@/services/api/http';
import type {
  SiteSettingsDto,
  SiteSettingsGroup,
  UpdateAdminSettingsPayloadDto,
} from '../types/settings.dto';

const fallbackSettings: SiteSettingsDto = {
  branding: {
    academyName: 'AspireX Sports Academy',
    shortName: 'AspireX',
    logoUrl: '',
    darkLogoUrl: '',
    faviconUrl: '',
    primaryColor: '#00129B',
    secondaryColor: '#FFD400',
  },
  contact: {
    phone: '+971 50 000 0000',
    whatsapp: '+971 50 000 0000',
    email: 'info@academy.ae',
    address: 'Dubai Sports City',
    city: 'Dubai',
    country: 'United Arab Emirates',
    workingHours: 'Sunday - Thursday | 9:00 AM - 9:00 PM',
  },
  social: {
    instagramUrl: '',
    facebookUrl: '',
    tiktokUrl: '',
    youtubeUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
  },
  publicWebsite: {
    heroTitle: 'Build confident young athletes with elite coaching',
    heroSubtitle: 'Professional coaching, smart tracking, and family-focused growth.',
    defaultMetaTitle: 'AspireX Sports Academy',
    defaultMetaDescription: 'Professional youth sports academy in the UAE.',
    enableOffers: true,
    enableBlog: true,
    enableGallery: true,
    enableEvents: true,
  },
  system: {
    maintenanceMode: false,
    registrationEnabled: true,
    trialBookingEnabled: true,
    defaultLocale: 'en',
  },
};

function deepMergeSettings(
  source: SiteSettingsDto,
  incoming: Partial<SiteSettingsDto>,
): SiteSettingsDto {
  return {
    branding: { ...source.branding, ...(incoming.branding ?? {}) },
    contact: { ...source.contact, ...(incoming.contact ?? {}) },
    social: { ...source.social, ...(incoming.social ?? {}) },
    publicWebsite: { ...source.publicWebsite, ...(incoming.publicWebsite ?? {}) },
    system: { ...source.system, ...(incoming.system ?? {}) },
  };
}

export async function getPublicSiteSettings(): Promise<SiteSettingsDto> {
  try {
    const data = await getJson<Partial<SiteSettingsDto>>(ENDPOINTS.public.siteSettings);
    return deepMergeSettings(fallbackSettings, data);
  } catch {
    return fallbackSettings;
  }
}

export async function getAdminSettings(): Promise<SiteSettingsDto> {
  const data = await getJson<Partial<SiteSettingsDto>>(ENDPOINTS.admin.settings.list);
  return deepMergeSettings(fallbackSettings, data);
}

export async function getAdminSettingsGroup(
  group: SiteSettingsGroup,
): Promise<SiteSettingsDto[SiteSettingsGroup]> {
  return getJson<SiteSettingsDto[SiteSettingsGroup]>(
    ENDPOINTS.admin.settings.group(group),
  );
}

export async function updateAdminSettings(
  payload: UpdateAdminSettingsPayloadDto,
): Promise<SiteSettingsDto> {
  const data = await patchJson<Partial<SiteSettingsDto>, UpdateAdminSettingsPayloadDto>(
    ENDPOINTS.admin.settings.update,
    payload,
  );
  return deepMergeSettings(fallbackSettings, data);
}

export { fallbackSettings as fallbackSiteSettings };

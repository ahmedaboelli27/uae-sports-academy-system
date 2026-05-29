export const SETTINGS_GROUPS = {
  branding: 'branding',
  contact: 'contact',
  social: 'social',
  publicWebsite: 'publicWebsite',
  system: 'system',
} as const;

export type SettingsGroup = keyof typeof SETTINGS_GROUPS;

export type SettingsMap = Record<string, string | boolean>;

export const SETTINGS_DEFAULTS: Record<SettingsGroup, SettingsMap> = {
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

export const PUBLIC_SETTINGS_GROUPS: SettingsGroup[] = [
  'branding',
  'contact',
  'social',
  'publicWebsite',
  'system',
];

export interface BrandingSettingsDto {
  academyName: string;
  shortName: string;
  logoUrl: string;
  darkLogoUrl: string;
  faviconUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export interface ContactSettingsDto {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  country: string;
  workingHours: string;
}

export interface SocialSettingsDto {
  instagramUrl: string;
  facebookUrl: string;
  tiktokUrl: string;
  youtubeUrl: string;
  linkedinUrl: string;
  websiteUrl: string;
}

export interface PublicWebsiteSettingsDto {
  heroTitle: string;
  heroSubtitle: string;
  defaultMetaTitle: string;
  defaultMetaDescription: string;
  enableOffers: boolean;
  enableBlog: boolean;
  enableGallery: boolean;
  enableEvents: boolean;
}

export interface SystemSettingsDto {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  trialBookingEnabled: boolean;
  defaultLocale: string;
}

export interface SiteSettingsDto {
  branding: BrandingSettingsDto;
  contact: ContactSettingsDto;
  social: SocialSettingsDto;
  publicWebsite: PublicWebsiteSettingsDto;
  system: SystemSettingsDto;
}

export type SiteSettingsGroup = keyof SiteSettingsDto;

export interface UpdateAdminSettingsPayloadDto {
  group?: SiteSettingsGroup;
  values: Record<string, string | boolean>;
}

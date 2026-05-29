import {
  getAdminSettings,
  updateAdminSettings,
} from '@/features/settings/services/settings.service';
import type {
  SiteSettingsDto,
  SiteSettingsGroup,
} from '@/features/settings/types/settings.dto';
import { useCallback, useEffect, useMemo, useState } from 'react';

type FormState = SiteSettingsDto;
type FieldErrors = Record<string, string>;
type ValidationErrorsByGroup = Partial<Record<SiteSettingsGroup, FieldErrors>>;

const sectionOrder: Array<{
  key: SiteSettingsGroup;
  title: string;
  subtitle: string;
  badge: string;
}> = [
    {
      key: 'branding',
      title: 'Branding',
      subtitle: 'Control academy identity, logos, colors, and visual presence.',
      badge: 'Identity',
    },
    {
      key: 'contact',
      title: 'Contact',
      subtitle: 'Manage phone, WhatsApp, email, address, and working hours.',
      badge: 'Public Info',
    },
    {
      key: 'social',
      title: 'Social',
      subtitle: 'Connect public website visitors with official social channels.',
      badge: 'Channels',
    },
    {
      key: 'publicWebsite',
      title: 'Public Website',
      subtitle: 'Control public page visibility, hero copy, and SEO defaults.',
      badge: 'Website',
    },
    {
      key: 'system',
      title: 'System',
      subtitle: 'Manage maintenance mode, registration, trials, and locale.',
      badge: 'Controls',
    },
  ];



function isValidHexColor(value: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(value.trim());
}

function isValidUrl(value: string) {
  const trimmed = value.trim();

  if (!trimmed) {
    return true;
  }

  return trimmed.startsWith('http://') || trimmed.startsWith('https://');
}

function validateSettingsGroup(
  group: SiteSettingsGroup,
  settings: SiteSettingsDto,
): FieldErrors {
  const errors: FieldErrors = {};

  if (group === 'branding') {
    if (!settings.branding.academyName.trim()) {
      errors.academyName = 'Academy name is required.';
    }

    if (!settings.branding.shortName.trim()) {
      errors.shortName = 'Short name is required.';
    }

    if (!isValidHexColor(settings.branding.primaryColor)) {
      errors.primaryColor = 'Primary color must be a valid HEX value.';
    }

    if (!isValidHexColor(settings.branding.secondaryColor)) {
      errors.secondaryColor = 'Secondary color must be a valid HEX value.';
    }

    for (const key of ['logoUrl', 'darkLogoUrl', 'faviconUrl'] as const) {
      if (!isValidUrl(settings.branding[key])) {
        errors[key] = 'URL must start with http:// or https://.';
      }
    }
  }

  if (group === 'contact') {
    if (!settings.contact.phone.trim()) {
      errors.phone = 'Phone number is required.';
    }

    if (!settings.contact.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!settings.contact.email.includes('@')) {
      errors.email = 'Email must be valid.';
    }
  }

  if (group === 'social') {
    for (const key of [
      'instagramUrl',
      'facebookUrl',
      'tiktokUrl',
      'youtubeUrl',
      'linkedinUrl',
      'websiteUrl',
    ] as const) {
      if (!isValidUrl(settings.social[key])) {
        errors[key] = 'URL must start with http:// or https://.';
      }
    }
  }

  if (group === 'publicWebsite') {
    if (!settings.publicWebsite.heroTitle.trim()) {
      errors.heroTitle = 'Hero title is required.';
    }

    if (!settings.publicWebsite.heroSubtitle.trim()) {
      errors.heroSubtitle = 'Hero subtitle is required.';
    }

    if (!settings.publicWebsite.defaultMetaTitle.trim()) {
      errors.defaultMetaTitle = 'Default meta title is required.';
    }

    if (!settings.publicWebsite.defaultMetaDescription.trim()) {
      errors.defaultMetaDescription = 'Default meta description is required.';
    }
  }

  if (group === 'system') {
    if (!settings.system.defaultLocale.trim()) {
      errors.defaultLocale = 'Default locale is required.';
    }
  }

  return errors;
}

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState<FormState | null>(null);
  const [savedSettings, setSavedSettings] = useState<FormState | null>(null);
  const [activeGroup, setActiveGroup] = useState<SiteSettingsGroup>('branding');

  const [loading, setLoading] = useState(true);
  const [savingGroup, setSavingGroup] = useState<SiteSettingsGroup | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] =
    useState<ValidationErrorsByGroup>({});

  const loadSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const data = await getAdminSettings();
      setSettings(data);
      setSavedSettings(data);
    } catch {
      setError('Failed to load settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const activeSection = useMemo(
    () =>
      sectionOrder.find((section) => section.key === activeGroup) ??
      sectionOrder[0],
    [activeGroup],
  );

  const isDirty = useMemo(() => {
    if (!settings || !savedSettings) {
      return false;
    }

    return (
      JSON.stringify(settings[activeGroup]) !==
      JSON.stringify(savedSettings[activeGroup])
    );
  }, [activeGroup, savedSettings, settings]);

  const enabledPublicFeatures = useMemo(() => {
    if (!settings) {
      return 0;
    }

    return [
      settings.publicWebsite.enableOffers,
      settings.publicWebsite.enableBlog,
      settings.publicWebsite.enableGallery,
      settings.publicWebsite.enableEvents,
    ].filter(Boolean).length;
  }, [settings]);

  const filledSocialLinks = useMemo(() => {
    if (!settings) {
      return 0;
    }

    return Object.values(settings.social).filter(Boolean).length;
  }, [settings]);

  const updateField = <
    G extends SiteSettingsGroup,
    K extends keyof SiteSettingsDto[G],
  >(
    group: G,
    key: K,
    value: SiteSettingsDto[G][K],
  ) => {
    if (!settings) {
      return;
    }

    setMessage(null);
    setError(null);

    setValidationErrors((current) => ({
      ...current,
      [group]: {
        ...(current[group] ?? {}),
        [String(key)]: '',
      },
    }));

    setSettings({
      ...settings,
      [group]: {
        ...settings[group],
        [key]: value,
      },
    });
  };

  const resetActiveGroup = () => {
    if (!settings || !savedSettings) {
      return;
    }

    setSettings({
      ...settings,
      [activeGroup]: {
        ...savedSettings[activeGroup],
      },
    });

    setValidationErrors((current) => ({
      ...current,
      [activeGroup]: {},
    }));

    setMessage(`${activeSection.title} changes reset.`);
    setError(null);
  };

  const saveGroup = async (group: SiteSettingsGroup) => {
    if (!settings) {
      return;
    }

    const errors = validateSettingsGroup(group, settings);

    if (Object.keys(errors).length > 0) {
      setValidationErrors((current) => ({
        ...current,
        [group]: errors,
      }));
      setMessage(null);
      setError('Please fix the highlighted fields before saving.');
      return;
    }

    setSavingGroup(group);
    setMessage(null);
    setError(null);

    try {
      const updated = await updateAdminSettings({
        group,
        values: settings[group] as unknown as Record<string, string | boolean>,
      });

      setSettings(updated);
      setSavedSettings(updated);
      setValidationErrors((current) => ({
        ...current,
        [group]: {},
      }));
      setMessage(`${activeSection.title} settings saved successfully.`);
    } catch {
      setError(`Failed to save ${activeSection.title} settings.`);
    } finally {
      setSavingGroup(null);
    }
  };

  if (loading || !settings) {
    return (
      <div className="space-y-6">
        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <div className="h-8 w-64 animate-pulse rounded-full bg-muted" />
          <div className="mt-4 h-4 w-full max-w-xl animate-pulse rounded-full bg-muted" />
        </section>

        <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-bold text-muted-foreground">
            Loading settings...
          </p>
        </section>
      </div>
    );
  }

  const activeErrors = validationErrors[activeGroup] ?? {};

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card p-6 shadow-sm">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_10%,rgba(0,18,155,0.10),transparent_28%),radial-gradient(circle_at_90%_20%,rgba(255,212,0,0.16),transparent_28%)]" />

        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="inline-flex rounded-full bg-brand-blue/10 px-3 py-1 text-xs font-black text-brand-blue dark:bg-brand-yellow/15 dark:text-brand-yellow">
              Admin Control Center
            </div>

            <h1 className="mt-4 text-3xl font-black tracking-tight">
              System Settings
            </h1>

            <p className="mt-2 max-w-3xl text-sm font-semibold leading-6 text-muted-foreground">
              Manage the public website identity, contact details, social links,
              feature visibility, and system controls from one central place.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[460px]">
            <SummaryTile
              label="Public features"
              value={`${enabledPublicFeatures}/4`}
              helper="Enabled"
            />
            <SummaryTile
              label="Social links"
              value={String(filledSocialLinks)}
              helper="Configured"
            />
            <SummaryTile
              label="Maintenance"
              value={settings.system.maintenanceMode ? 'On' : 'Off'}
              helper={
                settings.system.maintenanceMode
                  ? 'Public notice active'
                  : 'Website available'
              }
              danger={settings.system.maintenanceMode}
            />
          </div>
        </div>
      </section>

      {message ? (
        <section className="rounded-2xl border border-green-300 bg-green-50 p-4 text-sm font-bold text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300">
          {message}
        </section>
      ) : null}

      {error ? (
        <section className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm font-bold text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
          {error}
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <aside className="rounded-3xl border border-border bg-card p-4 shadow-sm xl:sticky xl:top-24 xl:self-start">
          <div className="mb-4 px-2">
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-muted-foreground">
              Settings areas
            </h2>
            <p className="mt-1 text-xs font-semibold text-muted-foreground">
              Choose a section to edit and preview.
            </p>
          </div>

          <div className="space-y-2">
            {sectionOrder.map((section) => {
              const isActive = section.key === activeGroup;
              const hasErrors = Boolean(
                validationErrors[section.key] &&
                Object.values(validationErrors[section.key] ?? {}).some(
                  Boolean,
                ),
              );

              return (
                <button
                  key={section.key}
                  type="button"
                  onClick={() => {
                    setActiveGroup(section.key);
                    setMessage(null);
                    setError(null);
                  }}
                  className={[
                    'flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left transition',
                    isActive
                      ? 'border-brand-blue bg-brand-blue text-white shadow-[0_14px_30px_rgba(0,18,155,0.18)] dark:border-brand-yellow dark:bg-brand-yellow dark:text-brand-blue'
                      : 'border-transparent bg-background hover:border-border hover:bg-muted/40',
                  ].join(' ')}
                >
                  <span>
                    <span className="block text-sm font-black">
                      {section.title}
                    </span>
                    <span
                      className={[
                        'mt-1 block text-xs font-semibold',
                        isActive
                          ? 'text-white/78 dark:text-brand-blue/70'
                          : 'text-muted-foreground',
                      ].join(' ')}
                    >
                      {section.badge}
                    </span>
                  </span>

                  {hasErrors ? (
                    <span className="rounded-full bg-red-500 px-2 py-1 text-[10px] font-black text-white">
                      Fix
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => void loadSettings()}
            className="mt-4 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm font-black transition hover:bg-muted/50"
          >
            Reload from server
          </button>
        </aside>

        <main className="space-y-6">
          <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <div className="inline-flex rounded-full bg-muted px-3 py-1 text-xs font-black text-muted-foreground">
                  {activeSection.badge}
                </div>
                <h2 className="mt-3 text-2xl font-black">
                  {activeSection.title}
                </h2>
                <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-muted-foreground">
                  {activeSection.subtitle}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={resetActiveGroup}
                  disabled={!isDirty || savingGroup === activeGroup}
                  className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-black transition hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reset changes
                </button>

                <button
                  type="button"
                  onClick={() => void saveGroup(activeGroup)}
                  disabled={savingGroup === activeGroup}
                  className="rounded-full bg-brand-blue px-5 py-2.5 text-sm font-black text-white shadow-[0_14px_28px_rgba(0,18,155,0.20)] transition hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-yellow dark:text-brand-blue dark:hover:bg-white"
                >
                  {savingGroup === activeGroup ? 'Saving...' : 'Save changes'}
                </button>
              </div>
            </div>

            {isDirty ? (
              <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-xs font-bold text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                You have unsaved changes in this section.
              </div>
            ) : null}
          </section>

          {activeGroup === 'branding' ? (
            <BrandingSection
              settings={settings}
              errors={activeErrors}
              updateField={updateField}
            />
          ) : null}

          {activeGroup === 'contact' ? (
            <ContactSection
              settings={settings}
              errors={activeErrors}
              updateField={updateField}
            />
          ) : null}

          {activeGroup === 'social' ? (
            <SocialSection
              settings={settings}
              errors={activeErrors}
              updateField={updateField}
            />
          ) : null}

          {activeGroup === 'publicWebsite' ? (
            <PublicWebsiteSection
              settings={settings}
              errors={activeErrors}
              updateField={updateField}
            />
          ) : null}

          {activeGroup === 'system' ? (
            <SystemSection
              settings={settings}
              errors={activeErrors}
              updateField={updateField}
            />
          ) : null}
        </main>
      </section>
    </div>
  );
}

function BrandingSection({
  settings,
  errors,
  updateField,
}: SectionProps) {
  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_380px]">
      <SettingsCard
        title="Brand identity"
        description="These values appear across the public website header, footer, and brand areas."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Academy Name"
            value={settings.branding.academyName}
            error={errors.academyName}
            required
            onChange={(value) =>
              updateField('branding', 'academyName', value)
            }
          />

          <TextField
            label="Short Name"
            value={settings.branding.shortName}
            error={errors.shortName}
            required
            onChange={(value) => updateField('branding', 'shortName', value)}
          />

          <UrlField
            label="Logo URL"
            value={settings.branding.logoUrl}
            error={errors.logoUrl}
            onChange={(value) => updateField('branding', 'logoUrl', value)}
          />

          <UrlField
            label="Dark Logo URL"
            value={settings.branding.darkLogoUrl}
            error={errors.darkLogoUrl}
            onChange={(value) => updateField('branding', 'darkLogoUrl', value)}
          />

          <UrlField
            label="Favicon URL"
            value={settings.branding.faviconUrl}
            error={errors.faviconUrl}
            onChange={(value) => updateField('branding', 'faviconUrl', value)}
          />

          <ColorField
            label="Primary Color"
            value={settings.branding.primaryColor}
            error={errors.primaryColor}
            onChange={(value) => updateField('branding', 'primaryColor', value)}
          />

          <ColorField
            label="Secondary Color"
            value={settings.branding.secondaryColor}
            error={errors.secondaryColor}
            onChange={(value) =>
              updateField('branding', 'secondaryColor', value)
            }
          />
        </div>
      </SettingsCard>

      <PreviewCard title="Brand preview">
        <div className="rounded-3xl border border-border bg-background p-5">
          <div className="flex items-center gap-4">
            {settings.branding.logoUrl ? (
              <img
                src={settings.branding.logoUrl}
                alt={settings.branding.academyName}
                className="h-14 w-14 rounded-2xl object-contain ring-1 ring-border"
              />
            ) : (
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-lg font-black text-white"
                style={{
                  backgroundColor: isValidHexColor(
                    settings.branding.primaryColor,
                  )
                    ? settings.branding.primaryColor
                    : '#00129B',
                }}
              >
                {settings.branding.shortName.slice(0, 2).toUpperCase()}
              </div>
            )}

            <div>
              <p className="text-lg font-black">
                {settings.branding.shortName || 'Short name'}
              </p>
              <p className="text-sm font-semibold text-muted-foreground">
                {settings.branding.academyName || 'Academy name'}
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <ColorSwatch
              label="Primary"
              value={settings.branding.primaryColor}
            />
            <ColorSwatch
              label="Secondary"
              value={settings.branding.secondaryColor}
            />
          </div>
        </div>
      </PreviewCard>
    </div>
  );
}

function ContactSection({
  settings,
  errors,
  updateField,
}: SectionProps) {
  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_380px]">
      <SettingsCard
        title="Contact information"
        description="These details appear on the Contact page, footer, and public contact cards."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Phone"
            value={settings.contact.phone}
            error={errors.phone}
            required
            onChange={(value) => updateField('contact', 'phone', value)}
          />

          <TextField
            label="WhatsApp"
            value={settings.contact.whatsapp}
            onChange={(value) => updateField('contact', 'whatsapp', value)}
          />

          <TextField
            label="Email"
            value={settings.contact.email}
            error={errors.email}
            required
            onChange={(value) => updateField('contact', 'email', value)}
          />

          <TextField
            label="City"
            value={settings.contact.city}
            onChange={(value) => updateField('contact', 'city', value)}
          />

          <TextField
            label="Country"
            value={settings.contact.country}
            onChange={(value) => updateField('contact', 'country', value)}
          />

          <TextField
            label="Working Hours"
            value={settings.contact.workingHours}
            onChange={(value) =>
              updateField('contact', 'workingHours', value)
            }
          />

          <div className="md:col-span-2">
            <TextAreaField
              label="Address"
              value={settings.contact.address}
              onChange={(value) => updateField('contact', 'address', value)}
            />
          </div>
        </div>
      </SettingsCard>

      <PreviewCard title="Contact preview">
        <div className="space-y-3 rounded-3xl border border-border bg-background p-5">
          <PreviewLine label="Phone" value={settings.contact.phone} />
          <PreviewLine label="WhatsApp" value={settings.contact.whatsapp} />
          <PreviewLine label="Email" value={settings.contact.email} />
          <PreviewLine
            label="Location"
            value={`${settings.contact.address}, ${settings.contact.city}, ${settings.contact.country}`}
          />
          <PreviewLine
            label="Hours"
            value={settings.contact.workingHours}
          />
        </div>
      </PreviewCard>
    </div>
  );
}

function SocialSection({
  settings,
  errors,
  updateField,
}: SectionProps) {
  const links = [
    ['Instagram', 'instagramUrl', settings.social.instagramUrl],
    ['Facebook', 'facebookUrl', settings.social.facebookUrl],
    ['TikTok', 'tiktokUrl', settings.social.tiktokUrl],
    ['YouTube', 'youtubeUrl', settings.social.youtubeUrl],
    ['LinkedIn', 'linkedinUrl', settings.social.linkedinUrl],
    ['Website', 'websiteUrl', settings.social.websiteUrl],
  ] as const;

  const configuredLinks = links.filter(([, , value]) => value.trim());

  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_380px]">
      <SettingsCard
        title="Social media links"
        description="Leave any field empty if that social channel is not used."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {links.map(([label, key, value]) => (
            <UrlField
              key={key}
              label={`${label} URL`}
              value={value}
              error={errors[key]}
              onChange={(nextValue) =>
                updateField('social', key, nextValue)
              }
            />
          ))}
        </div>
      </SettingsCard>

      <PreviewCard title="Social preview">
        <div className="rounded-3xl border border-border bg-background p-5">
          {configuredLinks.length > 0 ? (
            <div className="space-y-3">
              {configuredLinks.map(([label, , value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-card p-3"
                >
                  <p className="text-sm font-black">{label}</p>
                  <p className="mt-1 truncate text-xs font-semibold text-muted-foreground">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyPreviewText>
              No social links configured yet. Public social icons will stay
              hidden until links are added.
            </EmptyPreviewText>
          )}
        </div>
      </PreviewCard>
    </div>
  );
}

function PublicWebsiteSection({
  settings,
  errors,
  updateField,
}: SectionProps) {
  const navItems = [
    ['Offers', settings.publicWebsite.enableOffers],
    ['Gallery', settings.publicWebsite.enableGallery],
    ['Events', settings.publicWebsite.enableEvents],
    ['Blog', settings.publicWebsite.enableBlog],
    ['Contact', true],
  ] as const;

  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_380px]">
      <SettingsCard
        title="Public website"
        description="Control homepage copy, SEO defaults, and optional public sections."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <TextField
            label="Hero Title"
            value={settings.publicWebsite.heroTitle}
            error={errors.heroTitle}
            required
            onChange={(value) =>
              updateField('publicWebsite', 'heroTitle', value)
            }
          />

          <TextField
            label="Hero Subtitle"
            value={settings.publicWebsite.heroSubtitle}
            error={errors.heroSubtitle}
            required
            onChange={(value) =>
              updateField('publicWebsite', 'heroSubtitle', value)
            }
          />

          <TextField
            label="Default Meta Title"
            value={settings.publicWebsite.defaultMetaTitle}
            error={errors.defaultMetaTitle}
            required
            onChange={(value) =>
              updateField('publicWebsite', 'defaultMetaTitle', value)
            }
          />

          <TextField
            label="Default Meta Description"
            value={settings.publicWebsite.defaultMetaDescription}
            error={errors.defaultMetaDescription}
            required
            onChange={(value) =>
              updateField('publicWebsite', 'defaultMetaDescription', value)
            }
          />

          <ToggleField
            label="Enable Offers"
            checked={settings.publicWebsite.enableOffers}
            onChange={(value) =>
              updateField('publicWebsite', 'enableOffers', value)
            }
          />

          <ToggleField
            label="Enable Blog"
            checked={settings.publicWebsite.enableBlog}
            onChange={(value) =>
              updateField('publicWebsite', 'enableBlog', value)
            }
          />

          <ToggleField
            label="Enable Gallery"
            checked={settings.publicWebsite.enableGallery}
            onChange={(value) =>
              updateField('publicWebsite', 'enableGallery', value)
            }
          />

          <ToggleField
            label="Enable Events"
            checked={settings.publicWebsite.enableEvents}
            onChange={(value) =>
              updateField('publicWebsite', 'enableEvents', value)
            }
          />
        </div>
      </SettingsCard>

      <PreviewCard title="Website preview">
        <div className="rounded-3xl border border-border bg-background p-5">
          <p className="text-xl font-black leading-tight">
            {settings.publicWebsite.heroTitle}
          </p>
          <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
            {settings.publicWebsite.heroSubtitle}
          </p>

          <div className="mt-5 rounded-2xl border border-border bg-card p-3">
            <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
              Explore dropdown
            </p>

            <div className="mt-3 flex flex-wrap gap-2">
              {navItems.map(([label, enabled]) => (
                <span
                  key={label}
                  className={[
                    'rounded-full px-3 py-1 text-xs font-black',
                    enabled
                      ? 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/15 dark:text-brand-yellow'
                      : 'bg-muted text-muted-foreground line-through',
                  ].join(' ')}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </PreviewCard>
    </div>
  );
}

function SystemSection({
  settings,
  errors,
  updateField,
}: SectionProps) {
  return (
    <div className="grid gap-6 2xl:grid-cols-[1fr_380px]">
      <SettingsCard
        title="System controls"
        description="Use these controls carefully because they affect public access and user actions."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <ToggleField
            label="Maintenance Mode"
            checked={settings.system.maintenanceMode}
            danger={settings.system.maintenanceMode}
            helper={
              settings.system.maintenanceMode
                ? 'Public visitors will see a maintenance notice.'
                : 'Public website is available.'
            }
            onChange={(value) =>
              updateField('system', 'maintenanceMode', value)
            }
          />

          <ToggleField
            label="Registration Enabled"
            checked={settings.system.registrationEnabled}
            helper="Controls public registration calls-to-action."
            onChange={(value) =>
              updateField('system', 'registrationEnabled', value)
            }
          />

          <ToggleField
            label="Trial Booking Enabled"
            checked={settings.system.trialBookingEnabled}
            helper="Controls Book Trial buttons and forms."
            onChange={(value) =>
              updateField('system', 'trialBookingEnabled', value)
            }
          />

          <TextField
            label="Default Locale"
            value={settings.system.defaultLocale}
            error={errors.defaultLocale}
            onChange={(value) => updateField('system', 'defaultLocale', value)}
          />
        </div>
      </SettingsCard>

      <PreviewCard title="System status">
        <div
          className={[
            'rounded-3xl border p-5',
            settings.system.maintenanceMode
              ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200'
              : 'border-border bg-background',
          ].join(' ')}
        >
          <p className="text-lg font-black">
            {settings.system.maintenanceMode
              ? 'Maintenance mode is active'
              : 'Public website is live'}
          </p>

          <div className="mt-4 space-y-3">
            <StatusRow
              label="Registration"
              enabled={settings.system.registrationEnabled}
            />
            <StatusRow
              label="Trial booking"
              enabled={settings.system.trialBookingEnabled}
            />
            <PreviewLine
              label="Default locale"
              value={settings.system.defaultLocale}
            />
          </div>
        </div>
      </PreviewCard>
    </div>
  );
}

interface SectionProps {
  settings: SiteSettingsDto;
  errors: FieldErrors;
  updateField: <
    G extends SiteSettingsGroup,
    K extends keyof SiteSettingsDto[G],
  >(
    group: G,
    key: K,
    value: SiteSettingsDto[G][K],
  ) => void;
}

function SummaryTile({
  label,
  value,
  helper,
  danger = false,
}: {
  label: string;
  value: string;
  helper: string;
  danger?: boolean;
}) {
  return (
    <div
      className={[
        'rounded-2xl border p-4',
        danger
          ? 'border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10'
          : 'border-border bg-background/80',
      ].join(' ')}
    >
      <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-2xl font-black">{value}</p>
      <p className="mt-1 text-xs font-semibold text-muted-foreground">
        {helper}
      </p>
    </div>
  );
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-xl font-black">{title}</h3>
        <p className="mt-1 text-sm font-semibold leading-6 text-muted-foreground">
          {description}
        </p>
      </div>

      {children}
    </section>
  );
}

function PreviewCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-5 text-xl font-black">{title}</h3>
      {children}
    </section>
  );
}

function TextField({
  label,
  value,
  onChange,
  error,
  helper,
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helper?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1 text-xs font-bold text-muted-foreground">
        {label}
        {required ? <span className="text-red-500">*</span> : null}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={[
          'h-11 w-full rounded-xl border bg-background px-3 text-sm font-semibold outline-none transition focus:ring-2',
          error
            ? 'border-red-400 focus:ring-red-200'
            : 'border-border focus:ring-brand-blue/20',
        ].join(' ')}
      />

      {error ? (
        <span className="mt-1 block text-xs font-bold text-red-600">
          {error}
        </span>
      ) : null}

      {!error && helper ? (
        <span className="mt-1 block text-xs font-semibold text-muted-foreground">
          {helper}
        </span>
      ) : null}
    </label>
  );
}

function UrlField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <TextField
      label={label}
      value={value}
      error={error}
      helper="Optional. Use http:// or https:// if filled."
      onChange={onChange}
    />
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">
        {label}
      </span>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className={[
          'w-full resize-none rounded-xl border bg-background px-3 py-3 text-sm font-semibold outline-none transition focus:ring-2',
          error
            ? 'border-red-400 focus:ring-red-200'
            : 'border-border focus:ring-brand-blue/20',
        ].join(' ')}
      />

      {error ? (
        <span className="mt-1 block text-xs font-bold text-red-600">
          {error}
        </span>
      ) : null}
    </label>
  );
}

function ColorField({
  label,
  value,
  onChange,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const safeColor = isValidHexColor(value) ? value : '#00129B';

  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">
        {label}
      </span>

      <div
        className={[
          'flex h-11 items-center gap-3 rounded-xl border bg-background px-3',
          error ? 'border-red-400' : 'border-border',
        ].join(' ')}
      >
        <input
          type="color"
          value={safeColor}
          onChange={(event) => onChange(event.target.value.toUpperCase())}
          className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
        />

        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
        />
      </div>

      {error ? (
        <span className="mt-1 block text-xs font-bold text-red-600">
          {error}
        </span>
      ) : (
        <span className="mt-1 block text-xs font-semibold text-muted-foreground">
          Use a HEX color such as #00129B.
        </span>
      )}
    </label>
  );
}

function ToggleField({
  label,
  checked,
  onChange,
  helper,
  danger = false,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  helper?: string;
  danger?: boolean;
}) {
  return (
    <label
      className={[
        'flex min-h-[4.4rem] items-center justify-between gap-4 rounded-xl border px-4 py-3',
        danger
          ? 'border-amber-300 bg-amber-50 dark:border-amber-500/40 dark:bg-amber-500/10'
          : 'border-border bg-background',
      ].join(' ')}
    >
      <span>
        <span className="block text-sm font-black">{label}</span>
        {helper ? (
          <span className="mt-1 block text-xs font-semibold text-muted-foreground">
            {helper}
          </span>
        ) : null}
      </span>

      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={[
          'relative h-7 w-12 shrink-0 rounded-full transition',
          checked ? 'bg-brand-blue dark:bg-brand-yellow' : 'bg-muted',
        ].join(' ')}
        aria-pressed={checked}
      >
        <span
          className={[
            'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition dark:bg-brand-blue',
            checked ? 'left-6' : 'left-1',
          ].join(' ')}
        />
      </button>
    </label>
  );
}

function ColorSwatch({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  const safeColor = isValidHexColor(value) ? value : '#00129B';

  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div
        className="h-10 rounded-xl"
        style={{ backgroundColor: safeColor }}
      />
      <p className="mt-2 text-xs font-black text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm font-black">{value}</p>
    </div>
  );
}

function PreviewLine({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-bold">
        {value || 'Not configured'}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  enabled,
}: {
  label: string;
  enabled: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-border bg-card p-3">
      <span className="text-sm font-bold">{label}</span>
      <span
        className={[
          'rounded-full px-3 py-1 text-xs font-black',
          enabled
            ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300'
            : 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300',
        ].join(' ')}
      >
        {enabled ? 'Enabled' : 'Disabled'}
      </span>
    </div>
  );
}

function EmptyPreviewText({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-2xl border border-dashed border-border bg-muted/30 p-4 text-sm font-semibold leading-6 text-muted-foreground">
      {children}
    </p>
  );
}
import { useAuthStore } from '@/features/auth/pages/auth.store';
import { sendContactMessage } from '@/features/public/services/contact-api.service';
import { useSiteSettings } from '@/features/settings/hooks/use-site-settings';
import {
  Clock,
  ExternalLink,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Lock,
  LogIn,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Youtube,
} from 'lucide-react';
import type { ComponentType, FormEvent } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

type IconComponent = ComponentType<{ className?: string }>;

interface ContactCardItem {
  label: string;
  value: string;
  href: string;
  icon: IconComponent;
  helper: string;
  external?: boolean;
  featured?: boolean;
}

interface SocialLinkItem {
  label: string;
  href: string;
  icon: IconComponent;
}

interface ContactFormState {
  subject: string;
  category: string;
  preferredContactMethod: 'Email' | 'Phone' | 'WhatsApp' | 'In-app';
  message: string;
}

const initialFormState: ContactFormState = {
  subject: '',
  category: 'General',
  preferredContactMethod: 'Email',
  message: '',
};

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const { contact, social } = settings;

  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSending, setIsSending] = useState(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const whatsappDigits = contact.whatsapp.replace(/[^\d]/g, '');
  const fullAddress = [contact.address, contact.city, contact.country]
    .filter(Boolean)
    .join(', ');

  const contactCards: ContactCardItem[] = [
    {
      label: 'Phone',
      value: contact.phone,
      href: `tel:${contact.phone}`,
      icon: Phone,
      helper: 'Call our support team',
    },
    {
      label: 'WhatsApp',
      value: contact.whatsapp,
      href: whatsappDigits ? `https://wa.me/${whatsappDigits}` : '',
      icon: WhatsAppIcon,
      helper: 'Fast response on WhatsApp',
      external: true,
      featured: true,
    },
    {
      label: 'Email',
      value: contact.email,
      href: `mailto:${contact.email}`,
      icon: Mail,
      helper: 'Send us an email',
    },
    {
      label: 'Working Hours',
      value: contact.workingHours,
      href: '',
      icon: Clock,
      helper: 'Academy operating hours',
    },
    {
      label: 'Location',
      value: fullAddress,
      href: fullAddress
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          fullAddress,
        )}`
        : '',
      icon: MapPin,
      helper: 'Open location on map',
      external: true,
    },
  ];

  const socialLinks: SocialLinkItem[] = [
    { label: 'Instagram', href: social.instagramUrl, icon: Instagram },
    { label: 'Facebook', href: social.facebookUrl, icon: Facebook },
    { label: 'TikTok', href: social.tiktokUrl, icon: TikTokIcon },
    { label: 'YouTube', href: social.youtubeUrl, icon: Youtube },
    { label: 'LinkedIn', href: social.linkedinUrl, icon: Linkedin },
    { label: 'Website', href: social.websiteUrl, icon: Globe },
  ].filter((item) => item.href);

  const updateFormField = <K extends keyof ContactFormState>(
    key: K,
    value: ContactFormState[K],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuthenticated) {
      setFormError('Please log in before sending a direct message.');
      return;
    }

    if (form.subject.trim().length < 3) {
      setFormError('Subject must be at least 3 characters.');
      return;
    }

    if (form.message.trim().length < 10) {
      setFormError('Message must be at least 10 characters.');
      return;
    }

    setIsSending(true);
    setFormError('');
    setFormSuccess('');

    try {
      await sendContactMessage({
        subject: form.subject.trim(),
        category: form.category.trim() || 'General',
        preferredContactMethod: form.preferredContactMethod,
        message: form.message.trim(),
      });

      setForm(initialFormState);
      setFormSuccess(
        'Your message has been sent successfully. The administration team will review it soon.',
      );
    } catch {
      setFormError(
        'Failed to send your message. Please make sure you are logged in and try again.',
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-brand-blue/10 bg-card p-6 shadow-sm md:p-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_8%_20%,rgba(0,18,155,0.12),transparent_30%),radial-gradient(circle_at_92%_8%,rgba(255,212,0,0.20),transparent_28%)] dark:bg-[radial-gradient(circle_at_8%_20%,rgba(255,212,0,0.12),transparent_30%),radial-gradient(circle_at_92%_8%,rgba(255,255,255,0.08),transparent_28%)]" />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-brand-blue dark:bg-brand-yellow/15 dark:text-brand-yellow">
              <Sparkles className="h-4 w-4" />
              Contact AspireX
            </div>

            <h1 className="mt-5 text-4xl font-black tracking-tight md:text-5xl">
              Talk to our academy team
            </h1>

            <p className="mt-4 max-w-2xl text-base font-semibold leading-8 text-muted-foreground">
              Reach us through phone, WhatsApp, email, or social media. Direct
              website messages are available only after logging in so every
              request is linked to a real account.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {settings.system.trialBookingEnabled ? (
                <Link
                  to="/book-trial"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-[0_16px_32px_rgba(0,18,155,0.22)] transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue dark:hover:bg-white"
                >
                  <Sparkles className="h-4 w-4" />
                  Book Trial
                </Link>
              ) : null}

              {settings.system.registrationEnabled ? (
                <Link
                  to="/register-child"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-black transition hover:-translate-y-0.5 hover:border-brand-blue/30 hover:bg-brand-blue/5 hover:text-brand-blue dark:hover:border-brand-yellow/30 dark:hover:bg-brand-yellow/10 dark:hover:text-brand-yellow"
                >
                  <UserPlus className="h-4 w-4" />
                  Register Child
                </Link>
              ) : null}
            </div>
          </div>

          <div className="rounded-[2rem] border border-border bg-background/80 p-5 shadow-sm backdrop-blur">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue text-white shadow-lg dark:bg-brand-yellow dark:text-brand-blue">
                <ShieldCheck className="h-7 w-7" />
              </div>

              <div>
                <h2 className="text-xl font-black">Verified communication</h2>
                <p className="mt-2 text-sm font-semibold leading-6 text-muted-foreground">
                  Public channels are open to everyone. Direct website messages
                  require login to protect the academy from anonymous spam.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <MiniStatus
                label="Phone & WhatsApp"
                value="Available"
                positive
              />
              <MiniStatus
                label="Direct Messages"
                value={isAuthenticated ? 'Active' : 'Login required'}
                positive={isAuthenticated}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {contactCards.map((item) => {
          const Icon = item.icon;

          const card = (
            <div
              className={[
                'group relative h-full overflow-hidden rounded-3xl border p-5 shadow-sm transition duration-300',
                'hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(15,23,42,0.10)]',
                item.featured
                  ? 'border-green-300 bg-green-50/80 dark:border-green-500/30 dark:bg-green-500/10'
                  : 'border-border bg-card',
              ].join(' ')}
            >
              <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-blue via-brand-yellow to-brand-blue opacity-0 transition group-hover:opacity-100" />

              <div className="flex items-start gap-4">
                <div
                  className={[
                    'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition duration-300 group-hover:scale-110',
                    item.featured
                      ? 'bg-green-600 text-white'
                      : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/15 dark:text-brand-yellow',
                  ].join(' ')}
                >
                  <Icon className="h-6 w-6" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-1 break-words text-base font-black">
                    {item.value || 'Not configured'}
                  </p>
                  <p className="mt-2 text-xs font-semibold text-muted-foreground">
                    {item.helper}
                  </p>
                </div>
              </div>

              {item.href ? (
                <div className="mt-5 inline-flex items-center gap-2 text-sm font-black text-brand-blue transition group-hover:gap-3 dark:text-brand-yellow">
                  Open
                  {item.external ? (
                    <ExternalLink className="h-4 w-4" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </div>
              ) : null}
            </div>
          );

          return item.href ? (
            <a
              key={item.label}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noreferrer' : undefined}
            >
              {card}
            </a>
          ) : (
            <div key={item.label}>{card}</div>
          );
        })}
      </section>

      {socialLinks.length > 0 ? (
        <section className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <h2 className="text-2xl font-black">Follow our channels</h2>
          <p className="mt-2 text-sm font-semibold text-muted-foreground">
            Stay close to academy news, updates, events, and offers.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {socialLinks.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-background px-4 py-4 transition duration-300 hover:-translate-y-1 hover:border-brand-blue/30 hover:bg-brand-blue/5 hover:shadow-[0_16px_32px_rgba(0,18,155,0.10)] dark:hover:border-brand-yellow/30 dark:hover:bg-brand-yellow/10"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-muted text-foreground transition group-hover:bg-brand-blue group-hover:text-white dark:group-hover:bg-brand-yellow dark:group-hover:text-brand-blue">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-black">{item.label}</span>
                  </span>

                  <ExternalLink className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-brand-blue dark:group-hover:text-brand-yellow" />
                </a>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/15 dark:text-brand-yellow">
            <MessageCircle className="h-7 w-7" />
          </div>

          <h2 className="mt-5 text-2xl font-black">
            Direct message to administration
          </h2>

          <p className="mt-3 text-sm font-semibold leading-7 text-muted-foreground">
            This section is prepared for direct communication with academy
            administration. For safety, this form becomes active only after
            login, so each message is connected to a verified user account.
          </p>

          {!isAuthenticated ? (
            <>
              <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
                Direct website messaging is currently locked for visitors.
                Please log in or create an account to send a message to
                administration.
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/auth/login"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue dark:hover:bg-white"
                >
                  <LogIn className="h-4 w-4" />
                  Log in
                </Link>

                {settings.system.registrationEnabled ? (
                  <Link
                    to="/auth/register"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-background px-5 py-3 text-sm font-black transition hover:-translate-y-0.5 hover:bg-muted/60"
                  >
                    <UserPlus className="h-4 w-4" />
                    Create account
                  </Link>
                ) : null}
              </div>
            </>
          ) : (
            <div className="mt-5 rounded-2xl border border-green-300 bg-green-50 p-4 text-sm font-bold leading-6 text-green-800 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-200">
              You are logged in. You can now send a verified message directly
              to the administration team.
            </div>
          )}
        </div>

        <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-6 shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(0,18,155,0.08),transparent_30%),radial-gradient(circle_at_15%_80%,rgba(255,212,0,0.16),transparent_28%)]" />

          <div className="relative">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black">
                  {isAuthenticated ? 'Send a message' : 'Message form preview'}
                </h3>
                <p className="mt-1 text-sm font-semibold text-muted-foreground">
                  {isAuthenticated
                    ? 'Your message will be linked to your account.'
                    : 'Preview only. Login required before activation.'}
                </p>
              </div>

              <span
                className={[
                  'inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black',
                  isAuthenticated
                    ? 'bg-green-100 text-green-700 dark:bg-green-500/10 dark:text-green-300'
                    : 'bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {isAuthenticated ? (
                  <>
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Active
                  </>
                ) : (
                  <>
                    <Lock className="h-3.5 w-3.5" />
                    Locked
                  </>
                )}
              </span>
            </div>

            {isAuthenticated ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <ContactInput
                  label="Subject"
                  value={form.subject}
                  placeholder="Example: Program inquiry"
                  onChange={(value) => updateFormField('subject', value)}
                />

                <label className="block">
                  <span className="mb-1 block text-xs font-bold text-muted-foreground">
                    Category
                  </span>
                  <select
                    value={form.category}
                    onChange={(event) =>
                      updateFormField('category', event.target.value)
                    }
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
                  >
                    <option value="General">General</option>
                    <option value="Registration">Registration</option>
                    <option value="Programs">Programs</option>
                    <option value="Finance">Finance</option>
                    <option value="Schedule">Schedule</option>
                    <option value="Complaint">Complaint</option>
                    <option value="Suggestion">Suggestion</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-bold text-muted-foreground">
                    Preferred contact method
                  </span>
                  <select
                    value={form.preferredContactMethod}
                    onChange={(event) =>
                      updateFormField(
                        'preferredContactMethod',
                        event.target.value as ContactFormState['preferredContactMethod'],
                      )
                    }
                    className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
                  >
                    <option value="Email">Email</option>
                    <option value="Phone">Phone</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="In-app">In-app</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-1 block text-xs font-bold text-muted-foreground">
                    Message
                  </span>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={(event) =>
                      updateFormField('message', event.target.value)
                    }
                    placeholder="Write your message to the administration team..."
                    className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
                  />
                </label>

                {formError ? (
                  <div className="rounded-2xl border border-red-300 bg-red-50 p-3 text-sm font-bold text-red-700 dark:border-red-500/40 dark:bg-red-500/10 dark:text-red-300">
                    {formError}
                  </div>
                ) : null}

                {formSuccess ? (
                  <div className="rounded-2xl border border-green-300 bg-green-50 p-3 text-sm font-bold text-green-700 dark:border-green-500/40 dark:bg-green-500/10 dark:text-green-300">
                    {formSuccess}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={isSending}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-5 py-3 text-sm font-black text-white shadow-[0_16px_32px_rgba(0,18,155,0.18)] transition hover:-translate-y-0.5 hover:bg-brand-blue-dark disabled:cursor-not-allowed disabled:opacity-60 dark:bg-brand-yellow dark:text-brand-blue dark:hover:bg-white"
                >
                  <Send className="h-4 w-4" />
                  {isSending ? 'Sending...' : 'Send verified message'}
                </button>
              </form>
            ) : (
              <div className="space-y-4 opacity-70">
                <DisabledInput
                  label="Subject"
                  value="Example: Program inquiry"
                />
                <DisabledInput label="Category" value="General" />
                <DisabledInput
                  label="Preferred contact method"
                  value="Email"
                />
                <label className="block">
                  <span className="mb-1 block text-xs font-bold text-muted-foreground">
                    Message
                  </span>
                  <textarea
                    disabled
                    rows={5}
                    value="Log in to write and send a direct message to the administration team."
                    className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm font-semibold text-muted-foreground"
                  />
                </label>

                <button
                  type="button"
                  disabled
                  className="inline-flex cursor-not-allowed items-center justify-center gap-2 rounded-full bg-muted px-5 py-3 text-sm font-black text-muted-foreground"
                >
                  <Lock className="h-4 w-4" />
                  Send message after login
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {!settings.system.trialBookingEnabled ||
        !settings.system.registrationEnabled ? (
        <section className="rounded-3xl border border-amber-300 bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-800 dark:border-amber-500/40 dark:bg-amber-500/10 dark:text-amber-200">
          {!settings.system.trialBookingEnabled
            ? 'Trial booking is currently unavailable. '
            : ''}
          {!settings.system.registrationEnabled
            ? 'New registration is currently unavailable.'
            : ''}
        </section>
      ) : null}
    </div>
  );
}

function ContactInput({
  label,
  value,
  placeholder,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">
        {label}
      </span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-2xl border border-border bg-background px-4 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/70 focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10"
      />
    </label>
  );
}

function MiniStatus({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>
      <p
        className={[
          'mt-2 text-sm font-black',
          positive ? 'text-green-600 dark:text-green-300' : '',
        ].join(' ')}
      >
        {value}
      </p>
    </div>
  );
}

function DisabledInput({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-muted-foreground">
        {label}
      </span>
      <input
        disabled
        value={value}
        className="h-12 w-full cursor-not-allowed rounded-2xl border border-border bg-background px-4 text-sm font-semibold text-muted-foreground"
      />
    </label>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M16.02 3.2A12.73 12.73 0 0 0 5.1 22.5L3.6 28.8l6.47-1.47A12.71 12.71 0 1 0 16.02 3.2Zm0 2.34a10.37 10.37 0 1 1-5.28 19.3l-.37-.22-3.85.87.9-3.74-.25-.39A10.37 10.37 0 0 1 16.02 5.54Zm-4.17 5.22c-.22 0-.58.08-.88.42-.3.33-1.15 1.13-1.15 2.75s1.18 3.19 1.35 3.41c.17.22 2.28 3.66 5.65 4.99 2.8 1.1 3.37.88 3.98.83.61-.06 1.98-.81 2.26-1.6.28-.78.28-1.45.19-1.6-.08-.14-.3-.22-.64-.39-.33-.17-1.98-.98-2.29-1.09-.31-.11-.53-.17-.75.17-.22.33-.86 1.09-1.05 1.31-.19.22-.39.25-.72.08-.33-.17-1.41-.52-2.69-1.66-.99-.88-1.66-1.98-1.85-2.31-.19-.33-.02-.51.14-.68.14-.14.33-.39.5-.58.17-.19.22-.33.33-.55.11-.22.06-.42-.03-.58-.08-.17-.75-1.82-1.03-2.49-.27-.65-.55-.56-.75-.57h-.57Z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M15.45 3c.35 2.2 1.58 3.82 3.75 4.36v3.19a7.9 7.9 0 0 1-3.75-1.05v5.75c0 3.46-2.39 5.75-5.7 5.75A5.21 5.21 0 0 1 4.4 15.78c0-3.16 2.37-5.45 5.5-5.45.42 0 .82.04 1.2.13v3.22a3.16 3.16 0 0 0-1.18-.22 2.21 2.21 0 0 0-2.28 2.26 2.17 2.17 0 0 0 2.22 2.22c1.37 0 2.25-.93 2.25-2.5V3h3.34Z"
        className="fill-current"
      />
      <path
        d="M16.05 3.13c.33 1.68 1.26 2.94 2.75 3.62"
        stroke="#25F4EE"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.1 12.03a3.36 3.36 0 0 0-3.42 3.4 3.12 3.12 0 0 0 3.14 3.22"
        stroke="#FE2C55"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
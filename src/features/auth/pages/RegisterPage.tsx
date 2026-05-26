import BrandLogo from '@/components/shared/BrandLogo';
import LanguageToggle from '@/components/shared/LanguageToggle';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { register as registerUser } from '@/features/auth/services/auth-data.service';
import {
  registerSchema,
  type RegisterFormValues,
} from '@/features/auth/validation/auth.validation';
import type { LucideIcon } from 'lucide-react';
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Home,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  Trophy,
  UserPlus,
  UserRound,
  Users,
} from 'lucide-react';
import { useMemo, useState, type FormEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface AccountTypeOption {
  value: RegisterFormValues['role'];
  icon: LucideIcon;
  title: string;
  description: string;
}

interface PasswordRule {
  label: string;
  isValid: boolean;
}

export default function RegisterPage() {
  const { t } = useTranslation();

  const [values, setValues] = useState<RegisterFormValues>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'parent',
    terms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [apiError, setApiError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const accountTypes: AccountTypeOption[] = [
    {
      value: 'parent',
      icon: Users,
      title: t('auth.roles.parent', { defaultValue: 'Parent' }),
      description: t('auth.register.parentDescription', {
        defaultValue:
          'Create a parent account to follow children, payments, schedules, and progress reports.',
      }),
    },
    {
      value: 'coach',
      icon: Trophy,
      title: t('auth.roles.coach', { defaultValue: 'Coach' }),
      description: t('auth.register.coachDescription', {
        defaultValue:
          'Submit a coach access request. Academy admin approval may be required before activation.',
      }),
    },
  ];

  const passwordRules: PasswordRule[] = useMemo(
    () => [
      {
        label: t('auth.register.passwordRules.minLength', {
          defaultValue: 'At least 8 characters',
        }),
        isValid: values.password.length >= 8,
      },
      {
        label: t('auth.register.passwordRules.uppercase', {
          defaultValue: 'Contains an uppercase letter',
        }),
        isValid: /[A-Z]/.test(values.password),
      },
      {
        label: t('auth.register.passwordRules.lowercase', {
          defaultValue: 'Contains a lowercase letter',
        }),
        isValid: /[a-z]/.test(values.password),
      },
      {
        label: t('auth.register.passwordRules.number', {
          defaultValue: 'Contains a number',
        }),
        isValid: /\d/.test(values.password),
      },
      {
        label: t('auth.register.passwordRules.special', {
          defaultValue: 'Contains a special character',
        }),
        isValid: /[^A-Za-z0-9]/.test(values.password),
      },
    ],
    [t, values.password],
  );

  const setField = <K extends keyof RegisterFormValues>(
    key: K,
    value: RegisterFormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));

    if (errors[key]) {
      setErrors((prev) => {
        const nextErrors = { ...prev };
        delete nextErrors[key];
        return nextErrors;
      });
    }

    if (apiError) {
      setApiError('');
    }

    if (success) {
      setSuccess('');
    }
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSuccess('');
    setApiError('');

    const normalizedValues: RegisterFormValues = {
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
    };

    const parsed = registerSchema.safeParse(normalizedValues);

    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};

      for (const issue of parsed.error.issues) {
        const path = String(issue.path[0] ?? '');

        if (!fieldErrors[path]) {
          fieldErrors[path] = issue.message;
        }
      }

      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);

    try {
      await registerUser({
        firstName: normalizedValues.firstName,
        lastName: normalizedValues.lastName,
        email: normalizedValues.email,
        phone: normalizedValues.phone,
        password: normalizedValues.password,
        role: normalizedValues.role,
      });

      setSuccess(
        t('auth.register.success', {
          defaultValue:
            'Registration successful. You can now sign in to your account.',
        }),
      );

      setValues({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'parent',
        terms: false,
      });
    } catch {
      setApiError(
        t('auth.register.error', {
          defaultValue:
            'Registration failed. Please check your details and try again.',
        }),
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-slate-100 text-foreground dark:bg-[#030617]">
      <section className="relative grid min-h-screen lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative hidden overflow-hidden lg:flex">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.30),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.14),transparent_35%)]" />
          <div className="absolute inset-y-0 right-0 w-44 bg-gradient-to-l from-slate-950/35 to-transparent" />

          <div className="relative z-10 flex w-full flex-col justify-between px-10 py-10 xl:px-14 xl:py-14">
            <div>
              <BrandLogo size="lg" showText variant="white" />

              <div className="mt-16 max-w-xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-sm font-black text-brand-blue shadow-[0_16px_35px_rgba(255,212,0,0.22)]">
                  <Sparkles className="h-4 w-4" />
                  {t('auth.register.badge', {
                    defaultValue: 'Join AspireX Academy',
                  })}
                </div>

                <h1 className="text-4xl font-black leading-tight tracking-tight text-white drop-shadow-2xl xl:text-5xl">
                  {t('auth.register.sideTitle', {
                    defaultValue:
                      'Start your academy journey with a secure digital account.',
                  })}
                </h1>

                <p className="mt-6 max-w-lg text-base leading-8 text-white/75 xl:text-lg">
                  {t('auth.register.sideDescription', {
                    defaultValue:
                      'Create a parent account to manage children, subscriptions, schedules, and payments, or submit a coach access request for academy approval.',
                  })}
                </p>
              </div>

              <div className="mt-10 grid gap-4">
                <SideFeature
                  icon={ShieldCheck}
                  title={t('auth.register.features.secure', {
                    defaultValue: 'Secure role-based access',
                  })}
                  description={t('auth.register.features.secureDescription', {
                    defaultValue:
                      'Admin, coach, and parent experiences remain separated and protected.',
                  })}
                />

                <SideFeature
                  icon={Users}
                  title={t('auth.register.features.parent', {
                    defaultValue: 'Parent-first registration',
                  })}
                  description={t('auth.register.features.parentDescription', {
                    defaultValue:
                      'Parents can register safely without accessing admin-only tools.',
                  })}
                />

                <SideFeature
                  icon={Trophy}
                  title={t('auth.register.features.coach', {
                    defaultValue: 'Coach request workflow',
                  })}
                  description={t('auth.register.features.coachDescription', {
                    defaultValue:
                      'Coach accounts can be reviewed before full activation.',
                  })}
                />
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/10 p-5 text-white backdrop-blur-xl">
              <p className="text-sm font-black text-brand-yellow">
                {t('auth.register.securityNoteTitle', {
                  defaultValue: 'Security note',
                })}
              </p>
              <p className="mt-2 text-sm leading-7 text-white/70">
                {t('auth.register.securityNote', {
                  defaultValue:
                    'Public registration never creates admin or accountant accounts. Administrative access is managed only by authorized academy administrators.',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,18,155,0.09),transparent_25%),radial-gradient(circle_at_bottom_left,rgba(255,212,0,0.16),transparent_25%)] dark:bg-[radial-gradient(circle_at_top_right,rgba(255,212,0,0.10),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(0,18,155,0.34),transparent_30%),linear-gradient(135deg,#030617,#071033_48%,#050816)]" />

          <div className="relative z-10 w-full max-w-3xl">
            <div className="mb-6 flex items-center justify-between gap-4">
              <BrandLogo size="md" showText />

              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-brand-blue shadow-sm transition hover:-translate-y-0.5 hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-blue dark:border-white/10 dark:bg-white/[0.06] dark:text-white dark:hover:border-brand-yellow dark:hover:bg-brand-yellow dark:hover:text-brand-blue"
                  aria-label="Go to home page"
                  title="Home"
                >
                  <Home className="h-4 w-4" />
                </Link>

                <LanguageToggle />
                <ThemeToggle />
              </div>
            </div>

            <div className="overflow-hidden rounded-[2.25rem] border border-white/60 bg-white/95 shadow-[0_25px_90px_rgba(15,23,42,0.14)] backdrop-blur-2xl dark:border-white/10 dark:bg-[#071033]/90 dark:shadow-[0_30px_100px_rgba(0,0,0,0.58)] dark:ring-1 dark:ring-brand-yellow/10">
              <div className="border-b border-slate-200/80 bg-gradient-to-r from-brand-blue/[0.07] via-white to-brand-yellow/20 px-6 py-6 dark:border-white/10 dark:bg-[radial-gradient(circle_at_top_left,rgba(255,212,0,0.14),transparent_34%),linear-gradient(135deg,rgba(0,18,155,0.30),rgba(5,8,22,0.70))] sm:px-8">
                <div className="inline-flex items-center gap-2 rounded-full bg-brand-yellow/20 px-4 py-2 text-xs font-black text-brand-blue dark:bg-brand-yellow/15 dark:text-brand-yellow">
                  <UserPlus className="h-4 w-4" />
                  {t('auth.register.kicker', {
                    defaultValue: 'New account',
                  })}
                </div>

                <h1 className="mt-4 text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
                  {t('auth.register.title', {
                    defaultValue: 'Create account',
                  })}
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground dark:text-white/65 sm:text-base">
                  {t('auth.register.description', {
                    defaultValue:
                      'Register as a parent or submit a coach access request. Admin access is managed internally by academy administrators.',
                  })}
                </p>
              </div>

              <form className="space-y-6 p-6 sm:p-8" onSubmit={onSubmit}>
                <div>
                  <p className="mb-3 text-sm font-black dark:text-white">
                    {t('auth.register.accountType', {
                      defaultValue: 'Account type',
                    })}
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {accountTypes.map((option) => {
                      const Icon = option.icon;
                      const isSelected = values.role === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setField('role', option.value)}
                          className={[
                            'rounded-2xl border p-4 text-start transition',
                            isSelected
                              ? 'border-brand-yellow bg-brand-yellow text-brand-blue shadow-[0_18px_45px_rgba(255,212,0,0.24)]'
                              : 'border-border bg-background hover:border-brand-blue/40 hover:bg-brand-blue/5 dark:border-white/10 dark:bg-white/[0.04] dark:text-white dark:hover:border-brand-yellow/40 dark:hover:bg-brand-yellow/10',
                          ].join(' ')}
                        >
                          <div className="flex gap-3">
                            <div
                              className={[
                                'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                                isSelected
                                  ? 'bg-brand-blue/10 text-brand-blue'
                                  : 'bg-brand-blue/10 text-brand-blue dark:bg-brand-yellow/10 dark:text-brand-yellow',
                              ].join(' ')}
                            >
                              <Icon className="h-6 w-6" />
                            </div>

                            <div>
                              <p className="text-sm font-black">
                                {option.title}
                              </p>
                              <p
                                className={[
                                  'mt-1 text-xs font-semibold leading-5',
                                  isSelected
                                    ? 'text-brand-blue/75'
                                    : 'text-muted-foreground dark:text-white/58',
                                ].join(' ')}
                              >
                                {option.description}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {errors.role ? (
                    <p className="mt-2 text-xs font-bold text-red-600 dark:text-red-300">
                      {errors.role}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    icon={UserRound}
                    label={t('auth.register.firstName', {
                      defaultValue: 'First name',
                    })}
                    value={values.firstName}
                    onChange={(value) => setField('firstName', value)}
                    error={errors.firstName}
                    autoComplete="given-name"
                  />

                  <Field
                    icon={UserRound}
                    label={t('auth.register.lastName', {
                      defaultValue: 'Last name',
                    })}
                    value={values.lastName}
                    onChange={(value) => setField('lastName', value)}
                    error={errors.lastName}
                    autoComplete="family-name"
                  />
                </div>

                <Field
                  icon={Mail}
                  label={t('auth.register.email', {
                    defaultValue: 'Email',
                  })}
                  type="email"
                  value={values.email}
                  onChange={(value) => setField('email', value)}
                  error={errors.email}
                  autoComplete="email"
                  placeholder="name@example.com"
                />

                <Field
                  icon={Phone}
                  label={t('auth.register.phone', {
                    defaultValue: 'Phone',
                  })}
                  value={values.phone}
                  onChange={(value) => setField('phone', value)}
                  error={errors.phone}
                  autoComplete="tel"
                  placeholder="+971 50 000 0000"
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <PasswordField
                    icon={Lock}
                    label={t('auth.register.password', {
                      defaultValue: 'Password',
                    })}
                    value={values.password}
                    onChange={(value) => setField('password', value)}
                    error={errors.password}
                    show={showPassword}
                    onToggleShow={() => setShowPassword((prev) => !prev)}
                    autoComplete="new-password"
                  />

                  <PasswordField
                    icon={Lock}
                    label={t('auth.register.confirmPassword', {
                      defaultValue: 'Confirm password',
                    })}
                    value={values.confirmPassword}
                    onChange={(value) => setField('confirmPassword', value)}
                    error={errors.confirmPassword}
                    show={showConfirmPassword}
                    onToggleShow={() => setShowConfirmPassword((prev) => !prev)}
                    autoComplete="new-password"
                  />
                </div>

                <div className="rounded-2xl border border-border bg-background/80 p-4 dark:border-white/10 dark:bg-white/[0.04] dark:ring-1 dark:ring-white/5">
                  <p className="mb-3 text-sm font-black dark:text-white">
                    {t('auth.register.passwordRequirements', {
                      defaultValue: 'Password requirements',
                    })}
                  </p>

                  <div className="grid gap-2 sm:grid-cols-2">
                    {passwordRules.map((rule) => (
                      <div
                        key={rule.label}
                        className="flex items-center gap-2 text-xs font-bold"
                      >
                        <CheckCircle2
                          className={[
                            'h-4 w-4 shrink-0',
                            rule.isValid
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-muted-foreground/50 dark:text-white/25',
                          ].join(' ')}
                        />
                        <span
                          className={
                            rule.isValid
                              ? 'text-foreground dark:text-white'
                              : 'text-muted-foreground dark:text-white/50'
                          }
                        >
                          {rule.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <label className="flex items-start gap-3 rounded-2xl border border-border bg-background/80 p-4 text-sm font-semibold leading-6 dark:border-white/10 dark:bg-white/[0.04] dark:ring-1 dark:ring-white/5">
                  <input
                    type="checkbox"
                    checked={values.terms}
                    onChange={(event) => setField('terms', event.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-border accent-brand-blue dark:accent-brand-yellow"
                  />

                  <span className="text-muted-foreground dark:text-white/62">
                    {t('auth.register.termsPrefix', {
                      defaultValue: 'I agree to the',
                    })}{' '}
                    <Link
                      to="/terms"
                      className="font-black text-brand-blue hover:underline dark:text-brand-yellow"
                    >
                      {t('auth.register.termsLink', {
                        defaultValue: 'Terms',
                      })}
                    </Link>{' '}
                    {t('auth.register.and', {
                      defaultValue: 'and',
                    })}{' '}
                    <Link
                      to="/privacy"
                      className="font-black text-brand-blue hover:underline dark:text-brand-yellow"
                    >
                      {t('auth.register.privacyLink', {
                        defaultValue: 'Privacy Policy',
                      })}
                    </Link>
                    .
                  </span>
                </label>

                {errors.terms ? (
                  <StatusMessage type="error" message={errors.terms} />
                ) : null}

                {apiError ? (
                  <StatusMessage type="error" message={apiError} />
                ) : null}

                {success ? (
                  <StatusMessage type="success" message={success} />
                ) : null}

                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-yellow px-6 text-sm font-black text-brand-blue shadow-[0_18px_45px_rgba(255,212,0,0.22)] transition hover:-translate-y-0.5 hover:bg-white disabled:cursor-not-allowed disabled:opacity-70 dark:hover:bg-white"
                  >
                    {submitting
                      ? t('auth.register.submitting', {
                        defaultValue: 'Submitting...',
                      })
                      : t('auth.register.submit', {
                        defaultValue: 'Create account',
                      })}

                    <ArrowRight className="h-4 w-4 rtl:rotate-180" />
                  </button>

                  <Link
                    to="/auth/login"
                    className="inline-flex h-12 w-full items-center justify-center rounded-full border border-brand-blue/20 bg-white px-6 text-sm font-black text-brand-blue transition hover:bg-brand-blue/5 dark:border-brand-yellow/20 dark:bg-white/[0.06] dark:text-white dark:hover:bg-brand-yellow/10 dark:hover:text-brand-yellow"
                  >
                    {t('auth.register.haveAccount', {
                      defaultValue: 'Already have an account? Sign in',
                    })}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

interface FieldProps {
  icon: LucideIcon;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
}

function Field({
  icon: Icon,
  label,
  value,
  onChange,
  error,
  type = 'text',
  placeholder,
  autoComplete,
}: FieldProps) {
  return (
    <label className="block text-sm font-bold dark:text-white">
      <span className="mb-2 block">{label}</span>

      <div className="relative">
        <Icon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground dark:text-white/40" />

        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={[
            'h-12 w-full rounded-2xl border bg-background px-4 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/35',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-red-400'
              : 'border-border focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:border-white/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10',
          ].join(' ')}
        />
      </div>

      {error ? (
        <p className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </label>
  );
}

interface PasswordFieldProps extends Omit<FieldProps, 'type'> {
  show: boolean;
  onToggleShow: () => void;
}

function PasswordField({
  icon: Icon,
  label,
  value,
  onChange,
  error,
  show,
  onToggleShow,
  autoComplete,
}: PasswordFieldProps) {
  return (
    <label className="block text-sm font-bold dark:text-white">
      <span className="mb-2 block">{label}</span>

      <div className="relative">
        <Icon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground dark:text-white/40" />

        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder="••••••••"
          className={[
            'h-12 w-full rounded-2xl border bg-background px-4 pe-12 ps-12 text-sm font-semibold outline-none transition placeholder:text-muted-foreground/60 dark:bg-white/[0.04] dark:text-white dark:placeholder:text-white/35',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:border-red-400'
              : 'border-border focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 dark:border-white/10 dark:focus:border-brand-yellow dark:focus:ring-brand-yellow/10',
          ].join(' ')}
        />

        <button
          type="button"
          onClick={onToggleShow}
          className="absolute end-3 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition hover:bg-secondary hover:text-foreground dark:text-white/45 dark:hover:bg-white/10 dark:hover:text-white"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error ? (
        <p className="mt-1.5 text-xs font-bold text-red-600 dark:text-red-300">
          {error}
        </p>
      ) : null}
    </label>
  );
}

function StatusMessage({
  type,
  message,
}: {
  type: 'success' | 'error';
  message: string;
}) {
  const isSuccess = type === 'success';

  return (
    <div
      className={[
        'flex items-start gap-3 rounded-2xl border p-4 text-sm font-bold leading-6',
        isSuccess
          ? 'border-green-500/30 bg-green-500/10 text-green-700 dark:border-green-400/25 dark:bg-green-400/10 dark:text-green-300'
          : 'border-red-500/30 bg-red-500/10 text-red-700 dark:border-red-400/25 dark:bg-red-400/10 dark:text-red-300',
      ].join(' ')}
    >
      {isSuccess ? (
        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
      ) : (
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
      )}

      <span>{message}</span>
    </div>
  );
}

interface SideFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

function SideFeature({ icon: Icon, title, description }: SideFeatureProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-yellow text-brand-blue">
        <Icon className="h-5 w-5" />
      </div>
      <p className="text-sm font-black leading-6 text-white">{title}</p>
      <p className="mt-2 text-xs font-semibold leading-6 text-white/62">
        {description}
      </p>
    </div>
  );
}
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Pencil,
  ShieldCheck,
  Sparkles,
//   WalletCards,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useParams } from 'react-router-dom';

import FinanceSubscriptionForm, {
  type FinanceSubscriptionFormPayload,
} from '@/features/admin/finance/components/FinanceSubscriptionForm';
import {
  getFinanceSubscriptionById,
  updateFinanceSubscription,
} from '@/features/admin/finance/services/finance-data.service';
import type { FinanceSubscriptionDetailsDto } from '@/features/admin/finance/types/finance.dto';

export default function FinanceSubscriptionEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { subscriptionId } = useParams<{ subscriptionId: string }>();

  const [subscription, setSubscription] =
    useState<FinanceSubscriptionDetailsDto | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadSubscription = async () => {
      setIsLoading(true);

      try {
        if (!subscriptionId) {
          setSubscription(null);
          return;
        }

        const response = await getFinanceSubscriptionById(subscriptionId);

        if (isMounted) {
          setSubscription(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadSubscription();

    return () => {
      isMounted = false;
    };
  }, [subscriptionId]);

  const handleUpdateSubscription = async (
    payload: FinanceSubscriptionFormPayload,
  ) => {
    if (!subscriptionId) return;

    setIsSubmitting(true);

    try {
      const updatedSubscription = await updateFinanceSubscription(
        subscriptionId,
        payload,
      );

      if (!updatedSubscription) {
        setSubscription(null);
        return;
      }

      setSubscription(updatedSubscription);
      setIsUpdated(true);

      window.setTimeout(() => {
        navigate(`/admin/finance/subscriptions/${updatedSubscription.id}`);
      }, 700);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <FinanceSubscriptionEditLoadingState />;
  }

  if (!subscription) {
    return (
      <main className="space-y-6">
        <BackToSubscription />

        <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-black">
            {t('financeSubscriptionEditPage.notFound.title')}
          </h1>

          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
            {t('financeSubscriptionEditPage.notFound.description')}
          </p>

          <Link
            to="/admin/finance"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-black text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-blue-dark dark:bg-brand-yellow dark:text-brand-blue"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t('financeSubscriptionEditPage.notFound.back')}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <BackToSubscription />

          <div className="mt-5 mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/5 px-4 py-2 text-sm font-black text-brand-blue dark:border-brand-yellow/20 dark:bg-brand-yellow/10 dark:text-brand-yellow">
            <Pencil className="h-4 w-4" />
            {t('financeSubscriptionEditPage.badge')}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
            {t('financeSubscriptionEditPage.title')}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t('financeSubscriptionEditPage.description')}
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm lg:max-w-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h2 className="text-lg font-black">
            {t('financeSubscriptionEditPage.sideCard.title')}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t('financeSubscriptionEditPage.sideCard.description')}
          </p>
        </div>
      </section>

      {isUpdated ? (
        <section className="rounded-[2rem] border border-green-200 bg-green-50 p-5 text-green-800 shadow-sm dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />

            <div>
              <h2 className="text-lg font-black">
                {t('financeSubscriptionEditPage.success.title')}
              </h2>

              <p className="mt-1 text-sm font-semibold leading-6">
                {t('financeSubscriptionEditPage.success.description')}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="rounded-[2.5rem] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-8 rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-sm font-black text-brand-blue">
                <Sparkles className="h-4 w-4" />
                {t('financeSubscriptionEditPage.formHeader.badge')}
              </div>

              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                {subscription.subscriptionCode}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
                {t('financeSubscriptionEditPage.formHeader.description')}
              </p>
            </div>

            <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm font-black text-white backdrop-blur">
              {subscription.studentName}
            </div>
          </div>
        </div>

        <FinanceSubscriptionForm
          mode="edit"
          isSubmitting={isSubmitting}
          submitLabel={t('financeSubscriptionEditPage.submitLabel')}
          initialValues={{
            studentId: subscription.studentId,
            studentName: subscription.studentName,
            studentCode: subscription.studentCode,

            parentId: subscription.parentId,
            parentName: subscription.parentName,
            parentPhone: subscription.parentPhone,

            programId: subscription.programId,
            programName: subscription.programName,

            branchId: subscription.branchId,
            branchName: subscription.branchName,

            plan: subscription.plan,
            status: subscription.status,

            startDate: subscription.startDate,
            endDate: subscription.endDate,

            sessionsIncluded: String(subscription.sessionsIncluded),
            sessionsUsed: String(subscription.sessionsUsed),

            currency: subscription.currency,

            baseAmount: String(subscription.baseAmount),
            discountType: subscription.discountType,
            discountValue: String(subscription.discountValue),

            paidAmount: String(subscription.paidAmount),
            nextPaymentDueDate: subscription.nextPaymentDueDate ?? '',

            notes: subscription.notes ?? '',
          }}
          onSubmit={handleUpdateSubscription}
        />
      </section>
    </main>
  );
}

function BackToSubscription() {
  const { t } = useTranslation();
  const { subscriptionId } = useParams<{ subscriptionId: string }>();

  return (
    <Link
      to={
        subscriptionId
          ? `/admin/finance/subscriptions/${subscriptionId}`
          : '/admin/finance'
      }
      className="inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
    >
      <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
      {t('financeSubscriptionEditPage.backToSubscription')}
    </Link>
  );
}

function FinanceSubscriptionEditLoadingState() {
  return (
    <main className="space-y-6">
      <div className="h-8 w-48 animate-pulse rounded-full bg-secondary" />

      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="h-8 w-40 animate-pulse rounded-full bg-secondary" />
          <div className="h-12 w-96 max-w-full animate-pulse rounded-2xl bg-secondary" />
          <div className="h-20 w-full max-w-2xl animate-pulse rounded-2xl bg-secondary" />
        </div>

        <div className="h-44 w-full animate-pulse rounded-[2rem] bg-secondary lg:max-w-sm" />
      </section>

      <div className="h-52 animate-pulse rounded-[2.5rem] bg-secondary" />

      <div className="space-y-6">
        <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
        <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
        <div className="h-72 animate-pulse rounded-[2rem] bg-secondary" />
      </div>
    </main>
  );
}
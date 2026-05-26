import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import CoachForm from "@/features/admin/coaches/components/CoachForm";
import { createCoach } from "@/features/admin/coaches/services/coaches.service";
import type { CreateCoachRequestDto } from "@/features/admin/coaches/types/coaches.dto";

export default function CoachNewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const handleCreateCoach = async (payload: CreateCoachRequestDto) => {
    setIsSubmitting(true);

    try {
      const createdCoach = await createCoach(payload);

      setIsCreated(true);

      window.setTimeout(() => {
        navigate(`/admin/coaches/${createdCoach.id}`);
      }, 700);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="space-y-8">
      <section className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <Link
            to="/admin/coaches"
            className="mb-5 inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("coachNewPage.backToCoaches")}
          </Link>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/5 px-4 py-2 text-sm font-black text-brand-blue dark:border-brand-yellow/20 dark:bg-brand-yellow/10 dark:text-brand-yellow">
            <Trophy className="h-4 w-4" />
            {t("coachNewPage.badge")}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
            {t("coachNewPage.title")}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t("coachNewPage.description")}
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm lg:max-w-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h2 className="text-lg font-black">
            {t("coachNewPage.sideCard.title")}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("coachNewPage.sideCard.description")}
          </p>
        </div>
      </section>

      {isCreated && (
        <section className="rounded-[2rem] border border-green-200 bg-green-50 p-5 text-green-800 shadow-sm dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />

            <div>
              <h2 className="text-lg font-black">
                {t("coachNewPage.success.title")}
              </h2>

              <p className="mt-1 text-sm font-semibold leading-6">
                {t("coachNewPage.success.description")}
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-[2.5rem] border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="mb-8 rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-sm font-black text-brand-blue">
                <Sparkles className="h-4 w-4" />
                {t("coachNewPage.formHeader.badge")}
              </div>

              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                {t("coachNewPage.formHeader.title")}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
                {t("coachNewPage.formHeader.description")}
              </p>
            </div>
          </div>
        </div>

        <CoachForm
          mode="create"
          isSubmitting={isSubmitting}
          submitLabel={t("coachNewPage.submitLabel")}
          onSubmit={handleCreateCoach}
        />
      </section>
    </main>
  );
}
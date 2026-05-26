import {
  ArrowLeft,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import ProgramForm from "@/features/admin/programs/components/ProgramForm";
import { createProgram } from "@/features/admin/programs/services/programs.service";
import type { CreateProgramRequestDto } from "@/features/admin/programs/types/programs.dto";

export default function ProgramNewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreated, setIsCreated] = useState(false);

  const handleCreateProgram = async (payload: CreateProgramRequestDto) => {
    setIsSubmitting(true);

    try {
      const createdProgram = await createProgram(payload);

      setIsCreated(true);

      window.setTimeout(() => {
        navigate(`/admin/programs/${createdProgram.id}`);
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
            to="/admin/programs"
            className="mb-5 inline-flex items-center gap-2 text-sm font-black text-brand-blue transition hover:text-brand-blue-dark dark:text-brand-yellow"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t("programNewPage.backToPrograms")}
          </Link>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/5 px-4 py-2 text-sm font-black text-brand-blue dark:border-brand-yellow/20 dark:bg-brand-yellow/10 dark:text-brand-yellow">
            <Layers className="h-4 w-4" />
            {t("programNewPage.badge")}
          </div>

          <h1 className="text-3xl font-black tracking-tight text-brand-blue dark:text-white sm:text-4xl">
            {t("programNewPage.title")}
          </h1>

          <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground sm:text-base">
            {t("programNewPage.description")}
          </p>
        </div>

        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm lg:max-w-sm">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white dark:bg-brand-yellow dark:text-brand-blue">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h2 className="text-lg font-black">
            {t("programNewPage.sideCard.title")}
          </h2>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {t("programNewPage.sideCard.description")}
          </p>
        </div>
      </section>

      {isCreated && (
        <section className="rounded-[2rem] border border-green-200 bg-green-50 p-5 text-green-800 shadow-sm dark:border-green-900/60 dark:bg-green-950/40 dark:text-green-200">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0" />

            <div>
              <h2 className="text-lg font-black">
                {t("programNewPage.success.title")}
              </h2>

              <p className="mt-1 text-sm font-semibold leading-6">
                {t("programNewPage.success.description")}
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
                {t("programNewPage.formHeader.badge")}
              </div>

              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                {t("programNewPage.formHeader.title")}
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/75 sm:text-base">
                {t("programNewPage.formHeader.description")}
              </p>
            </div>
          </div>
        </div>

        <ProgramForm
          mode="create"
          isSubmitting={isSubmitting}
          submitLabel={t("programNewPage.submitLabel")}
          onSubmit={handleCreateProgram}
        />
      </section>
    </main>
  );
}
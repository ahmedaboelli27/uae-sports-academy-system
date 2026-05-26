import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Layers,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useParams } from "react-router-dom";

import ProgramForm from "@/features/admin/programs/components/ProgramForm";
import {
  getProgramById,
  updateProgram,
} from "@/features/admin/programs/services/programs.service";

import type {
  CreateProgramRequestDto,
  ProgramDetailsDto,
} from "@/features/admin/programs/types/programs.dto";

export default function ProgramEditPage() {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { programId } = useParams<{
    programId: string;
  }>();

  const [program, setProgram] =
    useState<ProgramDetailsDto | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isUpdated, setIsUpdated] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProgram = async () => {
      try {
        if (!programId) {
          setProgram(null);
          return;
        }

        const response =
          await getProgramById(programId);

        if (isMounted) {
          setProgram(response);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadProgram();

    return () => {
      isMounted = false;
    };
  }, [programId]);

  const handleUpdateProgram = async (
    payload: CreateProgramRequestDto,
  ) => {
    if (!programId) return;

    setIsSubmitting(true);

    try {
      const updatedProgram =
        await updateProgram(
          programId,
          payload,
        );

      if (!updatedProgram) return;

      setProgram(updatedProgram);

      setIsUpdated(true);

      window.setTimeout(() => {
        navigate(
          `/admin/programs/${updatedProgram.id}`,
        );
      }, 700);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-52 animate-pulse rounded-full bg-secondary" />
        <div className="h-96 animate-pulse rounded-[2rem] bg-secondary" />
      </div>
    );
  }

  if (!program) {
    return (
      <main className="space-y-6">

        <Link
          to="/admin/programs"
          className="inline-flex items-center gap-2 text-sm font-black text-brand-blue"
        >
          <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
          {t(
            "programEditPage.backToPrograms",
          )}
        </Link>

        <section className="rounded-[2rem] border border-border bg-card p-8 text-center shadow-sm">

          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-red-100 text-red-700">

            <AlertTriangle className="h-8 w-8" />

          </div>

          <h1 className="text-2xl font-black">
            {t(
              "programEditPage.notFound.title",
            )}
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            {t(
              "programEditPage.notFound.description",
            )}
          </p>

        </section>

      </main>
    );
  }

  return (
    <main className="space-y-8">

      <section className="flex flex-col gap-5 lg:flex-row lg:justify-between">

        <div>

          <Link
            to="/admin/programs"
            className="mb-5 inline-flex items-center gap-2 text-sm font-black text-brand-blue"
          >
            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
            {t(
              "programEditPage.backToPrograms",
            )}
          </Link>

          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-brand-blue/10 bg-brand-blue/5 px-4 py-2 text-sm font-black text-brand-blue">

            <Layers className="h-4 w-4" />

            {t(
              "programEditPage.badge",
            )}

          </div>

          <h1 className="text-3xl font-black">

            {t(
              "programEditPage.title",
            )}

          </h1>

        </div>

        <div className="rounded-[2rem] border border-border bg-card p-5 shadow-sm">

          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue text-white">

            <ShieldCheck className="h-6 w-6" />

          </div>

          <h2 className="font-black">

            {t(
              "programEditPage.sideCard.title",
            )}

          </h2>

        </div>

      </section>

      {isUpdated && (
        <section className="rounded-[2rem] border border-green-200 bg-green-50 p-5">

          <div className="flex items-start gap-3">

            <CheckCircle2 className="h-6 w-6" />

            <div>

              <h2 className="font-black">
                {t(
                  "programEditPage.success.title",
                )}
              </h2>

              <p className="text-sm">

                {t(
                  "programEditPage.success.description",
                )}

              </p>

            </div>

          </div>

        </section>
      )}

      <section className="rounded-[2.5rem] border border-border bg-card p-6">

        <div className="mb-8 rounded-[2rem] bg-gradient-to-br from-brand-blue via-brand-blue-dark to-brand-dark p-6 text-white">

          <div className="inline-flex items-center gap-2 rounded-full bg-brand-yellow px-4 py-2 text-sm font-black text-brand-blue">

            <Sparkles className="h-4 w-4" />

            {t(
              "programEditPage.formHeader.badge",
            )}

          </div>

        </div>

        <ProgramForm
          mode="edit"
          isSubmitting={isSubmitting}
          submitLabel={t(
            "programEditPage.submitLabel",
          )}
          initialValues={{
            name: program.name,
            shortDescription:
              program.shortDescription,
            description:
              program.description,

            sportType:
              program.sportType,

            level:
              program.level,

            ageGroup:
              program.ageGroup,

            status:
              program.status,

            enrollmentStatus:
              program.enrollmentStatus,

            minAge:
              String(program.minAge),

            maxAge:
              String(program.maxAge),

            durationWeeks:
              String(
                program.durationWeeks,
              ),

            sessionsPerWeek:
              String(
                program.sessionsPerWeek,
              ),

            sessionDurationMinutes:
              String(
                program.sessionDurationMinutes,
              ),

            monthlyPrice:
              String(
                program.monthlyPrice,
              ),

            objectivesText:
              program.objectives.join(
                "\n",
              ),

            requirementsText:
              program.requirements.join(
                "\n",
              ),

            coverImageUrl:
              program.coverImageUrl ??
              "",

            notes:
              program.notes ?? "",
          }}
          onSubmit={
            handleUpdateProgram
          }
        />

      </section>

    </main>
  );
}
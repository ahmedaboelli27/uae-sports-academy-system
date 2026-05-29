import BrandLogo from "@/components/shared/BrandLogo";
import { useSiteSettings } from "@/features/settings/hooks/use-site-settings";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

function PublicFooter() {
  const { t } = useTranslation();
  const { settings } = useSiteSettings();

  return (
    <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-brand-dark">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div>
          <BrandLogo
            size="md"
            showText
            logoSrc={settings.branding.logoUrl || undefined}
            shortName={settings.branding.shortName}
            academyName={settings.branding.academyName}
          />

          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500 dark:text-slate-300">
            {settings.branding.academyName} - {t("brand.tagline")} {t("footer.description")}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 text-sm font-bold text-slate-500 dark:text-slate-300">
          <Link
            to="/privacy"
            className="hover:text-brand-blue dark:hover:text-brand-yellow"
          >
            {t("common.privacyPolicy")}
          </Link>

          <Link
            to="/terms"
            className="hover:text-brand-blue dark:hover:text-brand-yellow"
          >
            {t("common.termsConditions")}
          </Link>

          <Link
            to="/contact"
            className="hover:text-brand-blue dark:hover:text-brand-yellow"
          >
            {t("common.contact")}
          </Link>
        </div>
      </div>
    </footer>
  );
}

export { PublicFooter };
export default PublicFooter;
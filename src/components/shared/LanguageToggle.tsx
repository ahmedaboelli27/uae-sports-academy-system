import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function LanguageToggle() {
    const { i18n } = useTranslation();

    const currentLanguage = i18n.language?.startsWith("ar") ? "ar" : "en";
    const nextLanguage = currentLanguage === "ar" ? "en" : "ar";

    useEffect(() => {
        document.documentElement.lang = currentLanguage;
        document.documentElement.dir = currentLanguage === "ar" ? "rtl" : "ltr";
        localStorage.setItem("aspirex-language", currentLanguage);
    }, [currentLanguage]);

    const handleToggleLanguage = async () => {
        await i18n.changeLanguage(nextLanguage);

        document.documentElement.lang = nextLanguage;
        document.documentElement.dir = nextLanguage === "ar" ? "rtl" : "ltr";
        localStorage.setItem("aspirex-language", nextLanguage);
    };

    return (
        <button
            type="button"
            onClick={handleToggleLanguage}
            className={cn(
                "inline-flex h-10 items-center justify-center gap-2 rounded-full border px-3 text-sm font-black shadow-sm transition",
                "border-slate-200 bg-white text-brand-blue hover:-translate-y-0.5 hover:border-brand-yellow hover:shadow-md",
                "dark:border-slate-700 dark:bg-brand-navy dark:text-brand-yellow dark:hover:border-brand-yellow",
            )}
            aria-label="Change language"
            title="Change language"
        >
            <Languages className="h-4 w-4" />
            <span>{currentLanguage === "ar" ? "EN" : "AR"}</span>
        </button>
    );
}

export default LanguageToggle;
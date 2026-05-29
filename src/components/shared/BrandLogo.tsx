import { brandConfig } from "@/config/brand.config";
import { cn } from "@/lib/utils";

type BrandLogoSize = "sm" | "md" | "lg" | "xl";
type BrandLogoVariant = "default" | "compact" | "white";

interface BrandLogoProps {
    size?: BrandLogoSize;
    showText?: boolean;
    variant?: BrandLogoVariant;
    className?: string;
    logoSrc?: string;
    darkLogoSrc?: string;
    shortName?: string;
    academyName?: string;
}

const logoSizeClasses: Record<BrandLogoSize, string> = {
    sm: "h-9 w-9",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
};

const textSizeClasses: Record<BrandLogoSize, string> = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
    xl: "text-3xl",
};

function BrandLogo({
    size = "md",
    showText = true,
    variant = "default",
    className,
    logoSrc,
    darkLogoSrc,
    shortName,
    academyName,
}: BrandLogoProps) {
    const isWhite = variant === "white";
    const resolvedLogo =
        variant === "white" && darkLogoSrc
            ? darkLogoSrc
            : logoSrc || brandConfig.logo;
    const resolvedShortName = shortName || brandConfig.shortName;
    const resolvedAcademyName = academyName || brandConfig.academyName;

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <img
                src={resolvedLogo}
                alt={`${resolvedAcademyName} logo`}
                className={cn(
                    "shrink-0 object-contain",
                    logoSizeClasses[size],
                    variant === "compact" && "rounded-xl",
                )}
            />

            {showText && (
                <div className="min-w-0">
                    <p
                        className={cn(
                            "truncate font-black leading-tight tracking-tight",
                            textSizeClasses[size],
                            isWhite ? "text-white" : "text-brand-blue dark:text-white",
                        )}
                    >
                        {resolvedShortName}
                    </p>

                    <p
                        className={cn(
                            "truncate text-xs font-semibold",
                            isWhite
                                ? "text-white/70"
                                : "text-brand-gray dark:text-slate-300",
                        )}
                    >
                        Sports Academy
                    </p>
                </div>
            )}
        </div>
    );
}

export default BrandLogo;
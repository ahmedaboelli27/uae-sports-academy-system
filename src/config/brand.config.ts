import aspirexLogo from "@/assets/logos/aspirex-logo.png";

export const brandConfig = {
    academyName: "AspireX Sports Academy",
    shortName: "AspireX",
    tagline: "Train. Grow. Compete.",
    logo: aspirexLogo,

    colors: {
        primaryBlue: "#00129B",
        darkRoyalBlue: "#000B73",
        yellow: "#FFD400",
        white: "#FFFFFF",
        textGray: "#5F6368",
        darkBackground: "#050816",
    },

    contact: {
        phone: "+971 00 000 0000",
        email: "info@aspirexacademy.com",
        location: "United Arab Emirates",
    },

    social: {
        instagram: "#",
        facebook: "#",
        x: "#",
        linkedin: "#",
    },
} as const;

export type BrandConfig = typeof brandConfig;
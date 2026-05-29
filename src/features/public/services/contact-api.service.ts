import { getJson, postJson } from '@/services/api/http';

export interface PublicContactInfoDto {
    contact: {
        phone: string;
        whatsapp: string;
        email: string;
        address: string;
        city: string;
        country: string;
        workingHours: string;
    };
    social: {
        instagramUrl: string;
        facebookUrl: string;
        tiktokUrl: string;
        youtubeUrl: string;
        linkedinUrl: string;
        websiteUrl: string;
    };
    branding: {
        academyName: string;
        shortName: string;
        logoUrl: string;
        darkLogoUrl: string;
        faviconUrl: string;
        primaryColor: string;
        secondaryColor: string;
    };
    system: {
        trialBookingEnabled: boolean;
        registrationEnabled: boolean;
    };
}

export interface CreateContactMessagePayload {
    subject: string;
    category?: string;
    message: string;
    preferredContactMethod?: 'Email' | 'Phone' | 'WhatsApp' | 'In-app';
}

export interface ContactMessageDto {
    id: string;
    messageCode: string;
    subject: string;
    category: string;
    message: string;
    preferredContactMethod: string;
    status: string;
    priority: string;
    adminReply?: string | null;
    internalNote?: string | null;
    createdAt: string;
    updatedAt: string;
}

export async function getPublicContactInfo() {
    return getJson<PublicContactInfoDto>('/api/public/contact');
}

export async function sendContactMessage(payload: CreateContactMessagePayload) {
    return postJson<ContactMessageDto, CreateContactMessagePayload>(
        '/api/contact/messages',
        payload,
    );
}

export async function getMyContactMessages() {
    return getJson<ContactMessageDto[]>('/api/contact/messages');
}
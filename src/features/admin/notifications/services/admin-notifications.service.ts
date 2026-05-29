import { axiosClient } from '@/services/api/axios-client';
import { getJson } from '@/services/api/http';

export type ContactMessageStatus = 'NEW' | 'READ' | 'REPLIED' | 'CLOSED';
export type ContactMessagePriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';

export interface AdminContactMessageUserDto {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string | null;
    roleCode?: string;
}

export interface AdminContactMessageDto {
    id: string;
    messageCode: string;
    userId: string;
    subject: string;
    category: string;
    message: string;
    preferredContactMethod: string;
    status: ContactMessageStatus;
    priority: ContactMessagePriority;
    adminReply?: string | null;
    internalNote?: string | null;
    readAt?: string | null;
    repliedAt?: string | null;
    closedAt?: string | null;
    createdAt: string;
    updatedAt: string;
    user?: AdminContactMessageUserDto;
}

export interface AdminContactMessagesSummaryDto {
    total: number;
    new: number;
    replied: number;
    urgent: number;
}

export interface AdminContactMessagesResponseDto {
    items: AdminContactMessageDto[];
    summary: AdminContactMessagesSummaryDto;
}

export interface LoadAdminNotificationsParams {
    search?: string;
    status?: ContactMessageStatus | 'ALL';
    priority?: ContactMessagePriority | 'ALL';
}

function buildQuery(params: LoadAdminNotificationsParams = {}) {
    const query = new URLSearchParams();

    if (params.search?.trim()) {
        query.set('search', params.search.trim());
    }

    if (params.status && params.status !== 'ALL') {
        query.set('status', params.status);
    }

    if (params.priority && params.priority !== 'ALL') {
        query.set('priority', params.priority);
    }

    const value = query.toString();

    return value ? `?${value}` : '';
}

export async function loadAdminNotificationInbox(
    params: LoadAdminNotificationsParams = {},
) {
    return getJson<AdminContactMessagesResponseDto>(
        `/api/admin/contact-messages${buildQuery(params)}`,
    );
}

export async function getAdminUnreadNotificationCount() {
    const data = await loadAdminNotificationInbox();

    return data.summary.new;
}

export async function markContactNotificationAsRead(messageId: string) {
    const response = await axiosClient.patch(
        `/api/admin/contact-messages/${messageId}`,
        {
            status: 'READ',
        },
    );

    return response.data;
}
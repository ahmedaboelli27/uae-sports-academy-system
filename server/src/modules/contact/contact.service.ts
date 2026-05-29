import {
    BadRequestException,
    Inject,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import {
    ContactMessagePriority,
    ContactMessageStatus,
    Prisma,
} from '@prisma/client';

import { PrismaService } from '../../prisma/prisma.service.js';
import { SettingsService } from '../settings/settings.service.js';
import { CreateContactMessageDto } from './dto/create-contact-message.dto.js';
import { UpdateContactMessageDto } from './dto/update-contact-message.dto.js';

interface AuthUser {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    roleCode?: string;
    role?: string;
    phone?: string | null;
}

interface AdminContactMessageFilters {
    search?: string;
    status?: ContactMessageStatus;
    priority?: ContactMessagePriority;
}

@Injectable()
export class ContactService {
    constructor(
        @Inject(PrismaService)
        private readonly prisma: PrismaService,

        @Inject(SettingsService)
        private readonly settingsService: SettingsService,
    ) { }

    async getPublicContactInfo() {
        const settings = await this.settingsService.getPublicSettings();

        return {
            contact: settings.contact,
            social: settings.social,
            branding: settings.branding,
            system: {
                trialBookingEnabled: settings.system.trialBookingEnabled,
                registrationEnabled: settings.system.registrationEnabled,
            },
        };
    }

    async createMessage(user: AuthUser | undefined, dto: CreateContactMessageDto) {
        if (!user?.id) {
            throw new BadRequestException('Login is required to send a message.');
        }

        const messageCode = await this.generateMessageCode();

        return this.prisma.contactMessage.create({
            data: {
                messageCode,
                userId: user.id,
                subject: dto.subject.trim(),
                category: dto.category?.trim() || 'General',
                message: dto.message.trim(),
                preferredContactMethod: dto.preferredContactMethod || 'Email',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        roleCode: true,
                    },
                },
            },
        });
    }

    async getMyMessages(user: AuthUser | undefined) {
        if (!user?.id) {
            throw new BadRequestException('Login is required.');
        }

        return this.prisma.contactMessage.findMany({
            where: {
                userId: user.id,
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
    }

    async getAdminMessages(filters: AdminContactMessageFilters) {
        const where: Prisma.ContactMessageWhereInput = {
            deletedAt: null,
        };

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.priority) {
            where.priority = filters.priority;
        }

        if (filters.search?.trim()) {
            const search = filters.search.trim();

            where.OR = [
                { messageCode: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } },
                { category: { contains: search, mode: 'insensitive' } },
                { message: { contains: search, mode: 'insensitive' } },
                {
                    user: {
                        email: { contains: search, mode: 'insensitive' },
                    },
                },
                {
                    user: {
                        firstName: { contains: search, mode: 'insensitive' },
                    },
                },
                {
                    user: {
                        lastName: { contains: search, mode: 'insensitive' },
                    },
                },
            ];
        }

        const [items, total, newCount, repliedCount, urgentCount] =
            await Promise.all([
                this.prisma.contactMessage.findMany({
                    where,
                    orderBy: {
                        createdAt: 'desc',
                    },
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                firstName: true,
                                lastName: true,
                                phone: true,
                                roleCode: true,
                            },
                        },
                    },
                }),
                this.prisma.contactMessage.count({
                    where: { deletedAt: null },
                }),
                this.prisma.contactMessage.count({
                    where: { deletedAt: null, status: ContactMessageStatus.NEW },
                }),
                this.prisma.contactMessage.count({
                    where: { deletedAt: null, status: ContactMessageStatus.REPLIED },
                }),
                this.prisma.contactMessage.count({
                    where: {
                        deletedAt: null,
                        priority: ContactMessagePriority.URGENT,
                    },
                }),
            ]);

        return {
            items,
            summary: {
                total,
                new: newCount,
                replied: repliedCount,
                urgent: urgentCount,
            },
        };
    }

    async getAdminMessageById(id: string) {
        const message = await this.prisma.contactMessage.findFirst({
            where: {
                id,
                deletedAt: null,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        roleCode: true,
                    },
                },
            },
        });

        if (!message) {
            throw new NotFoundException('Contact message not found.');
        }

        return message;
    }

    async updateAdminMessage(id: string, dto: UpdateContactMessageDto) {
        const existing = await this.prisma.contactMessage.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });

        if (!existing) {
            throw new NotFoundException('Contact message not found.');
        }

        const data: Prisma.ContactMessageUpdateInput = {
            priority: dto.priority,
            internalNote: dto.internalNote,
        };

        if (dto.status) {
            data.status = dto.status;

            if (dto.status === ContactMessageStatus.READ && !existing.readAt) {
                data.readAt = new Date();
            }

            if (dto.status === ContactMessageStatus.CLOSED && !existing.closedAt) {
                data.closedAt = new Date();
            }
        }

        if (dto.adminReply !== undefined) {
            data.adminReply = dto.adminReply;

            if (dto.adminReply.trim()) {
                data.status = ContactMessageStatus.REPLIED;
                data.repliedAt = new Date();
            }
        }

        return this.prisma.contactMessage.update({
            where: { id },
            data,
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                        phone: true,
                        roleCode: true,
                    },
                },
            },
        });
    }

    private async generateMessageCode() {
        const today = new Date();
        const datePart = today.toISOString().slice(0, 10).replaceAll('-', '');
        const count = await this.prisma.contactMessage.count();

        return `MSG-${datePart}-${String(count + 1).padStart(4, '0')}`;
    }
}
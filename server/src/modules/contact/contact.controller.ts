import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import {
    ContactMessagePriority,
    ContactMessageStatus,
    UserRole,
} from '@prisma/client';

import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ContactService } from './contact.service.js';
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

@Controller()
export class ContactController {
    constructor(
        @Inject(ContactService)
        private readonly contactService: ContactService,
    ) { }

    @Get('public/contact')
    async getPublicContactInfo() {
        const data = await this.contactService.getPublicContactInfo();

        return {
            success: true,
            message: 'Public contact information loaded successfully',
            data,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Post('contact/messages')
    async createMessage(
        @CurrentUser() user: AuthUser,
        @Body() body: CreateContactMessageDto,
    ) {
        const data = await this.contactService.createMessage(user, body);

        return {
            success: true,
            message: 'Message sent successfully',
            data,
        };
    }

    @UseGuards(JwtAuthGuard)
    @Get('contact/messages')
    async getMyMessages(@CurrentUser() user: AuthUser) {
        const data = await this.contactService.getMyMessages(user);

        return {
            success: true,
            message: 'Messages loaded successfully',
            data,
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('admin/contact-messages')
    async getAdminMessages(
        @Query('search') search?: string,
        @Query('status') status?: ContactMessageStatus,
        @Query('priority') priority?: ContactMessagePriority,
    ) {
        const data = await this.contactService.getAdminMessages({
            search,
            status,
            priority,
        });

        return {
            success: true,
            message: 'Contact messages loaded successfully',
            data,
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Get('admin/contact-messages/:id')
    async getAdminMessageById(@Param('id') id: string) {
        const data = await this.contactService.getAdminMessageById(id);

        return {
            success: true,
            message: 'Contact message loaded successfully',
            data,
        };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch('admin/contact-messages/:id')
    async updateAdminMessage(
        @Param('id') id: string,
        @Body() body: UpdateContactMessageDto,
    ) {
        const data = await this.contactService.updateAdminMessage(id, body);

        return {
            success: true,
            message: 'Contact message updated successfully',
            data,
        };
    }
}
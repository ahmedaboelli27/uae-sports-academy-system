import { ContactMessagePriority, ContactMessageStatus } from '@prisma/client';
import { IsEnum, IsOptional, IsString, Length } from 'class-validator';

export class UpdateContactMessageDto {
    @IsOptional()
    @IsEnum(ContactMessageStatus)
    status?: ContactMessageStatus;

    @IsOptional()
    @IsEnum(ContactMessagePriority)
    priority?: ContactMessagePriority;

    @IsOptional()
    @IsString()
    @Length(0, 3000)
    adminReply?: string;

    @IsOptional()
    @IsString()
    @Length(0, 3000)
    internalNote?: string;
}
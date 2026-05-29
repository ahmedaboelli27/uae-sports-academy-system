import { IsIn, IsOptional, IsString, Length } from 'class-validator';

export class CreateContactMessageDto {
    @IsString()
    @Length(3, 140)
    subject!: string;

    @IsOptional()
    @IsString()
    category?: string;

    @IsString()
    @Length(10, 3000)
    message!: string;

    @IsOptional()
    @IsString()
    @IsIn(['Email', 'Phone', 'WhatsApp', 'In-app'])
    preferredContactMethod?: string;
}
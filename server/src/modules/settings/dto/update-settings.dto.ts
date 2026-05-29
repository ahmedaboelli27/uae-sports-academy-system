import { IsIn, IsObject, IsOptional } from 'class-validator';
import { SETTINGS_GROUPS } from '../settings.constants.js';

const groups = Object.keys(SETTINGS_GROUPS);

export class UpdateSettingsDto {
  @IsOptional()
  @IsIn(groups)
  group?: string;

  @IsObject()
  values!: Record<string, string | boolean>;
}

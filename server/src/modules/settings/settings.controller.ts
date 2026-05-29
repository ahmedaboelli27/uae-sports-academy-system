import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { Roles } from '../auth/decorators/roles.decorator.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { UpdateSettingsDto } from './dto/update-settings.dto.js';
import { SettingsService } from './settings.service.js';

@Controller()
export class SettingsController {
  constructor(
    @Inject(SettingsService)
    private readonly settingsService: SettingsService,
  ) { }

  @Get('public/site-settings')
  async getPublicSettings() {
    const data = await this.settingsService.getPublicSettings();

    return {
      success: true,
      message: 'Public site settings loaded successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/settings')
  async getAdminSettings() {
    const data = await this.settingsService.getAllSettings();

    return {
      success: true,
      message: 'Admin settings loaded successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Get('admin/settings/:group')
  async getAdminSettingsGroup(@Param('group') group: string) {
    const data = await this.settingsService.getSettingsByGroup(group);

    return {
      success: true,
      message: 'Admin settings group loaded successfully',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Patch('admin/settings')
  async updateAdminSettings(@Body() body: UpdateSettingsDto) {
    const data = await this.settingsService.updateSettings(
      body.group,
      body.values,
    );

    return {
      success: true,
      message: 'Settings updated successfully',
      data,
    };
  }
}
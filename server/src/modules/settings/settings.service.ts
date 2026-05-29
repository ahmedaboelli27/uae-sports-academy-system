import { Inject, Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service.js';
import {
  PUBLIC_SETTINGS_GROUPS,
  SETTINGS_DEFAULTS,
  type SettingsGroup,
  type SettingsMap,
} from './settings.constants.js';

@Injectable()
export class SettingsService {
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  private normalizeGroup(group: string): SettingsGroup | null {
    const found = Object.keys(SETTINGS_DEFAULTS).find((key) => key === group);
    return (found as SettingsGroup | undefined) ?? null;
  }

  private getDefaultGroup(group: SettingsGroup): SettingsMap {
    return { ...SETTINGS_DEFAULTS[group] };
  }

  private mergeValues(
    defaults: SettingsMap,
    rows: Array<{ key: string; value: unknown }>,
  ): SettingsMap {
    const merged: SettingsMap = { ...defaults };

    for (const row of rows) {
      if (typeof row.value === 'string' || typeof row.value === 'boolean') {
        merged[row.key] = row.value;
      }
    }

    return merged;
  }

  async getAllSettings() {
    const rows = await this.prisma.siteSetting.findMany();

    const byGroup = new Map<string, Array<{ key: string; value: unknown }>>();

    for (const row of rows) {
      const list = byGroup.get(row.group) ?? [];
      list.push({ key: row.key, value: row.value });
      byGroup.set(row.group, list);
    }

    return Object.keys(SETTINGS_DEFAULTS).reduce<Record<string, SettingsMap>>(
      (acc, groupKey) => {
        const group = groupKey as SettingsGroup;
        const defaults = this.getDefaultGroup(group);
        const groupRows = byGroup.get(group) ?? [];

        acc[group] = this.mergeValues(defaults, groupRows);
        return acc;
      },
      {},
    );
  }

  async getSettingsByGroup(group: string) {
    const normalized = this.normalizeGroup(group);

    if (!normalized) {
      return null;
    }

    const defaults = this.getDefaultGroup(normalized);

    const rows = await this.prisma.siteSetting.findMany({
      where: { group: normalized },
      select: { key: true, value: true },
    });

    return this.mergeValues(defaults, rows);
  }

  async updateSettings(
    group: string | undefined,
    values: Record<string, string | boolean>,
  ) {
    const updates: Array<Promise<unknown>> = [];

    if (group) {
      const normalized = this.normalizeGroup(group);

      if (!normalized) {
        return null;
      }

      for (const [key, value] of Object.entries(values)) {
        updates.push(
          this.prisma.siteSetting.upsert({
            where: { key },
            update: { value, group: normalized },
            create: { key, value, group: normalized },
          }),
        );
      }
    } else {
      for (const [groupKey, groupDefaults] of Object.entries(
        SETTINGS_DEFAULTS,
      )) {
        for (const key of Object.keys(groupDefaults)) {
          if (values[key] !== undefined) {
            updates.push(
              this.prisma.siteSetting.upsert({
                where: { key },
                update: { value: values[key], group: groupKey },
                create: { key, value: values[key], group: groupKey },
              }),
            );
          }
        }
      }
    }

    await Promise.all(updates);

    return this.getAllSettings();
  }

  async getPublicSettings() {
    const all = await this.getAllSettings();

    const filtered: Record<string, SettingsMap> = {};

    for (const group of PUBLIC_SETTINGS_GROUPS) {
      filtered[group] = all[group];
    }

    return filtered;
  }
}
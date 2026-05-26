const BASE = '2024-06-01T08:00:00.000Z';

export function seedTimestamps(offsetDays = 0): {
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
} {
  const d = new Date(BASE);
  d.setDate(d.getDate() + offsetDays);
  const iso = d.toISOString();
  return { createdAt: iso, updatedAt: iso, deletedAt: null };
}

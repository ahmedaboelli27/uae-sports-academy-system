import { USE_MOCK_API } from '@/config/api-mode';
import { mockDb } from '@/services/mock/mock-db';
import { getPublicHomeContent, getPublicLoginShowcase } from './public-api.service';
import type { PublicHomeContentDto } from '../types/public-content.dto';

const fallback: PublicHomeContentDto = {
  kpis: [
    { key: 'students', label: 'Active players', value: '1,200+' },
    { key: 'coaches', label: 'Professional coaches', value: '35+' },
    { key: 'branches', label: 'Training branches', value: '8' },
    { key: 'satisfaction', label: 'Parent satisfaction', value: '94%' },
  ],
  programs: [
    { id: 'p-1', title: 'Football Program', age: 'Ages 5-16', level: 'Beginner to advanced', description: 'Progressive technical and tactical training.' },
    { id: 'p-2', title: 'Swimming Program', age: 'Ages 4-14', level: 'Foundation to pro', description: 'Safe sessions to build water confidence and stamina.' },
    { id: 'p-3', title: 'Basketball Program', age: 'Ages 7-16', level: 'Beginner to competitive', description: 'Skills, dribbling, defense, and team play.' },
  ],
  branches: [
    { id: 'b-1', city: 'Dubai', location: 'Modern training fields near communities.', schedule: 'Sunday - Thursday | 4 PM - 9 PM' },
    { id: 'b-2', city: 'Abu Dhabi', location: 'Safe facilities for young players and families.', schedule: 'Saturday - Wednesday | 5 PM - 10 PM' },
    { id: 'b-3', city: 'Sharjah', location: 'Family-friendly branch for children and beginners.', schedule: 'Friday - Tuesday | 4 PM - 8 PM' },
  ],
  gallery: [
    { id: 'g-1', title: 'Team training', subtitle: 'Team spirit and discipline' },
    { id: 'g-2', title: 'Skill development', subtitle: 'Training drills for every level' },
    { id: 'g-3', title: 'Professional sessions', subtitle: 'Specialized coaches and clear plans' },
    { id: 'g-4', title: 'Safe environment', subtitle: 'Continuous tracking and family-friendly experience' },
  ],
  loginShowcase: {
    features: [
      { id: 'f-kpi', title: 'KPI dashboards' },
      { id: 'f-ops', title: 'Academy operations' },
      { id: 'f-attendance', title: 'Attendance tracking' },
    ],
    metrics: [
      { id: 'm-players', value: '1,200+', label: 'Players' },
      { id: 'm-coaches', value: '35+', label: 'Coaches' },
      { id: 'm-branches', value: '8', label: 'Branches' },
    ],
  },
};

function mockHomeContent(): PublicHomeContentDto {
  return {
    ...fallback,
    kpis: [
      { key: 'students', label: 'Active players', value: `${mockDb.students.length}+` },
      { key: 'coaches', label: 'Professional coaches', value: `${mockDb.coaches.length}+` },
      { key: 'branches', label: 'Training branches', value: `${mockDb.branches.length}` },
      { key: 'satisfaction', label: 'Parent satisfaction', value: '94%' },
    ],
  };
}

export async function loadPublicHomeContent(): Promise<PublicHomeContentDto> {
  if (USE_MOCK_API) return mockHomeContent();
  try {
    return await getPublicHomeContent();
  } catch {
    return fallback;
  }
}

export async function loadPublicLoginShowcase(): Promise<PublicHomeContentDto['loginShowcase']> {
  if (USE_MOCK_API) return mockHomeContent().loginShowcase;
  try {
    return await getPublicLoginShowcase();
  } catch {
    return fallback.loginShowcase;
  }
}

export const publicFallbackContent = fallback;

import { ENDPOINTS } from '@/services/api/endpoints';
import { getJson } from '@/services/api/http';
import type { PublicHomeContentDto } from '../types/public-content.dto';

interface BackendResponse {
  kpis?: Array<{ key?: string; label?: string; value?: string }>;
  programs?: Array<{ id?: string; title?: string; age?: string; level?: string; description?: string; image?: string }>;
  branches?: Array<{ id?: string; city?: string; location?: string; schedule?: string }>;
  gallery?: Array<{ id?: string; title?: string; subtitle?: string; image?: string }>;
  loginShowcase?: {
    features?: Array<{ id?: string; title?: string }>;
    metrics?: Array<{ id?: string; label?: string; value?: string }>;
  };
}

function normalize(data: BackendResponse): PublicHomeContentDto {
  return {
    kpis: (data.kpis ?? []).map((item, index) => ({
      key: item.key ?? `kpi-${index}`,
      label: item.label ?? '',
      value: item.value ?? '',
    })),
    programs: (data.programs ?? []).map((item, index) => ({
      id: item.id ?? `program-${index}`,
      title: item.title ?? '',
      age: item.age ?? '',
      level: item.level ?? '',
      description: item.description ?? '',
      image: item.image,
    })),
    branches: (data.branches ?? []).map((item, index) => ({
      id: item.id ?? `branch-${index}`,
      city: item.city ?? '',
      location: item.location ?? '',
      schedule: item.schedule ?? '',
    })),
    gallery: (data.gallery ?? []).map((item, index) => ({
      id: item.id ?? `gallery-${index}`,
      title: item.title ?? '',
      subtitle: item.subtitle ?? '',
      image: item.image,
    })),
    loginShowcase: {
      features: (data.loginShowcase?.features ?? []).map((item, index) => ({
        id: item.id ?? `feature-${index}`,
        title: item.title ?? '',
      })),
      metrics: (data.loginShowcase?.metrics ?? []).map((item, index) => ({
        id: item.id ?? `metric-${index}`,
        label: item.label ?? '',
        value: item.value ?? '',
      })),
    },
  };
}

export async function getPublicHomeContent(): Promise<PublicHomeContentDto> {
  const data = await getJson<BackendResponse>(ENDPOINTS.public.home);
  return normalize(data);
}

export async function getPublicLoginShowcase(): Promise<PublicHomeContentDto['loginShowcase']> {
  const data = await getJson<BackendResponse['loginShowcase']>(ENDPOINTS.public.loginShowcase);
  return {
    features: (data?.features ?? []).map((item, index) => ({
      id: item.id ?? `feature-${index}`,
      title: item.title ?? '',
    })),
    metrics: (data?.metrics ?? []).map((item, index) => ({
      id: item.id ?? `metric-${index}`,
      label: item.label ?? '',
      value: item.value ?? '',
    })),
  };
}

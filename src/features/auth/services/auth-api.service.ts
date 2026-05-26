import { ENDPOINTS } from '@/services/api/endpoints';
import { getJson, postJson } from '@/services/api/http';
import type { LoginCredentialsDto, LoginResponseDto, RegisterPayloadDto } from '../types/auth.dto';

function mapRole(role: string): 'admin' | 'coach' | 'parent' {
  const normalized = role.toLowerCase();
  if (normalized === 'admin') return 'admin';
  if (normalized === 'coach') return 'coach';
  return 'parent';
}

export async function login(credentials: LoginCredentialsDto): Promise<LoginResponseDto> {
  const response = await postJson<{ token?: string; user: Record<string, unknown> }, LoginCredentialsDto>(
    ENDPOINTS.auth.login,
    credentials,
  );
  return {
    token: response.token,
    user: {
      id: String(response.user.id ?? ''),
      email: String(response.user.email ?? ''),
      firstName: String(response.user.firstName ?? ''),
      lastName: String(response.user.lastName ?? ''),
      phone: (response.user.phone as string | null | undefined) ?? null,
      role: mapRole(String(response.user.role ?? 'parent')),
      locale: String(response.user.locale ?? 'en'),
      status: String(response.user.status ?? ''),
    },
  };
}

export async function register(payload: RegisterPayloadDto) {
  const backendPayload = {
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email.toLowerCase(),
    phone: payload.phone,
    password: payload.password,
    role: payload.role?.toUpperCase() ?? 'PARENT',
  };
  return postJson(ENDPOINTS.auth.register, backendPayload);
}

export async function getMe() {
  const me = await getJson<Record<string, unknown>>(ENDPOINTS.auth.me);
  return {
    id: String(me.id ?? ''),
    email: String(me.email ?? ''),
    firstName: String(me.firstName ?? ''),
    lastName: String(me.lastName ?? ''),
    phone: (me.phone as string | null | undefined) ?? null,
    role: mapRole(String(me.role ?? 'parent')),
    locale: String(me.locale ?? 'en'),
    status: String(me.status ?? ''),
  };
}

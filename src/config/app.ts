export const APP_NAME = import.meta.env.VITE_APP_NAME ?? 'AspireX Sports Academy';
/** Express origin (no `/api` suffix — paths include `/api/...`) */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000';
export const DEFAULT_LOCALE = import.meta.env.VITE_DEFAULT_LOCALE ?? 'en';

export { USE_MOCK_API } from '@/config/api-mode';

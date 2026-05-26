import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { API_BASE_URL } from '@/config/app';
import type { ApiError } from '@/types/api.types';

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    const apiError: ApiError = error.response?.data ?? {
      code: 'NETWORK_ERROR',
      message: error.message || 'Network request failed',
    };
    return Promise.reject(apiError);
  },
);

/** @deprecated Use axiosClient — kept for Phase 1 imports */
export const apiClient = axiosClient;

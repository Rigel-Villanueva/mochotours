'use client';

import { API_URL } from '@/shared/config/env';
import { ROUTES } from '@/shared/config/routes';
import { ApiException } from './types';
import type { ValidationFieldError } from './types';

// ── Constantes ──────────────────────────────────────────────────────

const TOKEN_KEY         = 'token';
const REFRESH_TOKEN_KEY = 'refresh_token';

// ── Helpers de token ────────────────────────────────────────────────

function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function setRefreshToken(refreshToken: string): void {
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function removeToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ── Refresh automático ──────────────────────────────────────────────

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

/**
 * Intenta renovar la sesión usando el refresh_token.
 * Retorna true si logró obtener un nuevo access_token,
 * false si el refresh también falló (→ hay que hacer re-login).
 *
 * Usa un mutex para evitar múltiples llamadas concurrentes.
 */
async function attemptRefresh(): Promise<boolean> {
  // Si ya hay un refresh en curso, esperar su resultado
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  const savedRefreshToken = getRefreshToken();
  if (!savedRefreshToken) return false;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken: savedRefreshToken }),
      });

      if (!response.ok) return false;

      const json = await response.json();
      if (json.success && json.data) {
        setToken(json.data.accessToken);
        setRefreshToken(json.data.refreshToken);
        return true;
      }
      return false;
    } catch {
      return false;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

// ── Manejo de respuestas ────────────────────────────────────────────

/**
 * Procesa la respuesta del servidor.
 * Si recibe 401, intenta refresh automático antes de redirigir al login.
 *
 * @param retryFn - Función que re-ejecuta la request original (con el nuevo token)
 * @param hasRetried - Flag para evitar loops infinitos de retry
 */
async function handleResponse<T>(
  response: Response,
  retryFn?: () => Promise<Response>,
  hasRetried = false
): Promise<T> {
  // Si el token expiró, intentar refresh antes de rendirse
  if (response.status === 401 && !hasRetried && retryFn) {
    const refreshed = await attemptRefresh();
    if (refreshed) {
      // Reintentar la request original con el nuevo token
      const retryResponse = await retryFn();
      return handleResponse<T>(retryResponse, undefined, true);
    }

    // Refresh falló → limpiar y redirigir al login
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = ROUTES.ADMIN_LOGIN;
    }
    throw new ApiException('Sesión expirada. Inicia sesión nuevamente.', 401);
  }

  // 401 sin retry disponible (ya se intentó o no aplica)
  if (response.status === 401) {
    removeToken();
    if (typeof window !== 'undefined') {
      window.location.href = ROUTES.ADMIN_LOGIN;
    }
    throw new ApiException('Sesión expirada. Inicia sesión nuevamente.', 401);
  }

  // Permisos insuficientes
  if (response.status === 403) {
    throw new ApiException(
      'No tienes permisos para realizar esta acción.',
      403
    );
  }

  const json = await response.json();

  // Respuesta exitosa
  if (response.ok && json.success) {
    return json as T;
  }

  // Error de validación del backend (400)
  if (response.status === 400 && json.errors) {
    throw new ApiException(
      'Error de validación',
      400,
      json.errors as ValidationFieldError[]
    );
  }

  // Error genérico del backend
  throw new ApiException(
    json.error || json.message || 'Error inesperado del servidor',
    response.status
  );
}

// ── Headers base ────────────────────────────────────────────────────

function buildHeaders(withAuth: boolean): HeadersInit {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (withAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  return headers;
}

// ── Métodos del cliente ─────────────────────────────────────────────

/**
 * GET request.
 * @param path - Ruta relativa (ej: '/api/galeria')
 * @param params - Query params opcionales
 * @param withAuth - Si se debe enviar el token (default: false)
 */
async function get<T>(
  path: string,
  params?: Record<string, string | number>,
  withAuth = false
): Promise<T> {
  const url = new URL(path, API_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, String(value));
    });
  }

  const doFetch = () => fetch(url.toString(), {
    method: 'GET',
    headers: buildHeaders(withAuth),
    cache: 'no-store',
  });

  const response = await doFetch();
  return handleResponse<T>(response, withAuth ? doFetch : undefined);
}

/**
 * POST request con JSON body.
 * @param path - Ruta relativa
 * @param body - Objeto que se envía como JSON
 * @param withAuth - Si se debe enviar el token (default: true)
 */
async function post<T>(
  path: string,
  body: Record<string, unknown>,
  withAuth = true
): Promise<T> {
  const doFetch = () => fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: buildHeaders(withAuth),
    body: JSON.stringify(body),
  });

  const response = await doFetch();
  return handleResponse<T>(response, withAuth ? doFetch : undefined);
}

/**
 * POST request con FormData (multipart/form-data).
 * Usado para subir archivos (galería, site-content).
 * NO se pone Content-Type, el browser lo añade con el boundary.
 *
 * @param path - Ruta relativa
 * @param formData - FormData con los campos y archivos
 * @param withAuth - Si se debe enviar el token (default: true)
 */
async function postFormData<T>(
  path: string,
  formData: FormData,
  withAuth = true
): Promise<T> {
  const buildAuthHeaders = () => {
    const headers: Record<string, string> = {};
    if (withAuth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const doFetch = () => fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: buildAuthHeaders(),
    body: formData,
  });

  const response = await doFetch();
  return handleResponse<T>(response, withAuth ? doFetch : undefined);
}

/**
 * PUT request con FormData (multipart/form-data).
 * @param path - Ruta relativa
 * @param formData - FormData con los campos y archivos
 * @param withAuth - Si se debe enviar el token (default: true)
 */
async function putFormData<T>(
  path: string,
  formData: FormData,
  withAuth = true
): Promise<T> {
  const buildAuthHeaders = () => {
    const headers: Record<string, string> = {};
    if (withAuth) {
      const token = getToken();
      if (token) headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const doFetch = () => fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: buildAuthHeaders(),
    body: formData,
  });

  const response = await doFetch();
  return handleResponse<T>(response, withAuth ? doFetch : undefined);
}

/**
 * DELETE request.
 * @param path - Ruta relativa (ej: '/api/galeria/uuid')
 * @param withAuth - Si se debe enviar el token (default: true)
 */
async function del<T>(path: string, withAuth = true): Promise<T> {
  const doFetch = () => fetch(`${API_URL}${path}`, {
    method: 'DELETE',
    headers: buildHeaders(withAuth),
  });

  const response = await doFetch();
  return handleResponse<T>(response, withAuth ? doFetch : undefined);
}

/**
 * PUT request con JSON body.
 * @param path - Ruta relativa
 * @param body - Objeto que se envía como JSON
 * @param withAuth - Si se debe enviar el token (default: true)
 */
async function put<T>(
  path: string,
  body: Record<string, unknown>,
  withAuth = true
): Promise<T> {
  const doFetch = () => fetch(`${API_URL}${path}`, {
    method: 'PUT',
    headers: buildHeaders(withAuth),
    body: JSON.stringify(body),
  });

  const response = await doFetch();
  return handleResponse<T>(response, withAuth ? doFetch : undefined);
}

// ── Export del cliente ───────────────────────────────────────────────

export const apiClient = {
  get,
  post,
  put,
  postFormData,
  putFormData,
  delete: del,
} as const;


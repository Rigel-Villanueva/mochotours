import { apiClient } from '@/shared/api/apiClient';
import { AUTH_LOGIN } from '@/shared/config/api-endpoints';
import type { ApiResponse } from '@/shared/api/types';
import type { AuthSession, LoginInput } from '../model/types';

/**
 * Llama al endpoint POST /api/auth/login del backend.
 *
 * @param input - Email y contraseña del administrador
 * @returns La sesión con el accessToken y datos del usuario
 * @throws ApiException si las credenciales son inválidas (401)
 *         o hay error de validación (400)
 */
export async function login(input: LoginInput): Promise<AuthSession> {
  const response = await apiClient.post<ApiResponse<AuthSession>>(
    AUTH_LOGIN,
    input,
    false // No enviar token en login (aún no lo tenemos)
  );

  return response.data;
}

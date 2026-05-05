'use client';

import { useCallback, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '@/app/providers/auth-provider';
import { login as apiLogin } from '../api/authApi';
import { setToken, removeToken, setRefreshToken } from '@/shared/api/apiClient';
import { ROUTES } from '@/shared/config/routes';
import type { LoginInput, User } from './types';

/**
 * Hook de autenticación.
 *
 * Expone:
 * - user: datos del usuario logueado (o null)
 * - isAuthenticated: si hay sesión activa
 * - isLoading: si se está verificando la sesión al cargar
 * - login(input): autentica y guarda token
 * - logout(): borra token y redirige al login
 */
export function useAuth() {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }

  const { state, setState } = context;

  /**
   * Inicia sesión con email y contraseña.
   * Guarda el token en localStorage y actualiza el estado global.
   */
  const login = useCallback(
    async (input: LoginInput): Promise<User> => {
      const session = await apiLogin(input);

      // Guardar tokens en localStorage
      setToken(session.accessToken);
      setRefreshToken(session.refreshToken);

      // Actualizar estado global
      setState({
        user: session.user,
        isAuthenticated: true,
        isLoading: false,
      });

      return session.user;
    },
    [setState]
  );

  /**
   * Cierra sesión.
   * Limpia token, estado y redirige al login del admin.
   */
  const logout = useCallback(() => {
    removeToken();

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    router.push(ROUTES.ADMIN_LOGIN);
  }, [setState, router]);

  return {
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
  };
}

/**
 * Barrel export de la entidad User.
 * Este es el único punto de acceso público para importar
 * desde fuera de entities/user.
 */
export { useAuth } from './model/useAuth';
export type { User, AuthSession, LoginInput, AuthState } from './model/types';
export { login } from './api/authApi';

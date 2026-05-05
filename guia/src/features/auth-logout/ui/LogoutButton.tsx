'use client';

import { LogOut } from 'lucide-react';
import { useAuth } from '@/entities/user';

/**
 * Botón de cerrar sesión.
 * Al hacer click:
 *  1. Borra el token de localStorage
 *  2. Limpia el estado global del usuario
 *  3. Redirige a /admin/login
 */
export function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-stone-text hover:text-destructive hover:bg-red-50 rounded-lg transition-colors"
    >
      <LogOut className="size-5" />
      Cerrar sesión
    </button>
  );
}

'use client';

import { Menu, UserCircle2 } from 'lucide-react';
import { useAuth } from '@/entities/user';

type AdminHeaderProps = {
  title: string;
  onMenuToggle: () => void;
};

/**
 * Header superior del panel de administración.
 *
 * DESKTOP: muestra título + email del usuario.
 * MÓVIL: añade botón hamburguesa para abrir el sidebar.
 *
 * SEO: No necesita meta especial (páginas admin son noindex).
 */
export function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 lg:px-8 bg-white border-b border-stone-200">
      {/* Izquierda: hamburguesa (móvil) + título */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg hover:bg-stone-100 transition-colors"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="size-5 text-stone-dark" />
        </button>

        <h1 className="text-lg lg:text-xl font-semibold text-stone-dark truncate">
          {title}
        </h1>
      </div>

      {/* Derecha: email del usuario */}
      {user && (
        <div className="hidden sm:flex items-center gap-2 text-sm text-stone-text">
          <UserCircle2 className="size-5" />
          <span className="truncate max-w-[200px]">{user.email}</span>
        </div>
      )}
    </header>
  );
}

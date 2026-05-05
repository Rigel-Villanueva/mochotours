'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/entities/user';
import { ROUTES } from '@/shared/config/routes';
import { Loader2 } from 'lucide-react';

/**
 * Componente de protección de rutas admin.
 *
 * Verifica si hay un token válido al montarse:
 * - Si NO hay token → redirige a /admin/login
 * - Si SÍ hay token → renderiza el contenido protegido (children)
 * - Mientras verifica → muestra spinner de carga
 *
 * Se usa en el layout de las páginas protegidas del admin.
 * La página /admin/login NO pasa por este guard.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Si ya terminó de cargar y no está autenticado → redirigir
    if (!isLoading && !isAuthenticated) {
      router.replace(ROUTES.ADMIN_LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  // Mientras verifica la sesión → spinner centrado
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-cream">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-10 text-primary animate-spin" />
          <p className="text-sm text-stone-text">Verificando sesión…</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (el useEffect redirige)
  if (!isAuthenticated) {
    return null;
  }

  // Autenticado → mostrar contenido protegido
  return <>{children}</>;
}

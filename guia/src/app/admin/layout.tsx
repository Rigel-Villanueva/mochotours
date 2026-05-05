import type { Metadata } from 'next';

/**
 * Layout base de /admin.
 *
 * SEO: se marca como noindex/nofollow para que los buscadores
 * NO indexen el panel de administración (refuerza robots.txt).
 *
 * Este layout es compartido por TODAS las rutas de /admin,
 * incluyendo /admin/login.
 */
export const metadata: Metadata = {
  title: {
    default: 'Panel Admin',
    template: '%s | Admin — Mochotours',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

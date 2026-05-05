/**
 * Rutas del frontend público (Next.js App Router).
 * Se usan en navegación y links internos.
 */

export const ROUTES = {
  // ── Públicas ──────────────────────────────────────────────────────
  HOME: '/',
  GALLERY: '/galeria',
  GALLERY_ALBUM: (slug: string) => `/galeria/${slug}`,
} as const;


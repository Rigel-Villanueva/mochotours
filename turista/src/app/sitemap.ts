import type { MetadataRoute } from 'next';

/**
 * Sitemap dinámico para SEO.
 * Le dice a Google qué páginas existen y con qué prioridad indexarlas.
 * Accesible en: /sitemap.xml
 *
 * Incluye páginas estáticas + álbumes dinámicos de la galería.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cenotesmochotours.com';
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

  // ── Páginas estáticas ─────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/galeria`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // ── Álbumes dinámicos ─────────────────────────────────────────────
  let albumPages: MetadataRoute.Sitemap = [];

  try {
    const res = await fetch(`${apiUrl}/api/albumes`, {
      next: { revalidate: 3600 }, // Revalidar cada hora
    });

    if (res.ok) {
      const json = await res.json();
      const albums: { slug: string }[] = json.data ?? json ?? [];

      albumPages = albums.map((album) => ({
        url: `${baseUrl}/galeria/${album.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }
  } catch {
    // Si el backend falla, solo se generan las páginas estáticas.
    // Esto asegura que el sitemap siempre sea válido.
  }

  return [...staticPages, ...albumPages];
}

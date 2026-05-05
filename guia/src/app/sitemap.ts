import type { MetadataRoute } from 'next';

/**
 * Sitemap dinámico para SEO.
 * Le dice a Google qué páginas existen y con qué prioridad indexarlas.
 * Accesible en: /sitemap.xml
 *
 * Ref: framework_y_seo.txt → SEO TÉCNICO → C) SITEMAP.XML AUTOMÁTICO
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cenoteshomun.com';

  return [
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
}

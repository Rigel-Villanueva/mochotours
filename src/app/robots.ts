import type { MetadataRoute } from 'next';

/**
 * robots.txt dinámico para SEO.
 * Le dice a los buscadores qué pueden y qué no indexar.
 * El panel admin se bloquea para que Google no lo indexe.
 *
 * Ref: framework_y_seo.txt → SEO TÉCNICO → D) ROBOTS.TXT
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cenoteshomun.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/*'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

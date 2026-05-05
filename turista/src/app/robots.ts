import type { MetadataRoute } from 'next';

/**
 * robots.txt dinámico para SEO.
 * Le dice a los buscadores qué pueden indexar.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cenotesmochotours.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}


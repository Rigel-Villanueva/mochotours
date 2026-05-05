/**
 * Datos estructurados JSON-LD para SEO (Schema.org).
 *
 * Estos scripts invisibles le dicen a Google QUÉ tipo de negocio es,
 * dónde está, qué ofrece, etc. Activan los "rich snippets" en los
 * resultados de búsqueda (dirección, horario, estrellas, etc.)
 *
 * Ref: framework_y_seo.txt → SEO TÉCNICO → E) DATOS ESTRUCTURADOS
 * Schemas usados: LocalBusiness + TouristAttraction
 */

/**
 * Schema de LocalBusiness — información del negocio
 * para que Google muestre en el Map Pack.
 */
export function getLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: 'Cenotes Aventura y Más — Mochotours',
    description:
      'Tours guiados a los cenotes más impresionantes de Homún, Yucatán. Experiencia auténtica con moto-taxi tradicional y guía local.',
    url: 'https://cenoteshomun.com',
    telephone: '+529991234567',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Homún',
      addressLocality: 'Homún',
      addressRegion: 'Yucatán',
      postalCode: '97580',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 20.7333,
      longitude: -89.2833,
    },
    image: 'https://cenoteshomun.com/logo.png',
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '08:00',
      closes: '17:00',
    },
    sameAs: [
      // Agregar aquí las redes sociales del negocio cuando estén listas
    ],
    additionalType: 'https://schema.org/LocalBusiness',
    touristType: 'Eco-tourism',
    availableLanguage: ['Spanish', 'English'],
  };
}

/**
 * Componente Server que inyecta el JSON-LD en el head.
 * Se usa en el layout público.
 */
export function JsonLd() {
  const jsonLd = getLocalBusinessJsonLd();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

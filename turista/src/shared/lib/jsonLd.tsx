/**
 * Datos estructurados JSON-LD para SEO (Schema.org).
 *
 * Estos scripts invisibles le dicen a Google QUÉ tipo de negocio es,
 * dónde está, qué ofrece, etc. Activan los "rich snippets" en los
 * resultados de búsqueda (dirección, horario, estrellas, etc.)
 *
 * Ref: framework_y_seo.txt → SEO TÉCNICO → E) DATOS ESTRUCTURADOS
 * Schemas usados: LocalBusiness + TouristAttraction + Person
 */

/**
 * Schema de LocalBusiness + TouristAttraction — información del negocio
 * para que Google muestre en el Map Pack y rich snippets.
 */
export function getLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': ['TouristAttraction', 'LocalBusiness'],
    name: 'Cenotes Aventura y Más — Mochotours',
    description:
      'Tours guiados a cenotes como Tzajuncat, Holcozón, Baalmil, Yaxbacaltún y Santa Rosa en Homún, Yucatán. Guía local Pedro Poot Chan, certificado en primeros auxilios con más de 10 años de experiencia y más de 3,000 turistas atendidos. Transporte en moto-taxi tradicional. Grupos de 2 a 50 personas. A 1 hora de Mérida.',
    url: 'https://cenotesmochotours.com',
    telephone: '+529991200205',
    email: 'mochotours.homun@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Calle 20 entre 5 y 5a, a 50 metros de la gasolinera Pemex',
      addressLocality: 'Homún',
      addressRegion: 'Yucatán',
      postalCode: '97580',
      addressCountry: 'MX',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 20.7397,
      longitude: -89.2828,
    },
    image: 'https://cenotesmochotours.com/og-image.png',
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
      opens: '09:00',
      closes: '18:00',
    },
    sameAs: [
      'https://www.facebook.com/share/18C6QNCUUg/',
      'https://www.instagram.com/mochotours?igsh=cXByOTNmOWprcXlv',
      'https://www.tiktok.com/@homun.yuc.mochoto?_r=1&_t=ZS-95i6sSsnp1l',
    ],
    employee: {
      '@type': 'Person',
      name: 'Pedro Poot Chan',
      jobTitle: 'Guía Turístico Local',
      description: 'Guía certificado en primeros auxilios con más de 10 años de experiencia en cenotes de Homún. Conoce más de 150 cenotes en la zona. Habla español y maya.',
      knowsLanguage: ['es', 'myn'],
      birthPlace: {
        '@type': 'Place',
        name: 'Homún, Yucatán, México',
      },
    },
    touristType: 'Eco-tourism',
    availableLanguage: ['Spanish', 'Maya'],
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

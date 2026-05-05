import { HeroSection } from '@/widgets/hero-section';
import { AboutGuide } from '@/widgets/about-guide';
import { ExperienceInfo } from '@/widgets/experience-info';
import { GalleryPreview } from '@/widgets/gallery-preview';
import { LocationMap } from '@/widgets/location-map';
import { ContactFooter } from '@/widgets/contact-footer';
import { FaqSection } from '@/widgets/faq-section';
import { FALLBACK_DATA } from '@/shared/config/public-data';
import { getContactInfoISR } from '@/shared/api/getContactInfo';

export const revalidate = 300;

export const metadata = {
  title: 'Cenotes Homún Yucatán | Tours, Ubicación y Reservaciones | Mochotours',
  description: 'Tours guiados de 4 a 5 horas por los cenotes de Homún, Yucatán con Pedro Poot, guía local con +10 años de experiencia. Recorre Tzajuncat, Holcozón, Baalmil, Yaxbacaltún y Santa Rosa en moto-taxi tradicional. Grupos de 2 a 50 personas. A 1 hora de Mérida.',
};

export default async function HomePage() {
  const contactInfo = await getContactInfoISR();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TouristAttraction'],
    name: FALLBACK_DATA.identidad.nombre_negocio,
    description: 'Tours guiados a cenotes como Tzajuncat, Holcozón, Baalmil, Yaxbacaltún y Santa Rosa en Homún, Yucatán. Guía local Pedro Poot Chan, certificado en primeros auxilios con más de 10 años de experiencia y más de 3,000 turistas atendidos. Transporte en moto-taxi tradicional. Grupos de 2 a 50 personas. A 1 hora de Mérida.',
    url: 'https://cenotesmochotours.com',
    telephone: `+${FALLBACK_DATA.contacto.telefono_whatsapp_principal}`,
    email: 'mochotours.homun@gmail.com',
    image: 'https://cenotesmochotours.com/og-image.png',
    priceRange: '$$',
    address: {
      '@type': 'PostalAddress',
      streetAddress: FALLBACK_DATA.ubicacion.direccion,
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
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '11',
    },
    openingHoursSpecification: [
      {
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
    ],
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div id="inicio" className="w-full">
         <HeroSection />
      </div>

      <section id="sobre-mi">
        <AboutGuide />
      </section>

      <section id="experiencia">
        <ExperienceInfo />
      </section>

      <section id="galeria">
        <GalleryPreview />
      </section>

      <section id="ubicacion">
        <LocationMap contactInfo={contactInfo} />
      </section>

      <div id="contacto">
        <ContactFooter contactInfo={contactInfo} />
      </div>

      <section id="faq">
        <FaqSection />
      </section>
    </>
  );
}

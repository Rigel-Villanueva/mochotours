import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Galería de Fotos y Videos — Cenotes de Homún',
  description: 'Fotos y videos reales de cenotes en Homún, Yucatán. Aguas turquesas, cavernas milenarias y tours guiados. Imágenes de Tzajuncat, Holcozón, Baalmil, Yaxbacaltún y Santa Rosa.',
  alternates: {
    canonical: 'https://cenotesmochotours.com/galeria',
  },
};

export default function GaleriaLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    "name": "Fotos y Videos de los Cenotes de Homún",
    "description": "Galería oficial de Cenotes Aventura y Más en Homún, Yucatán. Fotos y videos de las aguas turquesas, cavernas y experiencias en el cenote.",
    "url": "https://cenotesmochotours.com/galeria",
    "about": {
      "@type": "TouristAttraction",
      "name": "Cenotes Aventura y Más Homún",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Homún",
        "addressRegion": "Yucatán",
        "addressCountry": "MX"
      }
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      {children}
    </>
  );
}

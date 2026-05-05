/**
 * English Resilient Hardcoded Data
 * Serves as an immediate fallback in case of network latency or database failure.
 */

export const PUBLIC_LINKS_EN = [
  { label: 'Home', href: '#inicio' },
  { label: 'About Me', href: '#sobre-mi' },
  { label: 'Experience', href: '#experiencia' },
  { label: 'Gallery', href: '#galeria' },
  { label: 'Location', href: '#ubicacion' },
  { label: 'Contact', href: '#contacto' },
];

export const FALLBACK_DATA_EN = {
  identidad: {
    nombre_negocio: "Cenotes Aventura y Más",
    subtitulo: "Homún Yuc Mochotours",
    eslogan: "4 to 5-hour guided tours through the most impressive cenotes in Homún, Yucatán. Visit up to 4 cenotes in a traditional moto-taxi with Pedro Poot, a local guide with over 10 years of experience. Groups from 2 to 50 people.",
  },
  heroBanner: {
    titulo: "Cenotes Aventura y Más",
    descripcion: "4 to 5-hour guided tours through the most impressive cenotes in Homún, Yucatán. Visit up to 4 cenotes in a traditional moto-taxi with Pedro Poot, a local guide with over 10 years of experience.",
    imagenUrl: "/cenote-hero-principal-homun.png"
  },
  aboutGuide: {
    nombre_completo: "Pedro Poot Chan",
    nombre_corto: "Pedro",
    años_experiencia: 10,
    idiomas: ["Spanish", "Maya", "Basic English"],
    es_local: "100% from Homún",
    historia: "I am Pedro Poot Chan, a local guide certified in first aid, originally from Homún, Yucatán. For over 10 years I have guided more than 3,000 tourists through the cenotes of my homeland. I know over 150 cenotes in the area, 32 of which are open to the public. I decided to become a guide to share the culture, gastronomy, and natural wonders of my beautiful Homún. I speak Spanish and Maya, and every tour is an authentic experience where you don't just swim in crystal-clear waters, but also learn about the history and traditions of the Mayan culture.",
    imagenUrl: "/guia-turistico-pedro-poot-homun.jpeg",
    chips: [
      { label: "Spanish and Maya", icon: "languages" },
      { label: "10 years experience", icon: "award" },
      { label: "100% local from Homún", icon: "map-pin" },
      { label: "+3,000 tourists guided", icon: "users" },
      { label: "Knows +150 cenotes", icon: "trees" },
      { label: "First aid certified", icon: "shield" },
    ]
  },
  experiencia: {
    tarjetas: [
      { icon: "clock",        titulo: "4 to 5 hours",         descripcion: "Average duration of the complete cenote tour." },
      { icon: "trees",        titulo: "3 to 4 cenotes",       descripcion: "Visit family, extreme, or cave cenotes, you choose." },
      { icon: "bike",         titulo: "Moto-taxi or vehicle", descripcion: "Transportation in a traditional moto-taxi or private vehicle." },
      { icon: "map-pin",      titulo: "Meeting point",        descripcion: "Calle 20 between 5 and 5a, 50 meters from Pemex gas station, Homún." },
      { icon: "users",        titulo: "2 to 50 people",       descripcion: "Private and family tours. Proper equipment for any group size." },
      { icon: "languages",    titulo: "Spanish and Maya",     descripcion: "Your guide speaks Spanish and Maya, connecting you with local culture." },
      { icon: "backpack",     titulo: "What to bring",        descripcion: "Comfortable clothes, towel. NO sunscreen. Guide rents mandatory life jackets for $70 MXN for the whole tour." },
      { icon: "baby",         titulo: "Suitable for all ages",descripcion: "We welcome babies, children, and seniors. Easy-access cenotes for everyone." },
      { icon: "settings",     titulo: "Custom groups",        descripcion: "We adapt the route for your family or large groups up to 50 people. Choose calm, extreme, or cave cenotes." },
    ],
    mototaxi: {
      imagenUrl: "/mototaxi-tradicional-maya-homun.jpg",
      titulo: "Travel like a local",
      descripcion: "Our tours use traditional moto-taxis, an authentic experience you won't find in conventional tourist tours."
    }
  },
  galeriaPreview: [
    { src: "/galeria/cenote-boveda-luz-natural-homun.jpg", alt: "Cenote with natural vault and light beam in Homún, Yucatán" },
    { src: "/galeria/cenote-raices-naturaleza-yucatan.jpg", alt: "Tree roots hanging inside a cenote in Yucatán" },
    { src: "/galeria/cenote-agua-cristalina-peces.jpg", alt: "Crystal clear water with fish in a Homún cenote" },
    { src: "/galeria/cenote-aventura-extrema-homun.jpg", alt: "Tourist enjoying extreme adventure in a Homún cenote" },
    { src: "/galeria/cenote-grupo-turistas-raices.jpg", alt: "Group of tourists swimming among roots in a Yucatecan cenote" },
    { src: "/galeria/cenote-nadando-pareja-yucatan.jpg", alt: "Couple swimming in a turquoise cenote in Yucatán" },
  ],
  ubicacion: {
    titulo: "Visit us in Homún, Yucatán",
    direccion: "Calle 20 between 5 and 5a, 50 meters from Pemex gas station, Homún, Yucatán",
    horarios: "Every day of the year",
    google_maps_url: "https://maps.app.goo.gl/epEZ3vdkxuceZmgp7",
    google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7400.362393888818!2d-89.27868038730578!3d20.746989053648907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f568d08de4201d1%3A0xd7fe72d305c2da0a!2sCenotes%20Hom%C3%BAn%20Yucat%C3%A1n%20mochotours!5e0!3m2!1ses-419!2smx!4v1776483743944!5m2!1ses-419!2smx",
    imagenUrl: "/cenote-vista-exterior-homun.jpg",
  },
  footer: {
    titulo: "Ready for the adventure?",
    descripcion: "Book your cenote tour in Homún directly with Pedro Poot, no middlemen or agencies. We respond in less than 10 minutes via WhatsApp. Over 3,000 satisfied tourists in 10 years.",
    imagenUrl: "/cenote-cristalino-footer-homun.jpg",
  },
  contacto: {
    telefono_whatsapp_principal: "529991200205",
    telefono_whatsapp_secundario: "529994166437"
  }
};

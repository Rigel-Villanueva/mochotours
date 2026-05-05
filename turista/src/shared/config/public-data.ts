/**
 * Datos Hardcodeados Resilientes
 * Funcionan como `Fallback` inmediato en caso de latencia de red o si la 
 * base de datos falla al cargar. El robot de Google (SEO) leerá esto como
 * capa estática de respaldo, asegurando que nada luzca vacío jamás.
 */

export const PUBLIC_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Sobre Mí', href: '#sobre-mi' },
  { label: 'Experiencia', href: '#experiencia' },
  { label: 'Galería', href: '#galeria' },
  { label: 'Ubicación', href: '#ubicacion' },
  { label: 'Contacto', href: '#contacto' },
];

export const FALLBACK_DATA = {
  identidad: {
    nombre_negocio: "Cenotes Aventura y Más",
    subtitulo: "Homún Yuc Mochotours",
    eslogan: "Tours guiados de 4 a 5 horas por los cenotes más impresionantes de Homún, Yucatán. Recorre hasta 4 cenotes en moto-taxi tradicional con Pedro Poot, guía local con más de 10 años de experiencia. Grupos desde 2 hasta 50 personas.",
  },
  heroBanner: {
    titulo: "Cenotes Aventura y Más",
    descripcion: "Tours guiados de 4 a 5 horas por los cenotes más impresionantes de Homún, Yucatán. Recorre hasta 4 cenotes en moto-taxi tradicional con Pedro Poot, guía local con más de 10 años de experiencia.",
    // Placeholder físico, un fallback local sólido (o un link externo a una imagen estática default)
    imagenUrl: "/cenote-hero-principal-homun.png"
  },
  aboutGuide: {
    nombre_completo: "Pedro Poot Chan",
    nombre_corto: "Pedro",
    años_experiencia: 10,
    idiomas: ["Español", "Maya"],
    es_local: "100% de Homún",
    historia: "Soy Pedro Poot Chan, guía local certificado en primeros auxilios, originario de Homún, Yucatán. En más de 10 años he guiado a más de 3,000 turistas por los cenotes de mi tierra. Conozco más de 150 cenotes en la zona, de los cuales 32 están abiertos al público. Decidí emprender como guía para compartir la cultura, la gastronomía y las maravillas naturales de mi bello Homún. Hablo español y maya, y cada tour es una experiencia auténtica donde no solo nadas en aguas cristalinas, sino que conoces la historia y tradiciones de la cultura maya.",
    imagenUrl: "/guia-turistico-pedro-poot-homun.jpeg",
    chips: [
      { label: "Español y Maya", icon: "languages" },
      { label: "10 años de experiencia", icon: "award" },
      { label: "100% local de Homún", icon: "map-pin" },
      { label: "+3,000 turistas guiados", icon: "users" },
      { label: "Conoce +150 cenotes", icon: "trees" },
      { label: "Primeros auxilios", icon: "shield" },
    ]
  },
  experiencia: {
    tarjetas: [
      // ─── DATOS ✅ REALES (del documento del guía) ───
      { icon: "clock",        titulo: "4 a 5 horas",          descripcion: "Duración promedio del tour completo por los cenotes." },
      { icon: "trees",        titulo: "3 a 4 cenotes",        descripcion: "Recorre cenotes familiares, extremos o grutas, tú eliges." },
      { icon: "bike",         titulo: "Moto-taxi o vehículo", descripcion: "Transporte en moto-taxi tradicional o vehículo particular." },
      { icon: "map-pin",      titulo: "Punto de encuentro",   descripcion: "Calle 20 entre 5 y 5a, a 50 metros de la gasolinera Pemex, Homún." },
      { icon: "users",        titulo: "2 a 50 personas",      descripcion: "Tours privados y familiares. Equipo adecuado para cualquier tamaño de grupo." },
      { icon: "languages",    titulo: "Español y Maya",       descripcion: "Tu guía habla español y maya, conectándote con la cultura local." },
      { icon: "backpack",     titulo: "Qué llevar",           descripcion: "Ropa cómoda, toalla. NO bloqueadores. El guía renta chalecos obligatorios por $70 MXN para todo el tour." },
      // ─── DATOS ✅ REALES (verificado con el guía) ───
      { icon: "baby",         titulo: "Apto para todas las edades",    descripcion: "Aceptamos bebés, niños y adultos mayores. Cenotes de fácil acceso para todos." },
      { icon: "settings",     titulo: "Grupos y familias a tu medida",  descripcion: "Adaptamos la ruta para tu familia o para grupos grandes de hasta 50 personas. Elige cenotes tranquilos, extremos o grutas." },
    ],
    mototaxi: {
      imagenUrl: "/mototaxi-tradicional-maya-homun.jpg",
      titulo: "Viaja como local",
      descripcion: "Nuestros tours usan moto-taxi tradicional, una experiencia auténtica que no encontrarás en tours turísticos convencionales."
    }
  },
  galeriaPreview: [
    { src: "/galeria/cenote-boveda-luz-natural-homun.jpg", alt: "Cenote con bóveda natural y haz de luz en Homún, Yucatán" },
    { src: "/galeria/cenote-raices-naturaleza-yucatan.jpg", alt: "Raíces de árboles colgando dentro de un cenote en Yucatán" },
    { src: "/galeria/cenote-agua-cristalina-peces.jpg", alt: "Agua cristalina con peces en cenote de Homún" },
    { src: "/galeria/cenote-aventura-extrema-homun.jpg", alt: "Turista disfrutando aventura extrema en cenote de Homún" },
    { src: "/galeria/cenote-grupo-turistas-raices.jpg", alt: "Grupo de turistas nadando entre raíces en cenote yucateco" },
    { src: "/galeria/cenote-nadando-pareja-yucatan.jpg", alt: "Pareja nadando en cenote turquesa de Yucatán" },
  ],
  ubicacion: {
    titulo: "Visítanos en Homún, Yucatán",
    direccion: "Calle 20 entre 5 y 5a, a 50 metros de la gasolinera Pemex, Homún, Yucatán", // ✅ REAL
    horarios: "Todos los días del año", // ✅ REAL
    google_maps_url: "https://maps.app.goo.gl/epEZ3vdkxuceZmgp7", // ✅ REAL
    google_maps_embed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7400.362393888818!2d-89.27868038730578!3d20.746989053648907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f568d08de4201d1%3A0xd7fe72d305c2da0a!2sCenotes%20Hom%C3%BAn%20Yucat%C3%A1n%20mochotours!5e0!3m2!1ses-419!2smx!4v1776483743944!5m2!1ses-419!2smx",
    imagenUrl: "/cenote-vista-exterior-homun.jpg",
  },
  footer: {
    titulo: "¿Listo para la aventura?",
    descripcion: "Reserva tu tour de cenotes en Homún directo con Pedro Poot, sin intermediarios ni agencias. Respondemos en menos de 10 minutos por WhatsApp. Más de 3,000 turistas satisfechos en 10 años.",
    imagenUrl: "/cenote-cristalino-footer-homun.jpg",
  },
  contacto: {
    telefono_whatsapp_principal: "529991200205",
    telefono_whatsapp_secundario: "529994166437"
  }
};
